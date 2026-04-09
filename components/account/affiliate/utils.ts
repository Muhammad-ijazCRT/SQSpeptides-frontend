export function statusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Pending review";
    case "paid":
      return "Paid";
    case "rejected":
      return "Rejected";
    default:
      return status;
  }
}

export function truncateAddr(s: string, head = 10, tail = 8) {
  if (s.length <= head + tail + 3) return s;
  return `${s.slice(0, head)}…${s.slice(-tail)}`;
}
