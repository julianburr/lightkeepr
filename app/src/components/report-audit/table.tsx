import styled from "styled-components";

import { BytesCell } from "./cell/bytes";
import { LinkCell } from "./cell/link";
import { MsCell } from "./cell/ms";
import { NodeCell } from "./cell/node";
import { NumericCell } from "./cell/numeric";
import { SourceLocationCell } from "./cell/source-location";
import { TextCell } from "./cell/text";
import { UrlCell } from "./cell/url";

const WrapTable = styled.div`
  width: 100%;
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 0.3rem;

    thead th {
      font-family: "Playfair Display";
      font-size: 1.2rem;
      text-align: left;
      vertical-align: bottom;
      padding: 0 0.8rem;
    }

    tbody tr {
      td {
        padding: 0.6rem 0.8rem;
        background: var(--sol--palette-sand-50);

        &:first-child {
          border-radius: var(--sol--border-radius-s) 0 0
            var(--sol--border-radius-s);
        }

        &:last-child {
          border-radius: 0 var(--sol--border-radius-s)
            var(--sol--border-radius-s) 0;
        }

        p {
          margin: 0;
        }
      }
    }
  }
`;

const MAP = {
  text: TextCell,
  url: UrlCell,
  bytes: BytesCell,
  ms: MsCell,
  timespanMs: MsCell,
  node: NodeCell,
  numeric: NumericCell,
  link: LinkCell,
  "source-location": SourceLocationCell,
};

function DefaultCell({ value }: any) {
  return <td>{value ?? "—"}</td>;
}

type TableProps = {
  headings: any[];
  items: any[];
};

export function Table({ headings, items }: TableProps) {
  return headings.length > 0 ? (
    <WrapTable>
      <table>
        <thead>
          <tr>
            {headings.map((h: any) => (
              <th key={h.key}>{h.label || h.text}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              {headings.map((h: any) => {
                const type = h.valueType || h.itemType;
                const Cell: any = MAP[type as keyof typeof MAP] || DefaultCell;
                return <Cell {...h} key={h.key} value={item[h.key]} />;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </WrapTable>
  ) : null;
}
