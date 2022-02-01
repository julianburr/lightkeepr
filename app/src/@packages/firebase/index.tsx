import React from "react";
import { PropsWithChildren } from "react";

import { AuthProvider, useAuth } from "./auth";
import { useCollection } from "./firestore/collection";
import { FirestoreProvider } from "./firestore/context";
import { useDocument } from "./firestore/document";

type FirebaseProviderProps = PropsWithChildren<Record<never, any>>;

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  return (
    <AuthProvider>
      <FirestoreProvider>{children}</FirestoreProvider>
    </AuthProvider>
  );
}

export { useAuth, useDocument, useCollection };
