import type { PropsWithChildren } from "react";

export function LinkList(props: PropsWithChildren<{ title: string }>) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-primary">{props.title}</h3>
      <ul role="list" className="space-y-1">
        {props.children}
      </ul>
    </div>
  );
}
