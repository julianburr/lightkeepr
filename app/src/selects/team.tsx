import "src/utils/firebase";

import { collection, getFirestore } from "firebase/firestore";

import { useCollection } from "src/@packages/firebase";
import { useAuthUser } from "src/hooks/use-auth-user";
import { SelectInput } from "src/components/select-input";
import { ComponentProps } from "react";

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
