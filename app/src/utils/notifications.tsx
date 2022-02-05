import MessageSvg from "src/assets/icons/outline/chat-alt.svg";
import AlertSvg from "src/assets/icons/outline/exclamation-circle.svg";
import ZapSvg from "src/assets/icons/outline/lightning-bolt.svg";
import UserSvg from "src/assets/icons/outline/user.svg";

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
