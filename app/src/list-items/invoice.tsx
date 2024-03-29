import "src/utils/firebase";

import dayjs from "dayjs";
import styled from "styled-components";

import { Button } from "src/components/button";
import { ListItem } from "src/components/list";
import { P, Small } from "src/components/text";
import { Tooltip } from "src/components/tooltip";

import PaperclipSvg from "src/assets/icons/outline/paper-clip.svg";

const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  gap: 1.2rem;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

type InvoiceListItemProps = {
  data: any;
};

export function InvoiceListItem({ data }: InvoiceListItemProps) {
  const item = data?.lines?.data?.[0];
  return (
    <ListItem>
      <Content>
        <Title>
          <P>
            ${item.amount / 100} — {item.description}
          </P>
          <Small grey>
            {data.paid
              ? `Paid at ${dayjs(data.status_transitions.paid_at * 1000).format(
                  "D MMM YYYY h:mma"
                )}`
              : `Unpaid — Created at ${dayjs(data.created * 1000).format(
                  "D MMM YYYY h:mma"
                )}`}
          </Small>
        </Title>
      </Content>
      <Tooltip content="View invoice">
        {(props) => (
          <Button
            {...props}
            intent="ghost"
            icon={<PaperclipSvg />}
            href={data.hosted_invoice_url}
            // eslint-disable-next-line
            // @ts-ignore
            target="_blank"
          />
        )}
      </Tooltip>
    </ListItem>
  );
}
