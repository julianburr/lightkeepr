import { useRouter } from "next/router";
import styled from "styled-components";

import { Avatar } from "src/components/avatar";
import { ListItem } from "src/components/list";
import { P, Small } from "src/components/text";

import PlusSvg from "src/assets/icons/plus.svg";
import { StatusAvatar } from "src/components/status-avatar";
import { interactive } from "src/@packages/sol/tokens";

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

export function ProjectListItem({ data }: any) {
  const router = useRouter();

  if (data.id === "new") {
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
