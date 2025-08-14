"use client";

"use client";

import { Amplify } from "aws-amplify";

// Try to import outputs, but handle gracefully if not available
let outputs: any = {};
try {
  outputs = require("@/amplify_outputs.json");
} catch (error) {
  console.warn(
    "amplify_outputs.json not found. Using empty configuration for build."
  );
  outputs = {
    version: "1.3",
    auth: {},
    data: {},
    storage: {},
  };
}

Amplify.configure(outputs);

// Deprecated
// Amplify.configure(config, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  return null;
}