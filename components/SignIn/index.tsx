"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./SignIn.module.scss";
import Image from "next/image";
import { useEffect } from "react";
import { Icon } from "@/utils/Icons";
import Concat from "@/utils/ConcatUser";

export const SignIn = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if(session) {
      console.log(session);
    }
  }, [session]);

  if(session) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.5rem",
        flexDirection: "row",
      }}>
        <div style={{
          display: 'flex',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          flexDirection: 'row',
          gap: '0.5rem',
          alignItems: 'center',
        }}>
          {Concat(session?.user?.name!)}
          {/* square with faction colour or var(--foreground) */}
          <div style={{
            width: "1rem",
            height: "1rem",
            backgroundColor: `var(--red)`,
            borderRadius: "50%",
          }}/>
        </div>
        <button onClick={() => signOut()} className={styles.logoutButton}>
          <Icon icon="exit" style={{
            width: "1rem",
            height: "1rem",
          }}/>
        </button>
      </div>
    )
  } else {
    return (
      <button onClick={() => signIn()} className={styles.loginButton}>Verify to Sign In</button>
    );
  }
};
