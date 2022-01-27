import { useRouter } from "next/router";
import styled from "styled-components";
import {
  collection,
  getFirestore,
  limit,
  orderBy,
  query,
} from "firebase/firestore";

import { interactive } from "src/@packages/sol/tokens";
import { useCollection } from "src/@packages/firebase";
import { StatusAvatar } from "src/components/status-avatar";
import { Avatar } from "src/components/avatar";
import { ListItem } from "src/components/list";
import { P, Small } from "src/components/text";

import PlusSvg from "src/assets/icons/plus.svg";

const db = getFirestore();

const AddNewItem = styled(ListItem)`
  a {
    font-family: "Playfair Display";
    ${interactive("secondary")}
  }
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.2rem;
`;

const WrapText = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.4rem 0;
`;

function NewProjectItem() {
  const router = useRouter();
  return (
    <AddNewItem href={`/app/${router.query.teamId}/projects/new`}>
      <Title>
        <Avatar>
          <PlusSvg />
        </Avatar>
        <WrapText>
          <P>Add new project</P>
        </WrapText>
      </Title>
    </AddNewItem>
  );
}

function ProjectItem({ data }: any) {
  const router = useRouter();
  return (
    <ListItem href={`/app/${router.query.teamId}/projects/${data.id}`}>
      <Title>
        <StatusAvatar status={data.status} />
        <WrapText>
          <P>{data.name}</P>
          <Small grey>{data.status || "Waiting for first report"}</Small>
        </WrapText>
      </Title>
    </ListItem>
  );
}

export function ProjectListItem({ data }: any) {
  return data.id === "new" ? <NewProjectItem /> : <ProjectItem data={data} />;
}
