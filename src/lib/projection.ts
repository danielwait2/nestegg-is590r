export function calcProjection(
  monthlyContribution: number,
  yearsToGrow: number,
  annualRate = 0.07
): number {
  if (monthlyContribution < 0 || yearsToGrow < 0) return 0;
  const monthlyRate = annualRate / 12;
  const months = yearsToGrow * 12;
  if (monthlyRate === 0) return monthlyContribution * months;
  return monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}
