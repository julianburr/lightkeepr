import styled from "styled-components";

import { P, Small } from "src/components/text";

const Td = styled.td`
  max-width: 30rem;
  min-width: 20rem;
`;

type UrlCellProps = {
  value: string;
};

export function UrlCell({ value }: UrlCellProps) {
  const [, url, path] = value?.match(/http[s]{0,1}:\/\/([^/]+)(.*)/) || [];
  const val = path || value || "—";
  return (
    <Td>
      <P ellipsis title={val}>
        {val}
      </P>
      {url && <Small grey>{url}</Small>}
    </Td>
  );
}
