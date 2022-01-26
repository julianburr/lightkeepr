import { Dialog } from "src/components/dialog";
import { Spacer } from "src/components/spacer";
import { P } from "src/components/text";
import { Markdown } from "src/components/markdown";
import { Table } from "src/components/report-audit/table";
import { Hint } from "src/components/report-audit/hint";

const MAP = {
  table: Table,
  opportunity: Table,
};

export function ReportAuditDialog({ data }: any) {
  const Value = MAP[data.audit?.details?.type as keyof typeof MAP];

  const stackPack = data.report?.stackPacks?.find?.(
    (pack: any) => pack.descriptions[data.audit.id]
  );

  return (
    <Dialog title={<Markdown>{data.audit.title}</Markdown>}>
      {data.audit.displayValue && (
        <P grey>{data.audit.displayValue.replace(/•/g, "—")}</P>
      )}
      {data.audit.description && <Markdown>{data.audit.description}</Markdown>}

      {stackPack?.descriptions?.[data.audit.id] && (
        <>
          <Spacer h="1.8rem" />
          <Hint>
            <Markdown>{stackPack.descriptions[data.audit.id]}</Markdown>
          </Hint>
          <Spacer h=".6rem" />
        </>
      )}

      {Value && (
        <>
          <Spacer h="1.8rem" />
          <Value {...data.audit?.details} />
        </>
      )}
    </Dialog>
  );
}
