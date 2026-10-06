import { extendTest } from "console-fail-test";
import { test as base } from "vitest";

export const test = extendTest(base);
