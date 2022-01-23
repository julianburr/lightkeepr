import React from "react";

import { AuthProvider, useAuth } from "./auth";
import { FirestoreProvider } from "./firestore/context";
import { useDocument } from "./firestore/document";
import { useCollection } from "./firestore/collection";
import { PropsWithChildren } from "react";

type FirebaseProviderProps = PropsWithChildren<Record<never, any>>;

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  return (
    <AuthProvider>
      <FirestoreProvider>{children}</FirestoreProvider>
    </AuthProvider>
  );
}

export { useAuth, useDocument, useCollection };
