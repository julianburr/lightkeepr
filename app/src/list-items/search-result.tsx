import styled from "styled-components";

import { toggleGlobalSearch } from "src/components/global-search";
import { ListItem } from "src/components/list";
import { P, Small } from "src/components/text";

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

export function SearchResultListItem({ data }: any) {
  return (
    <ListItem
      href={data.data?.href}
      onClick={(e) => {
        // HACK: this is working around next.js routing to make the Chrome
        // word highlighting working as much as possible
        e.preventDefault();
        e.stopPropagation();
        toggleGlobalSearch();
        window.location.href = `${window.location.origin}${data.data?.href}`;
      }}
    >
      <Content>
        <P>{data.data?.title}</P>
        <Small grey>{data.ref}</Small>
      </Content>
    </ListItem>
  );
}
