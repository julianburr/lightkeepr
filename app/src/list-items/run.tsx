import styled from "styled-components";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { ListItem } from "src/components/list";
import { P, Small } from "src/components/text";
import { StatusAvatar } from "src/components/status-avatar";
import { Tooltip } from "src/components/tooltip";
import { useRouter } from "next/router";

import BranchSvg from "src/assets/icons/git-branch.svg";

dayjs.extend(relativeTime);

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

const Branch = styled.span`
  opacity: 0.6;
  margin: 0 0 0 1.2rem;

  svg {
    height: 1em;
    width: auto;
    vertical-align: middle;
    margin: 0 0.3rem 0 0;
  }
`;

type RunListItemProps = {
  data: any;
};

export function RunListItem({ data }: RunListItemProps) {
  const router = useRouter();
  return (
    <ListItem href={`/app/${router.query.teamId}/runs/${data.id}`}>
      <Content>
        <StatusAvatar status={data.status} />
        <Title>
          <P>
            <span>{data.commitMessage || data.commitHash || data.id}</span>
          </P>
          <Small grey>
            {data.finishedAt || data.startedAt ? (
              <Tooltip
                content={dayjs(
                  (data.finishedAt || data.startedAt)?.seconds * 1000
                ).format("D MMM YYYY h:mma")}
              >
                {(props) => (
                  <span {...props}>
                    {data.finishedAt
                      ? `Finished ${dayjs
                          .unix(data.finishedAt.seconds)
                          .fromNow()}`
                      : `Started ${dayjs
                          .unix(data.startedAt.seconds)
                          .fromNow()}`}
                  </span>
                )}
              </Tooltip>
            ) : (
              <span>Not started yet</span>
            )}

            {data.branch && (
              <Branch>
                <BranchSvg />
                <span>{data.branch}</span>
              </Branch>
            )}
          </Small>
        </Title>
      </Content>
    </ListItem>
  );
}
