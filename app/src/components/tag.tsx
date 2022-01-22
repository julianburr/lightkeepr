import { ReactNode } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.4rem 0.8rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0.3rem;
`;

type TagProps = {
  icon?: ReactNode;
  label: ReactNode;
  href?: string;
  onClick?: (e: any) => void;
  onRemove?: (e: any) => void;
  disabled?: boolean;
};

export function Tag({ icon, label }: TagProps) {
  return (
    <Container>
      {icon}
      <span>{label}</span>
    </Container>
  );
}
