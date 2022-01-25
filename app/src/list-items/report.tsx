import styled from "styled-components";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { ListItem } from "src/components/list";
import { P, Small } from "src/components/text";
import { Tooltip } from "src/components/tooltip";
import { Avatar } from "src/components/avatar";

import LayersSvg from "src/assets/icons/layers.svg";

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
      href={`/app/${teamId}/projects/${projectId}/runs/${data.run.id}/reports/${data.id}`}
    >
      <Content>
        {data.type === "user-flow" && (
          <Avatar background="#dad9d044">
            <LayersSvg />
          </Avatar>
        )}
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
            <Avatar key={category.key} background="#dad9d044">
              <Label>{category.label}</Label>
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
                  : data.summary?.[category.key]
                  ? Math.ceil(data.summary?.[category.key] * 100)
                  : null}
              </Score>
            </Avatar>
          ))}
        </Scores>
      </Content>
    </ListItem>
  );
}
