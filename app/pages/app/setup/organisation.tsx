import { useForm } from "react-cool-form";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";

import { useAuthUser } from "src/hooks/use-auth-user";
import { Auth } from "src/components/auth";
import { api } from "src/utils/api-client";

const auth = getAuth();
const db = getFirestore();

export default function OrganisationSetup() {
  const authUser = useAuthUser();

  const { form, use } = useForm({
    onSubmit: async (values) => {
      // Create organisation
      const org = await addDoc(collection(db, "organisations"), {
        name: values.name,
        billingEmail: authUser.email,
        plan: "free",
      });

      // Create organisation user
      await addDoc(collection(db, "organisationUsers"), {
        user: doc(db, "users", authUser.email),
        organisation: doc(db, "organisations", org.id),
        role: "owner",
        status: "active",
      });

      // Create stripe customer
      const stripeCustomer = await api.post("/api/stripe/customers/create", {
        email: authUser.email,
        name: values.name,
      });
      await updateDoc(doc(db, "organisations", org.id), {
        stripeCustomerId: stripeCustomer.data?.id,
      });
    },
  });

  return (
    <Auth>
      <h1>{authUser.email}: Organisation setup</h1>

      <form ref={form}>
        <input type="text" name="name" />

        <button type="submit" disabled={use("isSubmitting")}>
          Create Organisation
        </button>
      </form>
      <button onClick={() => auth.signOut()}>Logout</button>
    </Auth>
  );
}
