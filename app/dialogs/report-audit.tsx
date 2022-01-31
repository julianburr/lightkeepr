import { Dialog } from "src/components/dialog";
import { Spacer } from "src/components/spacer";
import { P } from "src/components/text";
import { Markdown } from "src/components/markdown";
import { Table } from "src/components/report-audit/table";
import { Hint } from "src/components/hint";

const MAP = {
  table: Table,
  opportunity: Table,
};

export function ReportAuditDialog({ data }: any) {
  const Value = MAP[data?.details?.type as keyof typeof MAP];

  const stackPack = data.report?.stackPacks?.find?.(
    (pack: any) => pack.descriptions[data.id]
  );

  return (
    <Dialog title={<Markdown>{data.title}</Markdown>}>
      {data.displayValue && <P grey>{data.displayValue.replace(/•/g, "—")}</P>}
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
          <Value {...data?.details} />
        </>
      )}
    </Dialog>
  );
}
