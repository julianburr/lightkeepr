import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import styled from "styled-components";

import { ListItem } from "src/components/list";
import { Spacer } from "src/components/spacer";
import { StatusAvatar } from "src/components/status-avatar";
import { P, Small, Span } from "src/components/text";
import { Tooltip } from "src/components/tooltip";

import CameraSvg from "src/assets/icons/outline/camera.svg";
import DesktopSvg from "src/assets/icons/outline/desktop-computer.svg";
import MobileSvg from "src/assets/icons/outline/device-mobile.svg";

dayjs.extend(relativeTime);

const CATEGORIES = [
  { label: "Performance", key: "performance" },
  { label: "Accessibility", key: "accessibility" },
  { label: "Best Practice", key: "best-practices" },
  { label: "SEO", key: "seo" },
  { label: "PWA", key: "pwa" },
];

const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex: 1;
  gap: 1.2rem;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  margin: 0.2rem 0 0;

  @media (min-width: 600px) {
    flex-direction: row;
  }
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width:100%
  align-self: center;
`;

const Device = styled.span`
  margin: 0 0 0 0.8rem;
  opacity: 0.6;

  svg {
    height: 1em;
    width: auto;
    vertical-align: middle;
    margin: -0.2rem 0 0;
  }
`;

const Scores = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.3rem;
  flex-shrink: 0;
  margin: 0.8rem 0 0;

  @media (min-width: 600px) {
    margin: 0 0.2rem 0 0;
  }
`;

const Score = styled.span`
  font-size: 1.2rem;
  font-family: "Playfair Display";
  width: 4.2rem;
  height: 4.2rem;
  border-radius: 0.3rem;
  background: var(--sol--palette-sand-200);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepIcon = styled.div<{ lastIndex?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.4rem;
  height: 4.4rem;
  position: relative;

  span {
    display: flex;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    background: var(--sol--palette-sand-200);
  }

  svg {
    position: absolute;
    height: 1.4rem;
    width: auto;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    color: var(--sol--palette-sand-600);
    z-index: 1;
  }

  &:before {
    content: "";
    position: absolute;
    top: -10rem;
    bottom: ${(props) => (props.lastIndex ? "50%" : "-10rem")};
    left: 50%;
    transform: translateX(-50%);
    width: 0.2rem;
    background: var(--sol--palette-sand-200);
    z-index: 0;
  }
`;

const WrapAvatar = styled.div`
  position: relative;
  z-index: 1;

  &:before {
    content: " ";
    position: absolute;
    top: 50%;
    bottom: -10rem;
    left: 50%;
    transform: translateX(-50%);
    width: 0.2rem;
    background: var(--sol--palette-sand-200);
    z-index: 0;
  }
`;

const StyledListItem = styled(ListItem)`
  overflow: hidden;
`;

type ReportListItemProps = {
  data: any;
};

export function ReportListItem({ data }: ReportListItemProps) {
  const router = useRouter();
  return (
    <>
      <StyledListItem href={`/app/${router.query.teamId}/reports/${data.id}`}>
        <Content>
          {data.type === "user-flow" ? (
            <WrapAvatar>
              <StatusAvatar status={data.status} />
            </WrapAvatar>
          ) : (
            <StatusAvatar status={data.status} />
          )}
          <Inner>
            <Title>
              <P>
                <span>{data.name || data.url || "n/a"}</span>
                {data.url && data.url !== data.name && (
                  <Span grey> —&nbsp;{data.url}</Span>
                )}
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
                <Tooltip
                  content={
                    data.meta.configSettings.formFactor === "mobile"
                      ? "Mobile"
                      : "Desktop"
                  }
                >
                  {(props) => (
                    <Device {...props}>
                      {data.meta.configSettings.formFactor === "mobile" ? (
                        <MobileSvg />
                      ) : (
                        <DesktopSvg />
                      )}
                    </Device>
                  )}
                </Tooltip>
              </Small>
            </Title>
            {data.type !== "user-flow" && (
              <Scores>
                {CATEGORIES.map((category) => {
                  const score = data.summary?.[category.key];
                  return (
                    <Tooltip content={category.label} key={category.key}>
                      {(props) => (
                        <Score {...props}>
                          {!score && score !== 0
                            ? "n/a"
                            : Math.round(score * 100)}
                        </Score>
                      )}
                    </Tooltip>
                  );
                })}
              </Scores>
            )}
          </Inner>
        </Content>
      </StyledListItem>

      {data.type === "user-flow" && (
        <>
          {data.summary?.map?.((step: any, index: number) => (
            <StyledListItem
              key={index}
              href={`/app/${router.query.teamId}/reports/${data.id}/${index}`}
            >
              <Content>
                <StepIcon lastIndex={index === data.summary?.length - 1}>
                  <span />
                  {step?.meta?.gatherMode === "snapshot" && <CameraSvg />}
                </StepIcon>
                <Inner>
                  <Title>
                    <Spacer h="1rem" />
                    <P>
                      {step.name}
                      <Span grey>
                        {" "}
                        —&nbsp;
                        {step?.meta?.gatherMode === "snapshot"
                          ? "Snapshot"
                          : "Navigation"}
                      </Span>
                    </P>
                  </Title>
                  <Scores>
                    {CATEGORIES.map((category) => {
                      const score =
                        data.summary?.[index]?.scores?.[category.key];
                      return (
                        <Tooltip content={category.label} key={category.key}>
                          {(props) => (
                            <Score {...props}>
                              {step?.meta?.gatherMode === "snapshot"
                                ? score.total
                                  ? `${score.passed}/${score.total}`
                                  : "n/a"
                                : !score && score !== 0
                                ? "n/a"
                                : Math.round(score * 100)}
                            </Score>
                          )}
                        </Tooltip>
                      );
                    })}
                  </Scores>
                </Inner>
              </Content>
            </StyledListItem>
          ))}
        </>
      )}
    </>
  );
}
