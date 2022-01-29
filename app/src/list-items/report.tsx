import { useRouter } from "next/router";
import styled from "styled-components";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { ListItem } from "src/components/list";
import { P, Small } from "src/components/text";
import { Tooltip } from "src/components/tooltip";
import { Avatar } from "src/components/avatar";
import { StatusAvatar } from "src/components/status-avatar";

import LayersSvg from "src/assets/icons/layers.svg";

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

const Scores = styled.div`
  display: none;
  flex-direction: row;
  align-items: center;
  gap: 0.3rem;

  @media (min-width: 800px) {
    display: flex;
  }
`;

const Score = styled.span`
  font-size: 1.8rem;
  margin: -0.4rem 0 0;
`;

type ReportListItemProps = {
  data: any;
};

export function ReportListItem({ data }: ReportListItemProps) {
  const router = useRouter();
  return (
    <ListItem href={`/app/${router.query.teamId}/reports/${data.id}`}>
      <Content>
        <StatusAvatar status={data.status} />
        <Title>
          <P>
            <span>{data.name || data.url || "n/a"}</span>
          </P>
          <Small grey>
            <Tooltip
              content={dayjs(data.createdAt?.seconds * 1000).format(
                "D MMM YYYY h:mma"
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
          ].map((category) => (
            <Avatar
              key={category.key}
              background={
                data.status?.startsWith("failed") &&
                data.statusReason?.includes?.(category.key)
                  ? "var(--sol--palette-sand-400)"
                  : "var(--sol--palette-sand-200)"
              }
            >
              <Score>
                {data.type === "user-flow"
                  ? Math.ceil(
                      (data.summary.reduce(
                        (all: any, score: any) =>
                          all + score[category.key] || 0,
                        0
                      ) /
                        data.summary.filter(
                          (score: any) => score[category.key] !== null
                        ).length) *
                        100
                    )
                  : Math.ceil((data.summary?.[category.key] || 0) * 100)}
              </Score>
            </Avatar>
          ))}
        </Scores>
      </Content>
    </ListItem>
  );
}
