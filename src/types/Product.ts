export interface Product {
  id: number;
  title: string;
  description?: string;
  price: number;
  rating: number;
  thumbnail: string;
  images?: string[];
  category?: string;
  brand?: string;
  stock?: number;
  availabilityStatus?: string;
  warrantyInformation?: string;
  shippingInformation?: string;
  reviews?: ProductReview[];
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}