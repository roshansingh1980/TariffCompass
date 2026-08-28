/**
 * Hand-written types mirroring supabase/migrations/001_initial_schema.sql,
 * 002_add_trade_profile_columns.sql, 003_add_subscription_fields.sql,
 * 004_add_saved_profiles.sql, 005_add_exposure_fields_to_saved_profiles.sql,
 * and 20260828052639_add_subscription_tier_and_founding_pricing.sql.
 * Keep these in sync with the migrations if the schema changes.
 */

// ============================================================
// profiles
// ============================================================

export interface Profile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
  subscription_tier: "business" | "advisor" | null;
  founding_pricing: boolean;
  founding_pricing_started_at: string | null;
  founding_pricing_expires_at: string | null;
  standard_monthly_price_cad: number | null;
  created_at: string;
  updated_at: string;
}

export type ProfileInsert = {
  id: string;
  full_name?: string | null;
  company_name?: string | null;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  subscription_status?: string | null;
  subscription_tier?: "business" | "advisor" | null;
  founding_pricing?: boolean;
  founding_pricing_started_at?: string | null;
  founding_pricing_expires_at?: string | null;
  standard_monthly_price_cad?: number | null;
  created_at?: string;
  updated_at?: string;
};

export type ProfileUpdate = Partial<ProfileInsert>;

// ============================================================
// companies
// ============================================================

export interface Company {
  id: string;
  user_id: string | null;
  name: string;
  province: string | null;
  scenario: string | null;
  country: string | null;
  us_state: string | null;
  created_at: string;
  updated_at: string;
}

export type CompanyInsert = {
  id?: string;
  user_id?: string | null;
  name: string;
  province?: string | null;
  scenario?: string | null;
  country?: string | null;
  us_state?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CompanyUpdate = Partial<CompanyInsert>;

// ============================================================
// products
// ============================================================

export interface Product {
  id: string;
  company_id: string | null;
  name: string;
  hs_code: string | null;
  category: string | null;
  us_revenue_share: number | null;
  created_at: string;
  updated_at: string;
}

export type ProductInsert = {
  id?: string;
  company_id?: string | null;
  name: string;
  hs_code?: string | null;
  category?: string | null;
  us_revenue_share?: number | null;
  created_at?: string;
  updated_at?: string;
};

export type ProductUpdate = Partial<ProductInsert>;

// ============================================================
// saved_profiles
// ============================================================

export interface SavedProfile {
  id: string;
  user_id: string;
  name: string;
  scenario: string | null;
  country: string | null;
  province: string | null;
  us_state: string | null;
  category: string | null;
  annual_value: number | null;
  currency: string | null;
  hs_code: string | null;
  created_at: string;
  updated_at: string;
}

export type SavedProfileInsert = {
  id?: string;
  user_id: string;
  name: string;
  scenario?: string | null;
  country?: string | null;
  province?: string | null;
  us_state?: string | null;
  category?: string | null;
  annual_value?: number | null;
  currency?: string | null;
  hs_code?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type SavedProfileUpdate = Partial<SavedProfileInsert>;
