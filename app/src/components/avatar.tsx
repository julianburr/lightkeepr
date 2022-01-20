import { Ref } from "react";
import { ComponentProps, forwardRef } from "react";
import styled from "styled-components";

import { Button } from "./button";

const Container = styled(Button)`
  && {
    border-radius: 50%;
    width: 4.4rem;
    height: 4.4rem;
    margin: 0;
    padding: 0;
  }
`;

type AvatarProps = ComponentProps<typeof Container> & {
  name: string;
};

export const Avatar = forwardRef(function Avatar(
  { name, ...props }: AvatarProps,
  ref: Ref<any>
) {
  const [first, ...rest] = name.trim().split(" ").filter(Boolean);
  return (
    <Container ref={ref} {...props}>
      {rest?.length
        ? `${first[0]}${rest[rest.length - 1][0]}`
        : first.length > 1
        ? `${first[0]}${first[1]}`
        : first[0] || "?"}
    </Container>
  );
});
