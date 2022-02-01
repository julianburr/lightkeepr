import "src/utils/firebase";

import { getFirestore } from "firebase/firestore";
import { ComponentProps } from "react";

import { SelectInput } from "src/components/select-input";
import { useAuthUser } from "src/hooks/use-auth-user";

const db = getFirestore();

type TeamSelectInputProps = Omit<ComponentProps<typeof SelectInput>, "items">;

export function TeamSelectInput(props: TeamSelectInputProps) {
  const authUser = useAuthUser();
  return (
    <SelectInput
      {...props}
      items={
        authUser?.teams?.map?.((team) => {
          return {
            value: team.id,
            label: team.name || "n/a",
          };
        }) || []
      }
    />
  );
}
