import { getAuth } from "firebase/auth";

import { Auth } from "src/components/auth";

const auth = getAuth();

export default function OrganisationDashboard() {
  return (
    <Auth>
      <p>Organisation Dashboard</p>
      <hr />

      <button onClick={() => auth.signOut()}>Logout</button>
    </Auth>
  );
}
