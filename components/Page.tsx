"use client";
import { FC } from "react";
import Navigation from "./Navigation/Navigation";
import { SignIn } from "./SignIn";

type PageProps = {
  children: React.ReactNode;
}

const Page: FC<PageProps> = ({ children }) => {

  return (
  <main style={{
    display: "flex",
    flexDirection: "column",
    height: '100vh',
    // 1 rem sides and 3 rem bottom, 1 rem top
    padding: '1rem',
    gap: '1rem',
    boxSizing: 'border-box',
  }}>
      <SignIn />
      { children }
  </main>
  )
}

export default Page;