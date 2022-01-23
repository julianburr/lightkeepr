import "src/utils/firebase";

import styled from "styled-components";
import { doc, getFirestore, updateDoc } from "firebase/firestore";

import { useDocument } from "src/@packages/firebase";
import { useErrorDialog } from "src/hooks/use-dialog";
import { ActionMenu } from "src/components/action-menu";
import { Avatar } from "src/components/avatar";
import { ListItem } from "src/components/list";
import { Spacer } from "src/components/spacer";
import { Tag } from "src/components/tag";
import { TagGroup } from "src/components/tag-group";
import { P, Small } from "src/components/text";

const db = getFirestore();

const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  gap: 1.2rem;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

type UserItemProps = {
  data: any;
};

export function UserListItem({ data }: UserItemProps) {
  const errorDialog = useErrorDialog();
  const user = useDocument(doc(db, "users", data.user.id));

  const actions =
    data.status === "pending"
      ? [{ label: "Resend invite email" }, { label: "Remove from team" }]
      : data.status === "rejected"
      ? [
          {
            label: "Re-invite to team",
            onClick: async () => {
              await updateDoc(doc(db, "teamUsers", data.id), {
                status: "pending",
              });
            },
          },
          { label: "Remove from team" },
        ]
      : data.role !== "owner"
      ? [{ label: "Make owner" }, { label: "Remove from team" }]
      : [
          {
            label: "Remove from team",
            onClick: () =>
              errorDialog.open(
                new Error("Cannot delete the only owner of an team.")
              ),
          },
        ];

  return (
    <ListItem>
      <Content>
        <Avatar background="#dad9d044" name={user.name || data.user.id} />
        <Title>
          <P>{data.user.id}</P>
          <Small grey>{user.name || "—"}</Small>
        </Title>
        <TagGroup>{data.role === "owner" && <Tag label="Owner" />}</TagGroup>
      </Content>
      <Spacer w="1.8rem" />
      <ActionMenu placement="bottom-end" items={actions} />
    </ListItem>
  );
}
