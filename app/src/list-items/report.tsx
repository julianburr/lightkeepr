import styled from "styled-components";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { ListItem } from "src/components/list";
import { P, Small } from "src/components/text";
import { StatusAvatar } from "src/components/status-avatar";

import { Tooltip } from "src/components/tooltip";
import { useRouter } from "next/router";
import { Avatar } from "src/components/avatar";

dayjs.extend(relativeTime);

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1.2rem;

  @media (min-width: 800px) {
    flex-direction: row;
    align-items: center;
  }
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Scores = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.3rem;

  & > * {
    flex-direction: column;
  }
`;

const Label = styled.span`
  font-size: 0.6rem;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.6);
`;

const Score = styled.span`
  font-size: 2rem;
  margin: -0.4rem 0 0;
`;

type ReportListItemProps = {
  data: any;
};

export function ReportListItem({ data }: ReportListItemProps) {
  const router = useRouter();
  const { teamId, projectId } = router.query;
  return (
    <ListItem
      href={`/app/${teamId}/projects/${projectId}/run/${data.run.id}/report/${data.id}`}
    >
      <Content>
        <Title>
          <P>
            <span>{data.name || data.url || "n/a"}</span>
          </P>
          <Small grey>
            <Tooltip
              content={dayjs(data.createdAt?.seconds * 1000).format(
                "D MMM YYYY H:mma"
              )}
            >
              {(props) => (
                <span {...props}>
                  Created {dayjs(data.createdAt.seconds * 1000).fromNow()}
                </span>
              )}
            </Tooltip>
          </Small>
        </Title>
        <Scores>
          {[
            { label: "Perf", key: "performance" },
            { label: "A11y", key: "accessibility" },
            { label: "Best P.", key: "best-practices" },
            { label: "SEO", key: "seo" },
            { label: "PWA", key: "pwa" },
          ].map((score) => (
            <Avatar key={score.key} background="#dad9d044">
              <Label>{score.label}</Label>
              <Score>
                {data.summary?.[score.key]
                  ? Math.ceil(data.summary?.[score.key] * 100)
                  : null}
              </Score>
            </Avatar>
          ))}
        </Scores>
      </Content>
    </ListItem>
  );
}
