import { cft } from "console-fail-test";
import tape from "tape";

tape.createStream().pipe(process.stdout);

cft({ testFramework: tape });
