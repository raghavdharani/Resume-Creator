# Firebase Functions Scaffold

This package contains authenticated Firebase callable function scaffolding for:

- `tailorResumeWithAi`
- `generateResumePdf`

Both functions reject unauthenticated requests and validate payload shape before
reaching integration TODOs. The AI scaffold declares `AI_PROVIDER_API_KEY` and
`AI_PROVIDER_BASE_URL` through Secret Manager parameters. Do not commit provider
credentials.

## Local checks

```powershell
npm install
npm run build
```

The Firestore rules test source is intentionally included without requiring the
emulator during normal verification. Run it with the Firestore emulator when
needed:

```powershell
npm run test:rules
```

Provider calls and server-side PDF rendering are intentionally not implemented.
