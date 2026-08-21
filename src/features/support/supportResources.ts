import type { SupportRegion } from "@/shared/state/AppProvider";

export type SupportResource = {
  kind: "crisis" | "emergency";
  number: string;
  sourceUrl: string;
};

export const supportResources: Record<SupportRegion, SupportResource[]> = {
  ukraine: [
    {
      kind: "emergency",
      number: "112",
      sourceUrl: "https://bezpeka.dsns.gov.ua/contacts",
    },
  ],
  usa: [
    {
      kind: "crisis",
      number: "988",
      sourceUrl: "https://988lifeline.org/",
    },
    {
      kind: "emergency",
      number: "911",
      sourceUrl: "https://www.911.gov/",
    },
  ],
  canada: [
    {
      kind: "crisis",
      number: "988",
      sourceUrl: "https://www.canada.ca/en/public-health/services/suicide-prevention.html",
    },
    {
      kind: "emergency",
      number: "911",
      sourceUrl: "https://www.canada.ca/en/public-health/services/mental-health-services/mental-health-get-help.html",
    },
  ],
  europe: [
    {
      kind: "emergency",
      number: "112",
      sourceUrl: "https://digital-strategy.ec.europa.eu/en/policies/112",
    },
  ],
  other: [],
};
