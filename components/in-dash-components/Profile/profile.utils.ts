export function buildLastFiveMonths(): string[] {
  const months: string[] = [];
  for (let i = 4; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    months.push(d.toLocaleString("default", { month: "short" }));
  }
  return months;
}

export function normalizeCollaborations(collabs: any[] = []) {
  return collabs
    .map((c) => ({
      id: c.id,
      createdAt: c.createdAt,
      brand: c.brand,
    }))
    .slice(-4)
    .reverse();
}

export function normalizeTransactions(txs: any[] = []) {
  return txs.map((tx) => {
    const date = new Date(tx.createdAt || tx.updatedAt);
    return {
      amount: Number(tx.amount || 0),
      type: String(tx.type || "").toUpperCase(),
      status: String(tx.status || "").toUpperCase(),
      month: date.toLocaleString("default", { month: "short" }),
    };
  });
}
