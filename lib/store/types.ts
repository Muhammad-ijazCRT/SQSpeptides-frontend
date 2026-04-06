export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  rating: number;
};

export type CartLine = {
  product: Product;
  quantity: number;
};

export type OrderCreated = {
  id: string;
  email: string;
  total: number;
  status: string;
  createdAt: string;
};
