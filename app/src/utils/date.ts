import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type FirebaseDateObj = {
  seconds: number;
  microseconds: number;
};

export function formatDateSince(firebaseDateObj?: FirebaseDateObj) {
  const date = dayjs(firebaseDateObj?.seconds * 1000);
  return dayjs().to(date);
}
