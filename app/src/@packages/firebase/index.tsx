import React from "react";

import { AuthProvider, useAuth } from "./auth";
import { FirestoreProvider } from "./firestore/context";
import { useDocument } from "./firestore/document";
import { useCollection } from "./firestore/collection";

export function FirebaseProvider({ children }) {
  return (
    <AuthProvider>
      <FirestoreProvider>{children}</FirestoreProvider>
    </AuthProvider>
  );
}

export { useAuth, useDocument, useCollection };
