"use client";

import { Amplify } from "aws-amplify";
import { CookieStorage } from "aws-amplify/utils";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs, { ssr: true });

cognitoUserPoolsTokenProvider.setKeyValueStorage(
  new CookieStorage({
    domain: typeof window !== "undefined" ? window.location.hostname : "localhost",
    path: "/",
    expires: 30,
    secure: false,
    sameSite: "lax",
  })
);

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
