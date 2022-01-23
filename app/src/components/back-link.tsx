import Link from "next/link";
import styled from "styled-components";

import ArrowLeftSvg from "src/assets/icons/arrow-left.svg";
import { ComponentProps } from "react";

const A = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 1.2rem;
  font-family: "Playfair Display";

  & svg {
    height: 1.1em;
    width: auto;
    margin: 0 0.3rem 0 0;
    transition: transform 0.2s;
  }

  &:hover {
    & svg {
      transform: translateX(-0.2rem);
    }
  }
`;

type BackLinkProps = ComponentProps<typeof Link>;

export function BackLink({ children, ...props }: BackLinkProps) {
  return (
    <Link {...props} passHref>
      <A>
        <ArrowLeftSvg />
        <span>{children}</span>
      </A>
    </Link>
  );
}
