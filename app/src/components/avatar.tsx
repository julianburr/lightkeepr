import { Ref } from "react";
import { ComponentProps, forwardRef } from "react";
import styled from "styled-components";

export function initials(name?: string) {
  return name
    ? name
        ?.split(" ")
        .filter(Boolean)
        .reduce((all, w, index, names) => {
          if (index === 0 || index === names.length - 1) {
            all += w[0]?.toUpperCase?.();
          }
          return all;
        }, "")
    : "?";
}

const Container = styled(({ as: As = "div", color, background, ...props }) => (
  <As {...props} />
))`
  width: 4.4rem;
  height: 4.4rem;
  border-radius: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Playfair Display";
  background: ${(props) => props.background};
  color: ${(props) => props.color || "#000"};

  svg {
    height: 1.8rem;
    width: auto;
  }
`;

type AvatarProps = ComponentProps<typeof Container> & {
  background: string;
  color: string;
  name?: string;
};

export const Avatar = forwardRef(function Avatar(
  { children, name, ...props }: AvatarProps,
  ref: Ref<any>
) {
  return (
    <Container ref={ref} {...props}>
      {name ? initials(name) : children}
    </Container>
  );
});
