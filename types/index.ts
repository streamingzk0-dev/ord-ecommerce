export interface User {
  id: string;
  email: string;
  user_type: 'vendor' | 'customer' | 'admin';
  created_at: string;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  slug: string;
  logo_url?: string;
  banner_url?: string;
  currency: string;
  owner_id: string;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  shop_id: string;
  is_active: boolean;
  created_at: string;
}

export interface VendorPaymentSettings {
  id: string;
  shop_id: string;
  payment_provider: 'stripe' | 'fedapay' | 'paypal' | 'moneyfusion' | 'solestepay';
  api_key: string;
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  shop_id: string;
  product_id: string;
  quantity: number;
  total_amount: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  payment_intent_id?: string;
  created_at: string;
}