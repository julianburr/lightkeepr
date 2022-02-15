import { ReactNode, Ref } from "react";
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
  flex-shrink: 0;
  font-family: "Playfair Display";
  position: relative;
  background: ${(props) =>
    props.background || "var(--sol--container-ghost-hover-background)"};
  color: ${(props) =>
    props.color || "var(--sol--container-ghost-hover-foreground)"};

  svg {
    height: 1.8rem;
    width: auto;
  }
`;

const WrapBadge = styled.span`
  position: absolute;
  top: -0.4rem;
  right: -0.4rem;
`;

type AvatarProps = ComponentProps<typeof Container> & {
  background: string;
  color: string;
  name?: string;
  badge?: ReactNode;
};

export const Avatar = forwardRef(function Avatar(
  { children, name, badge, ...props }: AvatarProps,
  ref: Ref<any>
) {
  return (
    <Container ref={ref} {...props}>
      {name ? initials(name) : children}
      {badge && <WrapBadge>{badge}</WrapBadge>}
    </Container>
  );
});
