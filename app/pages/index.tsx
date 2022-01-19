import { PropsWithChildren } from "react";
import { useAuthUser } from "src/hooks/use-auth-user";

type AuthLayoutProps = PropsWithChildren<Record<never, any>>;

function AuthLayout({ children }: AuthLayoutProps) {
  const authUser = useAuthUser();
  console.log({ authUser });

  if (!authUser.uid) {
    return <p>Login screen</p>;
  }

  if (!authUser.user) {
    return <p>User setup</p>;
  }

  if (!authUser.organisationUser) {
    return <p>Org setup</p>;
  }

  return <>{children}</>;
}

export default function HomeScreen() {
  return (
    <AuthLayout>
      <p>Redirect to org dashboard</p>
    </AuthLayout>
  );
}
