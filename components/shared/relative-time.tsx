"use client";

import { formatDistanceToNow } from "date-fns";

export function RelativeTime({ date }: { date: string }) {
  return (
    <time dateTime={date} title={new Date(date).toLocaleString()}>
      {formatDistanceToNow(new Date(date), { addSuffix: true })}
    </time>
  );
}
