"use client";

import { Amplify } from "aws-amplify";
import { useEffect, useState } from "react";

interface AmplifyConfig {
  version: string;
  auth?: any;
  data?: any;
  storage?: any;
}

// Try to import outputs, but handle gracefully if not available
let outputs: AmplifyConfig = {
  version: "1.3",
  auth: {},
  data: {},
  storage: {},
};

try {
  outputs = require("@/amplify_outputs.json");
} catch (error) {
  console.warn(
    "amplify_outputs.json not found. Using empty configuration for build."
  );
}

export default function ConfigureAmplify() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      Amplify.configure(outputs);
      setIsConfigured(true);
      console.log("✅ Amplify configured successfully");
    } catch (err) {
      console.error("❌ Failed to configure Amplify:", err);
      setError(err instanceof Error ? err.message : "Failed to configure Amplify");
    }
  }, []);

  // Component pour le développement - affiche le statut
  if (process.env.NODE_ENV === "development") {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className={`px-3 py-2 rounded-md text-sm ${
          isConfigured 
            ? "bg-green-100 text-green-800 border border-green-200" 
            : error
            ? "bg-red-100 text-red-800 border border-red-200"
            : "bg-yellow-100 text-yellow-800 border border-yellow-200"
        }`}>
          {isConfigured ? "🟢 Amplify Ready" : error ? "🔴 Amplify Error" : "🟡 Amplify Loading"}
          {error && <div className="text-xs mt-1">{error}</div>}
        </div>
      </div>
    );
  }

  return null;
}

// Export pour usage dans d'autres composants
export const getAmplifyConfig = () => outputs;
export const isAmplifyConfigured = () => {
  try {
    return !!outputs.data && Object.keys(outputs.data).length > 0;
  } catch {
    return false;
  }
};