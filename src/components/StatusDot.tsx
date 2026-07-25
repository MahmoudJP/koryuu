import { type Status, STATUS_LABEL } from "@/data/apps";

const COLORS: Record<Status, string> = {
  live: "#22c55e",
  beta: "#f59e0b",
  "in-development": "#5b5bd6",
  internal: "#94a3b8",
};

export function StatusDot({ status }: { status: Status }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-medium text-muted">
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: COLORS[status] }}
      />
      {STATUS_LABEL[status]}
    </span>
  );
}
