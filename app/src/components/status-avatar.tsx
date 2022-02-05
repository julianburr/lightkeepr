import styled, { keyframes } from "styled-components";

import { Avatar } from "src/components/avatar";

import CheckCircleSvg from "src/assets/icons/outline/check-circle.svg";
import CheckSvg from "src/assets/icons/outline/check.svg";
import AlertSvg from "src/assets/icons/outline/exclamation-circle.svg";
import LoaderSvg from "src/assets/icons/outline/loader.svg";
import MinusSvg from "src/assets/icons/outline/minus.svg";
import XSvg from "src/assets/icons/outline/x.svg";

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
    : status === "running"
    ? "var(--sol--color-brand-500)"
    : undefined;
}

function getColor(status: string) {
  return status?.startsWith?.("failed") ||
    status === "passed" ||
    status === "running"
    ? "var(--sol--color-white)"
    : "var(--sol--palette-sand-800)";
}

function getIcon(status: string, statusReasons?: string[]) {
  return status?.startsWith?.("failed") ? (
    <AlertSvg />
  ) : status === "passed" ? (
    statusReasons?.includes?.("manual") ? (
      <CheckCircleSvg />
    ) : (
      <CheckSvg />
    )
  ) : status === "running" ? (
    <LoaderIcon />
  ) : status === "cancelled" ? (
    <XSvg />
  ) : (
    <MinusSvg />
  );
}

type StatusAvatarProps = {
  status: string;
  statusReasons?: string[];
};

export function StatusAvatar({ status, statusReasons }: StatusAvatarProps) {
  return (
    <Avatar background={getBackground(status)} color={getColor(status)}>
      {getIcon(status, statusReasons)}
    </Avatar>
  );
}
