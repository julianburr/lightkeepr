import { useRouter } from "next/router";
import styled from "styled-components";

import { Avatar } from "src/components/avatar";
import { ListItem } from "src/components/list";
import { P, Small } from "src/components/text";

import PlusSvg from "src/assets/icons/plus.svg";
import { StatusAvatar } from "src/components/status-avatar";

const Container = styled.div`
  height: 14rem;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const AddNewItem = styled(ListItem)`
  a {
    background: #e0dfd8;
    color: rgba(0, 0, 0, 0.4);
    font-family: "Playfair Display";
    display: flex;

    &:focus,
    &:hover {
      background: #dad9d0;
      color: rgba(0, 0, 0, 0.6);
    }

    ${Container} {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
`;

const PlusIcon = styled(PlusSvg)`
  color: #000;
  height: 4rem;
  width: auto;
  opacity: 0.4;
  transition: transform 0.2s, opacity 0.2s;

  ${AddNewItem} a:hover & {
    transform: scale(1.2);
    opacity: 0.6;
  }
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1.2rem;
`;

const WrapText = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.4rem 0;
`;

const StatusText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  color: rgba(0, 0, 0, 0.4);
  font-size: 1.2rem;
  padding: 2rem;
`;

export function ProjectListItem({ data }: any) {
  const router = useRouter();

  if (data.id === "new") {
    return (
      <AddNewItem href={`/app/${router.query.teamId}/projects/new`}>
        <Container>
          <PlusIcon />
          <P>Add new project</P>
        </Container>
      </AddNewItem>
    );
  }

  return (
    <ListItem href={`/app/${router.query.teamId}/projects/${data.id}`}>
      <Container>
        <Title>
          <StatusAvatar status={data.status} />
          <WrapText>
            <P>{data.name}</P>
            <Small grey>{data.status || "Pending"}</Small>
          </WrapText>
        </Title>
        {data.score ? (
          <>TODO</>
        ) : (
          <StatusText>
            Waiting for the first reports to come through...
          </StatusText>
        )}
      </Container>
    </ListItem>
  );
}
