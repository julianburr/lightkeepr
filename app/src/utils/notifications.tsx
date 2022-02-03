import AlertSvg from "src/assets/icons/alert-circle.svg";
import MessageSvg from "src/assets/icons/message-circle.svg";
import UserSvg from "src/assets/icons/user.svg";
import ZapSvg from "src/assets/icons/zap.svg";

export function getNotificationIcon(type: string) {
  switch (type) {
    case "comment":
      return <MessageSvg />;
    case "failed-report":
      return <AlertSvg />;
    case "user":
      return <UserSvg />;
    default:
      return <ZapSvg />;
  }
}
