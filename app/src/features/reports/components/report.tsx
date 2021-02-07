import { Fragment, useState } from "react";
import styled from "styled-components";
import { Heading, P } from "../../../components/text";

import { LighthouseCategory } from "./category";
import { MetricDetails } from "./metric-details";

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Left = styled.div`
  flex-shrink: 0;
  width: 50%;
`;

const Right = styled.div`
  flex-shrink: 0;
  width: 50%;
  padding: 0 0 0 2.4rem;
`;

const SelectedAudit = styled.div`
  width: 100%;
  position: sticky;
  top: 10rem;
  padding: 1.8rem;
  border: 0.1rem solid #f4f4f4;
  border-radius: 0.2rem;
`;

export function LighthouseReport({ report }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <Heading level={2}>{report.categories.performance.title}</Heading>

      <P>Special performance metric section</P>

      <Container>
        <Left>
          <LighthouseCategory
            selected={selected}
            setSelected={setSelected}
            report={report}
            data={report.categories.performance.auditRefs.filter(
              (ref) => ref.group !== "metrics"
            )}
          />

          {["accessibility", "best-practices", "seo", "pwa"].map((key) => (
            <Fragment key={key}>
              <Heading level={2}>{report.categories[key].title}</Heading>
              <LighthouseCategory
                selected={selected}
                setSelected={setSelected}
                report={report}
                data={report.categories[key].auditRefs}
              />
            </Fragment>
          ))}
        </Left>
        <Right>
          {!!selected && (
            <SelectedAudit>
              <MetricDetails metricKey={selected} report={report} />
            </SelectedAudit>
          )}
        </Right>
      </Container>
    </>
  );
}
