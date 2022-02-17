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

type Status = {
  value?: string;
  reasons?: string[];
};

function getBackground(status?: Status) {
  switch (status?.value) {
    case "failed":
      return "var(--sol--palette-red-500)";
    case "passed":
      return "var(--sol--palette-green-500)";
    case "running":
      return "var(--sol--color-brand-500)";
    default:
      return "var(--sol--palette-sand-200)";
  }
}

function getColor(status?: Status) {
  switch (status?.value) {
    case "failed":
    case "passed":
    case "running":
      return "var(--sol--color-white)";
    default:
      return "var(--sol--palette-sand-800)";
  }
}

function getIcon(status?: Status) {
  switch (status?.value) {
    case "failed":
      return <AlertSvg />;

    case "cancelled":
      return <XSvg />;

    case "running":
      return <LoaderIcon />;

    case "passed":
      return status?.reasons?.includes?.("manual") ? (
        <CheckCircleSvg />
      ) : (
        <CheckSvg />
      );

    default:
      return <MinusSvg />;
  }
}

type StatusAvatarProps = {
  status?: Status;
};

export function StatusAvatar({ status }: StatusAvatarProps) {
  return (
    <Avatar background={getBackground(status)} color={getColor(status)}>
      {getIcon(status)}
    </Avatar>
  );
}
