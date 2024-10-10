export function getNextPaymentDate(subscription) {
  const today = new Date();
  const startDate = new Date(subscription.startDate);
  let nextPaymentDate = new Date(startDate);

  if (subscription.endDate && new Date(subscription.endDate) < today) {
    return null;
  }

  if (subscription.frequency === "monthly") {
    while (nextPaymentDate <= today) {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    }
  } else if (subscription.frequency === "yearly") {
    while (nextPaymentDate <= today) {
      nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
    }
  }

  return nextPaymentDate;
}
