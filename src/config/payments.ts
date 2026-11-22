export type PaymentMethod = {
  id: "instapay" | "visa" | "mastercard" | "vodafone-cash" | "fawry";
  label: string;
  logoPath: `/payments/${string}` | null;
  enabled: boolean;
  logoWidth?: number;
  logoHeight?: number;
  liveCardProcessorVerified?: boolean;
};

export const payments: readonly PaymentMethod[] = [
  { id: "instapay", label: "InstaPay", logoPath: null, enabled: false },
  { id: "visa", label: "Visa", logoPath: null, enabled: false },
  { id: "mastercard", label: "Mastercard", logoPath: null, enabled: false },
  { id: "vodafone-cash", label: "Vodafone Cash", logoPath: null, enabled: false },
  { id: "fawry", label: "Fawry", logoPath: null, enabled: false },
];

export function getEnabledPayments(methods = payments) {
  return methods.flatMap((method) => {
    const { id, enabled, logoPath, logoWidth, logoHeight, liveCardProcessorVerified } = method;
    if (!enabled || !logoPath || !/^\/payments\/[a-z0-9_-]+\.(?:png|webp|svg)$/i.test(logoPath)
      || !logoWidth || !logoHeight || !Number.isSafeInteger(logoWidth) || !Number.isSafeInteger(logoHeight)
      || logoWidth < 1 || logoHeight < 1) return [];
    if ((id === "visa" || id === "mastercard") && !liveCardProcessorVerified) return [];
    return [{ id, label: method.label, logoPath, logoWidth, logoHeight }];
  });
}
