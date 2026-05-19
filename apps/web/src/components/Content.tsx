import type { PropsWithChildren } from "react";

export function Content({ children }: PropsWithChildren) {
  return <div className="w-full p-6">{children}</div>;
}
