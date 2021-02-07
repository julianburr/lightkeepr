import { Markdown } from "../../../components/markdown";
import { Heading, Small } from "../../../components/text";

export function MetricDetails({ report, metricKey }) {
  const audit = report.audits[metricKey];
  return (
    <>
      <Heading level={3}>{audit?.title}</Heading>
      {audit?.displayValue && (
        <Small grey style={{ marginTop: ".3rem" }}>
          {audit.displayValue}
        </Small>
      )}
      <Markdown>{audit?.description}</Markdown>
    </>
  );
}
