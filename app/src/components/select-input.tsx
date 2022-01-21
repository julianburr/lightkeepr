import {
  Ref,
  ReactNode,
  useCallback,
  useRef,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useFormMethods } from "react-cool-form";
import styled from "styled-components";

import { Popout } from "./popout";
import { PopoutMenu } from "./popout-menu";

import ChevronDownSvg from "src/assets/icons/chevron-down.svg";

const Container = styled.div`
  width: 100%;
`;

const WrapMenu = styled.div<{ width?: string }>`
  width: ${(props) => props.width};
  min-width: 16rem;
`;

const Button = styled.button`
  width: 100%;
  height: 3.6rem;
  border: 0.1rem solid rgba(0, 0, 0, 0.1);
  border-radius: 0.3rem;
  background: #fff;
  padding: 0 1.2rem;
  text-align: left;
  position: relative;

  &:focus,
  &:hover {
    border: 0.1rem solid rgba(0, 0, 0, 0.2);
  }

  & > svg {
    height: 1em;
    width: auto;
    stroke-width: 0.25rem;
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    pointer-events: none;
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

type Items = Item[] | ItemGroup[];

// type SeachableItems = () => Promise<Items> | Items;

type SelectInputProps = {
  id?: string;
  name: string;
  items: Items; // | SeachableItems;
  suggestions?: Items; // | SeachableItems;
  searchable?: boolean;
  minChars?: number;
};

export function SelectInput({
  id,
  name,
  items,
  suggestions,
  searchable,
  minChars,
  ...props
}: SelectInputProps) {
  const containerRef = useRef<HTMLDivElement>();

  const form = useFormMethods();
  const [value, setValue] = useState<any>();
  useEffect(() => {
    setValue(form?.use?.("values")?.[name]);
  }, []);

  const enhanceItems = useCallback(
    (items: Items): any => {
      return items.map((item) => {
        if ("items" in item) {
          return { ...item, items: enhanceItems(item.items) };
        }
        return {
          ...item,
          selectable: true,
          selected: value?.value === item.value,
          onClick: () => {
            setValue(item);
            form?.setValue?.(name, item);
          },
        };
      });
    },
    [name, value]
  );

  const enhancedItems = useMemo(() => enhanceItems(items), [items]);

  const Content = useCallback(
    ({ setVisible, element }) => (
      <WrapMenu width={`${element.clientWidth}px`}>
        <PopoutMenu
          items={enhancedItems}
          setVisible={setVisible}
          element={element}
        />
      </WrapMenu>
    ),
    [enhancedItems]
  );

  return (
    <Container ref={containerRef as Ref<HTMLDivElement>}>
      <Popout
        Content={Content}
        portalTarget={
          containerRef.current?.closest?.("[data-tether-target]") || undefined
        }
        showArrow={false}
        placement="bottom-start"
      >
        {(props: any) => (
          <Button {...props} type="button">
            <span>{value?.label}</span>
            <ChevronDownSvg />
          </Button>
        )}
      </Popout>
    </Container>
  );
}
