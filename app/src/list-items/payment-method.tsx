import "src/utils/firebase";

import styled from "styled-components";

import { Avatar } from "src/components/avatar";
import { ListItem } from "src/components/list";
import { P, Small } from "src/components/text";

import AmexSvg from "src/assets/cc/amex.svg";
import BitcoinSvg from "src/assets/cc/bitcoin.svg";
import DiscoverSvg from "src/assets/cc/discover.svg";
import JcbSvg from "src/assets/cc/jcb.svg";
import MaestroSvg from "src/assets/cc/maestro.svg";
import MastercardSvg from "src/assets/cc/mastercard.svg";
import PaypalSvg from "src/assets/cc/paypal.svg";
import VisaSvg from "src/assets/cc/visa.svg";
import GenericSvg from "src/assets/icons/credit-card.svg";

const CC = {
  jcb: JcbSvg,
  amex: AmexSvg,
  discover: DiscoverSvg,
  maestro: MaestroSvg,
  mastercard: MastercardSvg,
  paypal: PaypalSvg,
  visa: VisaSvg,
  bitcoin: BitcoinSvg,
  generic: GenericSvg,
};

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

type PaymentMethodListItemProps = {
  data: any;
};

export function PaymentMethodListItem({ data }: PaymentMethodListItemProps) {
  if (data.type === "card") {
    const BrandSvg = CC[data.card.brand as keyof typeof CC] || CC.generic;
    return (
      <ListItem>
        <Content>
          <Avatar background="#dad9d044">
            <BrandSvg />
          </Avatar>
          <Title>
            <P>**** **** **** {data.card.last4}</P>
            <Small grey>
              Exp. {data.card.exp_month}/{data.card.exp_year}
            </Small>
          </Title>
        </Content>
      </ListItem>
    );
  }
  return <p>n/a</p>;
}
