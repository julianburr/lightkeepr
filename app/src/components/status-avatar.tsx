import { Avatar } from "./avatar";

import CheckSvg from "src/assets/icons/check.svg";
import AlertSvg from "src/assets/icons/alert-circle.svg";
import MinusSvg from "src/assets/icons/minus.svg";
import LoaderSvg from "src/assets/icons/loader.svg";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderIcon = styled(LoaderSvg)`
  animation: ${spin} 3s ease-in-out infinite;
`;

function getBackground(status: string) {
  return status?.startsWith?.("failed")
    ? "var(--sol--palette-red-500)"
    : status === "passed"
    ? "var(--sol--palette-green-500)"
    : "#dad9d044";
}

function getColor(status: string) {
  return status?.startsWith?.("failed") || status === "passed"
    ? "var(--sol--color-white)"
    : "var(--sol--color-black)";
}

function getIcon(status: string) {
  return status?.startsWith?.("failed") ? (
    <AlertSvg />
  ) : status === "passed" ? (
    <CheckSvg />
  ) : status === "running" ? (
    <LoaderIcon />
  ) : (
    <MinusSvg />
  );
}

type StatusAvatarProps = {
  status: string;
};

export function StatusAvatar({ status }: StatusAvatarProps) {
  return (
    <Avatar background={getBackground(status)} color={getColor(status)}>
      {getIcon(status)}
    </Avatar>
  );
}
