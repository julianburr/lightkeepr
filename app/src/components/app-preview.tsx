import styled from "styled-components";

import { Badge } from "src/components/badge";
import { Button } from "src/components/button";
import { Menu } from "src/components/menu";
import { ReportScores } from "src/components/report/scores";
import { ReportStatus } from "src/components/report/status";
import { Sidebar } from "src/components/sidebar";
import { Spacer } from "src/components/spacer";
import { SplitButton } from "src/components/split-button";
import { Heading, Small } from "src/components/text";
import { TopBar } from "src/components/top-bar";

import ArrowLeftSvg from "src/assets/icons/outline/arrow-left.svg";
import BellSvg from "src/assets/icons/outline/bell.svg";
import ChevronLeftSvg from "src/assets/icons/outline/chevron-left.svg";
import ChevronRightSvg from "src/assets/icons/outline/chevron-right.svg";
import MenuSvg from "src/assets/icons/outline/menu.svg";
import SearchSvg from "src/assets/icons/outline/search.svg";
import LifeBuoySvg from "src/assets/icons/outline/support.svg";
import GridSvg from "src/assets/icons/outline/view-grid.svg";
import LogoSvg from "src/assets/logo.svg";

import { NetworkOverview } from "./report/overview/network";
import { PerformanceOverview } from "./report/overview/performance";
import { ScoresOverview } from "./report/overview/scores";
import { UserTimingsOverview } from "./report/overview/user-timings";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  width: 100%;
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  width: 100%;
  max-width: 90rem;
  margin: 0 auto;
  padding: 2.4rem;
`;

const Logo = styled.div`
  height: 6.8rem;
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;

  svg {
    height: 5.4rem;
    width: auto;
    margin: 0 0 -0.6rem;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: opacity 0.2s;
  gap: 0.6rem;
`;

const WrapTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  @media (min-width: 800px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const WrapHeading = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 800px) {
    flex: 1;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.4rem;
  padding: 0.3rem 0;
`;

const items = [
  {
    icon: <ArrowLeftSvg />,
    label: "Back to run overview",
    isBacklink: true,
    href: "#",
  },

  // Report tabs
  {
    label: "Report",
    items: [
      {
        label: "Overview",
        href: "/",
      },
      {
        label: "Performance",
        href: "#",
      },
      {
        label: "Accessibility",
        href: "#",
      },
      {
        label: "Best practices",
        href: "#",
      },
      {
        label: "SEO",
        href: "#",
      },
      {
        label: "PWA",
        href: "#",
      },
    ],
  },
];

const report = {
  name: "Homepage",
  url: "https://www.julianburr.de",

  summary: {
    performance: 1,
    accessibility: 0.97,
    "best-practices": 1,
    seo: 1,
    pwa: 0.6,
  },

  status: "failed",
  statusReasons: ["target"],
  failedTargets: ["pwa"],
};

const reportData = {
  report: {
    audits: {},
  },
};

const pastReports = Array.from(new Array(30)).map((_, index) => ({
  commit: "catz",
  commitMessage: "Cats are awesome",
  summary: {
    performance: 0.9 + Math.random() * 0.09,
    accessibility: 0.9 + Math.random() * 0.09,
    "best-practices":
      index < 4 ? 0.7 + Math.random() * 0.09 : 0.9 + Math.random() * 0.09,
    seo: 0.88 + Math.random() * 0.09,
    pwa: 0.6 + Math.random() * 0.05,
  },
  audits: {
    "first-contentful-paint": { score: 0.9 + Math.random() * 0.09 },
    "largest-contentful-paint": { score: 0.9 + Math.random() * 0.09 },
    "max-potential-fid": { score: 0.5 + Math.random() * 0.09 },
    "total-blocking-time": { score: 0.9 + Math.random() * 0.09 },
    "cumulative-layout-shift": { score: 0.9 + Math.random() * 0.09 },
  },
}));

export function AppPreview() {
  return (
    <Container>
      <TopBar
        logo={
          <Logo>
            <LogoSvg />
          </Logo>
        }
        actions={
          <>
            <Buttons data-tablet>
              <Button icon={<SearchSvg />} aria-label="Search" />
              <Button
                icon={<BellSvg />}
                badge={<Badge count={3} />}
                aria-label="Notifications"
              />
              <Button icon={<LifeBuoySvg />} aria-label="Documentation" />
              <Spacer w="1.2rem" />

              <Button icon={<GridSvg />} aria-label="App switcher" />
              <Spacer w="1.2rem" />

              <Button intent="primary" icon={<>JB</>} />
            </Buttons>

            <Buttons data-mobile>
              <Button
                icon={<SearchSvg aria-label="Search" />}
                size="large"
                intent="ghost"
                onClick={() => {
                  alert("search");
                }}
              />
              <Button
                icon={<MenuSvg aria-label="Menu" />}
                badge={<Badge count={3} />}
                size="large"
                intent="ghost"
              />
            </Buttons>
          </>
        }
      />

      <Content>
        <Sidebar>
          <Menu items={items} />
        </Sidebar>
        <Main>
          <WrapTitle>
            <WrapHeading>
              <Heading level={1}>{report.name}</Heading>
              {report.url && report.url !== report.name && (
                <Small grey>{report.url}</Small>
              )}
            </WrapHeading>
            <Actions>
              <SplitButton items={[]}>Approve</SplitButton>
              <Spacer w=".8rem" />
              <Button icon={<ChevronLeftSvg />} aria-label="Previous report" />
              <Button icon={<ChevronRightSvg />} aria-label="Next report" />
            </Actions>
          </WrapTitle>

          <Spacer h="1.2rem" />
          <ReportStatus data={report} />

          <Spacer h="1.2rem" />

          <ReportScores scores={report.summary} />
          <Spacer h="1.6rem" />

          <Heading level={2}>Trends &amp; regressions</Heading>
          <Spacer h="2.4rem" />
          <ScoresOverview
            report={report}
            pastReports={pastReports}
            reportData={reportData}
            stepIndex={0}
          />

          <Spacer h="3.2rem" />
          <PerformanceOverview
            report={report}
            pastReports={pastReports}
            reportData={reportData}
          />

          <Spacer h="3.2rem" />
          <NetworkOverview
            report={report}
            pastReports={pastReports}
            reportData={reportData}
          />

          <Spacer h="3.2rem" />
          <UserTimingsOverview
            report={report}
            pastReports={pastReports}
            reportData={reportData}
          />
        </Main>
      </Content>
    </Container>
  );
}
