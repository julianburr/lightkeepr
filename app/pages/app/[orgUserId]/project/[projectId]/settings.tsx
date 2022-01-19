import { getAuth } from "firebase/auth";

import { Auth } from "src/components/auth";

const auth = getAuth();

export default function ProjectDashboard() {
  return (
    <Auth>
      <p>Project Settings</p>
      <hr />

      <button onClick={() => auth.signOut()}>Logout</button>
    </Auth>
  );
}
