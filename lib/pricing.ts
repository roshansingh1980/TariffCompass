export const PRICING = {
  business: {
    name: "TariffCompass Business",
    monthlyCad: 99,
    foundingMonthlyCad: 49.5,
    foundingCustomerLimit: 10,
    foundingMonths: 12,
  },
  advisor: {
    name: "TariffCompass Advisor",
    monthlyCad: 249,
    foundingMonthlyCad: 124.5,
    foundingCustomerLimit: 3,
    foundingMonths: 12,
  },
} as const;

export type SubscriptionTier = keyof typeof PRICING;

