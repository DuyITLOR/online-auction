export interface User {
  id: string;
  email: string;
  createdAt: string;
  fullname?: string | null;
  password?: string | null;
  ratingNeg: number;
  ratingPos: number;
  role: 'bidder' | 'admin';
  avtUrl: string;

  autoBids?: AutoBids[];
  blockedOn?: BlockedBidders[];
  chat?: Chat[];
  comments?: Comments[];
  ordersAsBuyer?: Orders[];
  ordersAsSeller?: Orders[];
  products?: Product[];
  ratingsReceived?: Ratings[];
  ratingsGiven?: Ratings[];
  upgradeRequests?: UpgradeRequests[];
  watchList?: WatchList[];
  productWinner?: Product[];
  bidHistory?: BidHistory[];
}

export interface Product {
  id: string;
  sellerId: string;
  categoryId: string;
  title: string;
  description: string;
  startPrice: string;
  currentPrice: string;
  stepPrice: string;
  buyNowPrice: string;
  autoExtendEnabled: boolean;
  autoExtendMinutes: number;
  startedAt: string;
  endAt: string;
  updatedAt: string;
  highRatingRequired: boolean;
  winnerId?: string | null;

  winner?: User | null;
  bidHistory?: BidHistory[];
  autoBids?: AutoBids[];
  blockedBidders?: BlockedBidders[];
  chat?: Chat[];
  comments?: Comments[];
  order?: Orders | null;
  images?: ProductImage[];
  category: Category;
  seller: User;
  ratings?: Ratings[];
  watchlistedBy?: WatchList[];
}

export interface EmailVerification {
  id: string;
  code: string;
  email: string;
  expiresAt: string;
  status: 'not-yet' | 'failed' | 'success';
  createdAt: string;
}

export interface UpgradeRequests {
  id: string;
  userId: string;
  note?: string | null;
  createdAt: string;
  decidedAt?: string | null;
  status: 'not-yet' | 'failed' | 'success';
  expiredAt?: string | null;

  user: User;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string | null;

  parent?: Category | null;
  children?: Category[];
  products?: Product[];
}

export interface Comments {
  id: string;
  productId: string;
  senderId: string;
  parentId?: string | null;
  content: string;
  sendAt: string;

  parent?: Comments | null;
  replies?: Comments[];
  product: Product;
  sender: User;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  sortOrder: number;
  product: Product;
}

export interface AutoBids {
  id: string;
  productId: string;
  bidderId: string;
  maxAmount: string;
  createdAt: string;

  bidder: User;
  product: Product;
}

export interface BidHistory {
  id: string;
  productId: string;
  bidderId: string;
  amount: string;
  createdAt: string;

  product: Product;
  bidder: User;
}

export interface WatchList {
  userId: string;
  productId: string;
  createAt: string;

  product: Product;
  user: User;
}

export interface Chat {
  id: string;
  productId: string;
  senderId: string;
  content: string;
  sendAt: string;

  product: Product;
  sender: User;
}

export interface BlockedBidders {
  productId: string;
  userId: string;
  reason?: string | null;
  createdAt: string;

  product: Product;
  user: User;
}

export interface Ratings {
  id: string;
  raterId: string;
  rateeId: string;
  productId: string;
  value: number;
  comment?: string | null;
  createdAt: string;
  longngu: string;

  product: Product;
  ratee: User;
  rater: User;
}

export interface Orders {
  id: string;
  productId: string;
  sellerId: string;
  buyerId: string;
  phoneNumber: number;
  status: 'unpaid' | 'shipping' | 'canceled' | 'completed';
  shippingAddress: string;
  paymentInvoiceUrl?: string | null;
  shippingInvoiceUrl?: string | null;
  cancelReason?: string | null;
  createdAt: string;
  updatedAt: string;

  buyer: User;
  product: Product;
  seller: User;
}
