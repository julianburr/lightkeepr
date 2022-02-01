import { useRouter } from "next/router";
import styled from "styled-components";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  collection,
  doc,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { useCollection } from "src/@packages/firebase";
import { ListItem } from "src/components/list";
import { P, Small, Span } from "src/components/text";
import { Tooltip } from "src/components/tooltip";
import { StatusAvatar } from "src/components/status-avatar";

import MobileSvg from "src/assets/icons/smartphone.svg";
import DesktopSvg from "src/assets/icons/monitor.svg";

dayjs.extend(relativeTime);

const db = getFirestore();

const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex: 1;
  gap: 1.2rem;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  flex: 1;
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

type PageListItemProps = {
  data: string;
};

export function PageListItem({ data }: PageListItemProps) {
  const router = useRouter();

  const reports = useCollection(
    query(
      collection(db, "reports"),
      where("team", "==", doc(db, "teams", router.query.teamId!)),
      where("name", "==", data),
      orderBy("createdAt", "desc"),
      limit(1)
    ),
    { key: `simpleReport/${data}` }
  );

  if (!reports?.length) {
    return null;
  }

  const lastReport = reports[0];

  return (
    <ListItem href={`/app/${router.query.teamId}/reports/${lastReport.id}`}>
      <Content>
        <StatusAvatar status={lastReport.status} />
        <Title>
          <P>
            {lastReport.name || lastReport.url || "n/a"}
            {lastReport.url && lastReport.url !== lastReport.name && (
              <Span grey> —&nbsp;{lastReport.url}</Span>
            )}
          </P>
          <Small grey>
            <Tooltip
              content={dayjs(lastReport.createdAt?.seconds * 1000).format(
                "D MMM YYYY h:mma"
              )}
            >
              {(props) => (
                <span {...props}>
                  Last report{" "}
                  {dayjs(lastReport.createdAt.seconds * 1000).fromNow()}
                </span>
              )}
            </Tooltip>
            <Tooltip
              content={
                lastReport.meta.configSettings.formFactor === "mobile"
                  ? "Mobile"
                  : "Desktop"
              }
            >
              {(props) => (
                <Device {...props}>
                  {lastReport.meta.configSettings.formFactor === "mobile" ? (
                    <MobileSvg />
                  ) : (
                    <DesktopSvg />
                  )}
                </Device>
              )}
            </Tooltip>
          </Small>
        </Title>
      </Content>
    </ListItem>
  );
}
