// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// ユーザー型を拡張
declare module "next-auth" {
  interface Session {
    user: {
      sub: string; // Google ID (sub) を追加
    } & DefaultSession["user"]; // 既存のプロパティを継承
  }

  interface User extends DefaultUser {
    sub: string; // Google ID (sub) を追加
  }
}