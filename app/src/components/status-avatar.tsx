import { Avatar } from "./avatar";

import CheckSvg from "src/assets/icons/check.svg";
import AlertSvg from "src/assets/icons/alert-circle.svg";
import MinusSvg from "src/assets/icons/minus.svg";

type Status = "error" | "warning" | "success" | "pending";

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
