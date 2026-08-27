export type Country = "CA" | "US";

export type Scenario = {
  id: string;
  title: string;
  description: string;
};

export const SCENARIOS: Scenario[] = [
  {
    id: "export-us",
    title: "Export to the United States",
    description: "You sell products to customers in the U.S.",
  },
  {
    id: "import-us",
    title: "Import from the United States",
    description: "You buy products from U.S. suppliers.",
  },
  {
    id: "export-other",
    title: "Export to other countries",
    description: "You sell products outside the U.S.",
  },
  {
    id: "import-other",
    title: "Import from other countries",
    description: "You buy products from outside the U.S.",
  },
];

export const OTHER_CATEGORY = "Other / Custom";

export const CATEGORIES = [
  "Auto parts",
  "Electronics",
  "Furniture",
  "Apparel & Textiles",
  "Steel & Metals",
  "Agri-food",
  "Machinery",
  "Chemicals",
  OTHER_CATEGORY,
];
