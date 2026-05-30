import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { afterAll, beforeAll, describe, it } from "vitest";

describe("firestore tenant isolation rules", () => {
  let testEnv: RulesTestEnvironment;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "resume-application-rules-test",
      firestore: {
        rules: readFileSync(resolve(__dirname, "../../firestore.rules"), "utf8"),
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  it("allows an authenticated user to write inside their tenant path", async () => {
    const db = testEnv.authenticatedContext("user-a").firestore();

    await assertSucceeds(
      setDoc(doc(db, "users/user-a/resumes/resume-1"), { title: "Owned" }),
    );
  });

  it("denies cross-tenant reads", async () => {
    const db = testEnv.authenticatedContext("user-a").firestore();

    await assertFails(getDoc(doc(db, "users/user-b/resumes/resume-1")));
  });

  it("denies unauthenticated reads", async () => {
    const db = testEnv.unauthenticatedContext().firestore();

    await assertFails(getDoc(doc(db, "users/user-a/resumes/resume-1")));
  });

  it("allows an explicitly provisioned admin to read candidate records", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "admins/admin-a"), { active: true });
      await setDoc(doc(context.firestore(), "users/user-b/resumes/resume-1"), {
        title: "Admin visible"
      });
    });

    const db = testEnv.authenticatedContext("admin-a").firestore();

    await assertSucceeds(getDoc(doc(db, "users/user-b/resumes/resume-1")));
  });
});
