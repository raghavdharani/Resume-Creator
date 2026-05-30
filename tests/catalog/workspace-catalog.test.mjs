import assert from "node:assert/strict";

import { workspaceCatalog } from "../../src/data/workspace-catalog.generated.ts";

const raghav = workspaceCatalog.profiles.find((profile) => profile.slug === "raghav_dharani");
const aatmika = workspaceCatalog.profiles.find((profile) => profile.slug === "aatmika_natarajan");

assert.ok(raghav, "Raghav profile should be present in the browser-safe catalog.");
assert.ok(aatmika, "Aatmika profile should be present in the browser-safe catalog.");
assert.equal(raghav.sourceResumes.length, 7, "Raghav source resume count changed unexpectedly.");
assert.equal(aatmika.sourceResumes.length, 5, "Aatmika source resume count changed unexpectedly.");
assert.equal(raghav.jobDescriptions.length, 2, "Raghav prior JDs should be loaded from his own folder.");
assert.equal(aatmika.jobDescriptions.length, 1, "Aatmika prior JDs should be loaded from her own folder.");
assert.equal(raghav.collaterals.length, 45, "Raghav collateral inventory changed unexpectedly.");
assert.equal(aatmika.collaterals.length, 13, "Aatmika collateral inventory changed unexpectedly.");
assert.equal(raghav.evidence.length, 14, "Raghav evidence should be loaded from his own context files.");
assert.equal(aatmika.evidence.length, 0, "Aatmika must not inherit evidence from another profile.");
assert.equal(aatmika.forbiddenClaims.length, 9, "Aatmika guardrails should be loaded from her own context files.");

console.log("Workspace catalog profile isolation checks passed.");
