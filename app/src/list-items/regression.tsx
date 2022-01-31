import styled from "styled-components";

import { ListItem } from "src/components/list";
import { Grey, P } from "src/components/text";

import TrendingDownSvg from "src/assets/icons/trending-down.svg";
import { ActionMenu } from "src/components/action-menu";

import MoreSvg from "src/assets/icons/more-vertical.svg";
import { Button } from "src/components/button";
import { useRouter } from "next/router";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 0.8rem;
  margin: -0.3rem;
  width: calc(100% + 0.6rem);
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
  line-height: 1.2;
  gap: 0.6rem;
  text-align: left;
  padding: 0.6rem 0 0.5rem;
`;

const Status = styled.div`
  width: 2.8rem;
  height: 2.8rem;
  border-radius: var(--sol--border-radius-s);
  background: var(--sol--palette-sand-300);
  color: var(--sol--palette-sand-700);
  display: flex;
  align-self: flex-start;
  align-items: center;
  justify-content: center;

  svg {
    height: 1em;
    width: auto;
  }
`;

export function RegressionListItem({ data }: any) {
  const router = useRouter();

  if (data.type === "trend") {
    return (
      <ListItem>
        <Container>
          <Status>
            <TrendingDownSvg />
          </Status>
          <Content>
            <P>
              Potential slow {data.title?.toLowerCase?.()} regression over time{" "}
              <Grey>
                —&nbsp;Value dropped by{" "}
                {Math.round(data.regression * 100) / 100} compared to highest
                point in recent reports
              </Grey>
            </P>
          </Content>
          <ActionMenu
            items={[
              {
                label: "Compare reports",
                href:
                  `/${router.query.teamId}/compare/` +
                  `${data.prevItem.report?.id}..${data.item.report?.id}`,
              },
            ]}
          >
            {(props) => (
              <Button
                intent="ghost"
                size="small"
                icon={<MoreSvg />}
                {...props}
              />
            )}
          </ActionMenu>
        </Container>
      </ListItem>
    );
  }

  return (
    <ListItem>
      <Container>
        <Status>
          <TrendingDownSvg />
        </Status>
        <Content>
          <P>
            {data.title} regression{" "}
            <Grey>
              —&nbsp;Value dropped by {Math.round(data.regression * 100) / 100}{" "}
              compared to previous report
            </Grey>
          </P>
        </Content>
        <ActionMenu
          items={[
            {
              label: "Go to report of regression",
              href: `/${router.query.teamId}/reports/${data.item.report?.id}`,
            },
            {
              label: "Compare reports",
              href:
                `/${router.query.teamId}/compare/` +
                `${data.prevItem.report?.id}..${data.item.report?.id}`,
            },
          ]}
        >
          {(props) => (
            <Button intent="ghost" size="small" icon={<MoreSvg />} {...props} />
          )}
        </ActionMenu>
      </Container>
    </ListItem>
  );
}