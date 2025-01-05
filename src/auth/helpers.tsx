"use server";
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "@/auth";

export async function signIn() {
  await nextAuthSignIn('google', {redirectTo: "/tracking"});
}

export async function signOut() {
  await nextAuthSignOut({redirectTo: "/"});
}

