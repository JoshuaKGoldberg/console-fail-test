import { test as base } from "@playwright/test";
import { extendTest } from "console-fail-test";

export const test = extendTest(base);
