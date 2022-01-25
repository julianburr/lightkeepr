import { Avatar } from "./avatar";

import CheckSvg from "src/assets/icons/check.svg";
import AlertSvg from "src/assets/icons/alert-circle.svg";
import MinusSvg from "src/assets/icons/minus.svg";
import LoaderSvg from "src/assets/icons/loader.svg";
import styled, { keyframes } from "styled-components";

type Status = "error" | "warning" | "success" | "pending" | "running";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderIcon = styled(LoaderSvg)`
  animation: ${spin} 3s ease-in-out infinite;
`;

function getBackground(status: Status) {
  return status === "error"
    ? "#f5737f"
    : status === "warning"
    ? "#ffcb7c"
    : status === "success"
    ? "#b7de86"
    : "#dad9d044";
}

function getColor(status: Status) {
  return status && ["error", "warning", "success"].includes(status)
    ? "#fff"
    : "#000";
}

function getIcon(status: Status) {
  return ["error", "warning"].includes(status) ? (
    <AlertSvg />
  ) : status === "success" ? (
    <CheckSvg />
  ) : status === "running" ? (
    <LoaderIcon />
  ) : (
    <MinusSvg />
  );
}

type StatusAvatarProps = {
  status: Status;
};

export function StatusAvatar({ status }: StatusAvatarProps) {
  return (
    <Avatar background={getBackground(status)} color={getColor(status)}>
      {getIcon(status)}
    </Avatar>
  );
}
