import Markdown from "react-markdown";

import { Dialog } from "src/components/dialog";

export function ReportAuditDialog({ data }: any) {
  return (
    <Dialog title={<Markdown>{data.audit.title}</Markdown>}>
      {data.audit.description && <Markdown>{data.audit.description}</Markdown>}
    </Dialog>
  );
}
