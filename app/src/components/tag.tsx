import { ReactNode } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.4rem 0.8rem;
  background: #dad9d044;
  border-radius: 0.3rem;
  font-size: 1.2rem;
  color: rgba(0, 0, 0, 0.6);
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
