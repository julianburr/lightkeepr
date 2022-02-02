import { Dialog } from "src/components/dialog";
import { Hint } from "src/components/hint";
import { Markdown } from "src/components/markdown";
import { Table } from "src/components/report/audit/table";
import { Spacer } from "src/components/spacer";
import { Heading, Span } from "src/components/text";

const MAP = {
  table: Table,
  opportunity: Table,
};

export function ReportCompareAuditDialog({ data, baseData }: any) {
  const Value = MAP[data?.details?.type as keyof typeof MAP];

  const stackPack = data.report?.stackPacks?.find?.(
    (pack: any) => pack.descriptions[data.id]
  );

  return (
    <Dialog title={<Markdown>{data.title}</Markdown>}>
      {data.description && <Markdown>{data.description}</Markdown>}

      {stackPack?.descriptions?.[data.id] && (
        <>
          <Spacer h="1.8rem" />
          <Hint>
            <Markdown>{stackPack.descriptions[data.id]}</Markdown>
          </Hint>
          <Spacer h=".6rem" />
        </>
      )}

      {Value && (
        <>
          <Spacer h="1.8rem" />

          <Heading level={2}>
            Base report{" "}
            {baseData.displayValue && (
              <Span grey>
                —&nbsp;{baseData.displayValue.replace(/•/g, "—")}
              </Span>
            )}
          </Heading>

          <Spacer h=".8rem" />
          <Value {...baseData?.details} />

          <Spacer h="2.4rem" />

          <Heading level={2}>
            Compare report{" "}
            {data.displayValue && (
              <Span grey>—&nbsp;{data.displayValue.replace(/•/g, "—")}</Span>
            )}
          </Heading>

          <Spacer h=".8rem" />
          <Value {...data?.details} />
        </>
      )}
    </Dialog>
  );
}
