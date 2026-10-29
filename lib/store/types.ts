export type Category = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  sortOrder?: number;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  rating: number;
  /** Spotlight products surface on popular / featured storefront areas. */
  spotlight?: boolean;
  categoryId?: string | null;
  category?: { id: string; name: string; slug: string } | null;
};

export type CartLine = {
  product: Product;
  quantity: number;
};

export type OrderCreated = {
  id: string;
  email: string;
  total: number;
  storeCreditUsed?: number;
  cardAmountDue?: number;
  couponDiscountAmount?: number;
  couponCodeSnapshot?: string | null;
  status: string;
  paymentProvider?: string | null;
  paymentCompletion?: string;
  createdAt: string;
  accountCreated?: boolean;
  temporaryPassword?: string;
};
