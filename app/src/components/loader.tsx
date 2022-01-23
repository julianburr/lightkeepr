import styled, { keyframes } from "styled-components";

import LogoSvg from "src/assets/logo.svg";
import { ReactNode } from "react";

const spin = keyframes`
  0% {
    transform: rotate(0deg);
    stroke-dashoffset: calc(0.6 * var(--spinner-size));
  } 

  50% {
    transform: rotate(720deg);
    stroke-dashoffset: calc(${Math.PI} * var(--spinner-size));
  } 

  100% {
    transform: rotate(1080deg);
    stroke-dashoffset: calc(0.6 * var(--spinner-size));
  }
`;

const Svg = styled.svg<{ size: number }>`
  width: ${(props) => `${props.size}px`};
  height: ${(props) => `${props.size}px`};
  x: 0px;
  y: 0px;
  viewbox: ${(props) => `0 0 ${props.size}px ${props.size}px`};
`;

const Circle = styled.circle<{ size: number; width: number; color: string }>`
  --spinner-size: ${(props) => `${props.size}px`};
  fill: transparent;
  stroke: ${(props) => props.color};
  stroke-width: ${(props) => props.width};
  stroke-linecap: round;
  stroke-dasharray: ${(props) => Math.PI * props.size}px;
  stroke-radius: ${(props) => `${props.width}px`};
  transform-origin: ${(props) => `${props.size / 2}px ${props.size / 2}px 0`};
  animation: ${spin} 3s linear infinite;
`;

type SpinnerProps = {
  size?: number;
  width?: number;
  color?: string;
};

export function Spinner({
  size = 95,
  width = 2,
  color = "rgba(0, 0, 0, 0.15)",
}: SpinnerProps) {
  return (
    <Svg size={size}>
      <Circle
        size={size}
        width={width}
        color={color}
        cx={size / 2}
        cy={size / 2}
        r={(size - width) / 2}
      />
    </Svg>
  );
}

const Container = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  justify-self: center;
  position: relative;
  width: 100%;
  height: 100%;
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  justify-self: center;
  position: relative;
`;

const Center = styled.div`
  position: absolute;
  inset: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;

  svg {
    height: 5rem;
    width: auto;
    filter: grayscale(1);
    opacity: 0.15;
  }
`;

const Message = styled.div`
  color: rgba(0, 0, 0, 0.2);
  font-family: "Playfair Display";
  position: absolute;
  top: calc(100% + 1.2rem);
  left: 0;
  right: 0;
  text-align: center;
`;

type LoaderProps = {
  message?: ReactNode;
};

export function Loader({ message = "Loading..." }: LoaderProps) {
  return (
    <Container>
      <Inner>
        <Spinner />
        <Center>
          <LogoSvg />
        </Center>
        <Message>{message}</Message>
      </Inner>
    </Container>
  );
}
