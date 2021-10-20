import styled from "styled-components";

const SelectContainer = styled.select`
  border: 0.1rem solid #ccc;
  border-radius: 0.2rem;
  padding: 0 1.2rem;
  height: 4rem;
`;

export function Select({ options, ...props }) {
  return (
    <SelectContainer {...props}>
      {options?.map?.((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </SelectContainer>
  );
}
