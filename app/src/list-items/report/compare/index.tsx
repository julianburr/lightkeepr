import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { doc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";
import styled from "styled-components";

import { useDocument } from "src/@packages/firebase";
import { ListItem } from "src/components/list";
import { StatusAvatar } from "src/components/status-avatar";
import { P, Small, Span } from "src/components/text";
import { Tooltip } from "src/components/tooltip";

import DesktopSvg from "src/assets/icons/outline/desktop-computer.svg";
import MobileSvg from "src/assets/icons/outline/device-mobile.svg";

dayjs.extend(relativeTime);

const db = getFirestore();

const Content = styled.div`
  display: flex;
  flex-direction: column;

  p {
    margin: 0;
  }
`;

const Top = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex: 1;
  gap: 1.2rem;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-self: center;
`;

const Device = styled.span`
  margin: 0 0 0 0.8rem;
  opacity: 0.6;

  svg {
    height: 1em;
    width: auto;
    vertical-align: middle;
    margin: -0.3rem 0 0;
  }
`;

type ReportListItemProps = {
  data: any;
};

export function CompareReportListItem({ data }: ReportListItemProps) {
  const router = useRouter();

  const run = useDocument(doc(db, "runs", data.run.id));

  return (
    <ListItem href={`/app/${router.query.teamId}/reports/${data.id}`}>
      <Content>
        <Top>
          <StatusAvatar status={data.status} />
          <Title>
            <P>
              <span>{data.name || data.url || "n/a"}</span>
              {data.url && data.url !== data.name && (
                <Span grey> —&nbsp;{data.url}</Span>
              )}
            </P>
            <Small grey>
              <span>{run.commit || run.commit || run.id} —&nbsp;</span>
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
        </Top>
      </Content>
    </ListItem>
  );
}
