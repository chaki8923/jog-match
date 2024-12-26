"use client";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "@/auth/helpers";
import styles from './button/auth_button.module.scss'

export default function AuthButton() {
  const session = useSession();

  return session?.data?.user ? (
    <button
      className={`bg-red-500 text-white px-4 py-2 rounded ${styles.authButton}`}
      onClick={async () => {
        await signOut();
        await signIn();
      }}
    >
      Sign Out
    </button>
  ) : (
    <button
      className={`bg-blue-500 text-white px-4 py-2 rounded ${styles.authButton}`}
      onClick={async () => await signIn()}
    >
      Sign In
    </button>
  );
}