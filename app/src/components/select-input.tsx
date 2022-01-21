import { ReactNode, useCallback } from "react";
import styled from "styled-components";

import ChevronDownSvg from "src/assets/icons/chevron-down.svg";

const Container = styled.div`
  position: relative;

  & > svg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 1.2rem;
    height: 1em;
    width: auto;
    stroke-width: 0.25rem;
  }
`;

const Select = styled.select`
  width: 100%;
  border-radius: 0.3rem;
  height: 3.6rem;
  padding: 0 1.2rem;
  border: 0.1rem solid rgba(0, 0, 0, 0.1);
  transition: border 0.2s;
  appearance: none;

  &:focus,
  &:hover {
    border: 0.1rem solid rgba(0, 0, 0, 0.2);
  }
`;

type Item = {
  value: any;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

type ItemGroup = {
  label?: ReactNode;
  icon?: ReactNode;
  items: Item[] | ItemGroup[];
};

type SelectProps = {
  id?: string;
  name: string;
  items: Item[] | ItemGroup[];
};

export function SelectInput({ id, name, items }: SelectProps) {
  const renderItems = useCallback((items) => {
    if ("items" in items) {
      return (
        <optgroup label={items.label}>{renderItems(items.items)}</optgroup>
      );
    }
    return (
      <>
        {items.map((item: any) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </>
    );
  }, []);

  return (
    <Container>
      <Select id={id} name={name}>
        {renderItems(items)}
      </Select>
      <ChevronDownSvg />
    </Container>
  );
}
