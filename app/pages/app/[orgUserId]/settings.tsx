import { getAuth } from "firebase/auth";

import { Auth } from "src/components/auth";

const auth = getAuth();

export default function OrganisationSettings() {
  return (
    <Auth>
      <p>Organisation Settings</p>
      <hr />

      <button onClick={() => auth.signOut()}>Logout</button>
    </Auth>
  );
}
