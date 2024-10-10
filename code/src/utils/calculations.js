export function calculateTotalPaidAllTime(subscriptions) {
  const now = new Date();
  return subscriptions.reduce((total, sub) => {
    const startDate = new Date(sub.startDate);
    const endDate = sub.endDate ? new Date(sub.endDate) : now;
    const monthsDiff =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      endDate.getMonth() -
      startDate.getMonth();

    if (sub.frequency === "monthly") {
      return total + sub.cost * (monthsDiff + 1);
    } else if (sub.frequency === "yearly") {
      const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
      return total + sub.cost * (yearsDiff + 1);
    }
    return total;
  }, 0);
}

export function calculateTotalMonthlySpend(subscriptions) {
  return subscriptions.reduce((total, sub) => {
    if (sub.endDate && new Date(sub.endDate) < new Date()) return total;
    return total + (sub.frequency === "monthly" ? sub.cost : sub.cost / 12);
  }, 0);
}
