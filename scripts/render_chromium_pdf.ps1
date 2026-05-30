param(
  [Parameter(Mandatory = $true)]
  [string]$InputHtml,

  [Parameter(Mandatory = $true)]
  [string]$OutputPdf,

  [string]$BrowserPath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
)

$resolvedInput = (Resolve-Path -LiteralPath $InputHtml).Path
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputPdf)

if (-not (Test-Path -LiteralPath $BrowserPath)) {
  throw "Chromium browser executable not found: $BrowserPath"
}

if (Test-Path -LiteralPath $resolvedOutput) {
  throw "Refusing to overwrite existing PDF artifact: $resolvedOutput. Use a versioned output filename."
}

$outputDirectory = Split-Path -Parent $resolvedOutput
if (-not (Test-Path -LiteralPath $outputDirectory)) {
  New-Item -ItemType Directory -Path $outputDirectory | Out-Null
}

$inputUri = [System.Uri]::new($resolvedInput).AbsoluteUri
$profilePath = Join-Path $env:TEMP ("resume-os-edge-" + [System.Guid]::NewGuid().ToString("N"))

try {
  & $BrowserPath `
    "--headless" `
    "--disable-gpu" `
    "--no-pdf-header-footer" `
    "--user-data-dir=$profilePath" `
    "--print-to-pdf=$resolvedOutput" `
    $inputUri

  # Edge may return before the background renderer finishes flushing the PDF.
  # Wait until the artifact exists and its size has remained stable briefly.
  $deadline = (Get-Date).AddSeconds(30)
  $lastLength = -1
  $stableChecks = 0

  while ((Get-Date) -lt $deadline) {
    if (Test-Path -LiteralPath $resolvedOutput) {
      $currentLength = (Get-Item -LiteralPath $resolvedOutput).Length
      if ($currentLength -gt 0 -and $currentLength -eq $lastLength) {
        $stableChecks += 1
      } else {
        $stableChecks = 0
        $lastLength = $currentLength
      }

      if ($stableChecks -ge 2) {
        break
      }
    }

    Start-Sleep -Milliseconds 250
  }

  if (-not (Test-Path -LiteralPath $resolvedOutput) -or (Get-Item -LiteralPath $resolvedOutput).Length -eq 0) {
    throw "Chromium renderer did not create the expected PDF: $resolvedOutput"
  }

  Write-Output "Rendered Chromium PDF: $resolvedOutput"
} finally {
  if (Test-Path -LiteralPath $profilePath) {
    Remove-Item -LiteralPath $profilePath -Recurse -Force -ErrorAction SilentlyContinue
  }
}
