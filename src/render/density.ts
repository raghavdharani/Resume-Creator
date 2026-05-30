export interface DensityBullet {
  text: string;
}

export interface DensityExperience {
  bullets?: Array<string | DensityBullet>;
}

export interface DensityDocument {
  summary?: string;
  strengths?: Array<{ skills?: string[] }>;
  experience?: DensityExperience[];
}

export type DensityWarningCode =
  | "long_bullet"
  | "too_many_bullets"
  | "page_pressure";

export interface DensityWarning {
  code: DensityWarningCode;
  message: string;
  severity: "warning" | "high";
  experienceIndex?: number;
  bulletIndex?: number;
}

export interface DensityAnalysis {
  bulletCount: number;
  longBulletCount: number;
  estimatedPages: number;
  estimatedCharacterLoad: number;
  warnings: DensityWarning[];
}

const LONG_BULLET_CHARACTERS = 220;
const RECOMMENDED_MAX_BULLETS = 20;
// Calibrated against real product-manager and technical-specialist resume renders.
// Resume metadata, headings, and print spacing consume more room than raw text implies.
const APPROXIMATE_CHARACTERS_PER_PAGE = 3_000;

function bulletText(bullet: string | DensityBullet): string {
  return typeof bullet === "string" ? bullet : bullet.text;
}

export function analyzeResumeDensity(document: DensityDocument): DensityAnalysis {
  const warnings: DensityWarning[] = [];
  let bulletCount = 0;
  let longBulletCount = 0;
  let bulletCharacters = 0;

  for (const [experienceIndex, experience] of (document.experience ?? []).entries()) {
    for (const [bulletIndex, bullet] of (experience.bullets ?? []).entries()) {
      const text = bulletText(bullet).trim();
      bulletCount += 1;
      bulletCharacters += text.length;

      if (text.length > LONG_BULLET_CHARACTERS) {
        longBulletCount += 1;
        warnings.push({
          code: "long_bullet",
          severity: "warning",
          experienceIndex,
          bulletIndex,
          message: `Bullet ${bulletIndex + 1} in experience ${experienceIndex + 1} is ${text.length} characters; consider splitting or tightening it.`,
        });
      }
    }
  }

  if (bulletCount > RECOMMENDED_MAX_BULLETS) {
    warnings.push({
      code: "too_many_bullets",
      severity: "warning",
      message: `Resume has ${bulletCount} bullets; consider reducing toward ${RECOMMENDED_MAX_BULLETS} or fewer for faster scanning.`,
    });
  }

  const strengthCharacters = (document.strengths ?? []).reduce(
    (total, group) => total + (group.skills ?? []).join(" | ").length,
    0,
  );
  const estimatedCharacterLoad =
    bulletCharacters + (document.summary?.length ?? 0) + strengthCharacters;
  const estimatedPages = Math.max(
    1,
    Math.ceil(estimatedCharacterLoad / APPROXIMATE_CHARACTERS_PER_PAGE),
  );

  if (estimatedPages > 2) {
    warnings.push({
      code: "page_pressure",
      severity: "high",
      message: `Content load suggests approximately ${estimatedPages} pages before layout adjustments; review spacing and lower-value content.`,
    });
  }

  return {
    bulletCount,
    longBulletCount,
    estimatedPages,
    estimatedCharacterLoad,
    warnings,
  };
}
