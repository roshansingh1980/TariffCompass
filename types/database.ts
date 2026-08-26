/**
 * Hand-written types mirroring supabase/migrations/001_initial_schema.sql
 * and 002_add_trade_profile_columns.sql. Keep these in sync with the
 * migrations if the schema changes.
 */

// ============================================================
// profiles
// ============================================================

export interface Profile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  created_at: string;
  updated_at: string;
}

export type ProfileInsert = {
  id: string;
  full_name?: string | null;
  company_name?: string | null;
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
