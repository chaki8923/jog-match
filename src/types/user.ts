// types/user.ts
export type User = {
  id: string;
  customerId?: string;
  name?: string;
  email?: string;
  emailVerified?: string; // DateTime 型は文字列として扱います
  image?: string;
  country?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  line1?: string;
  line2?: string;
};