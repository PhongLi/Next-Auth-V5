"use client";

import { useRouter } from "next/navigation";

interface LoginButtonProps {
  children: React.ReactNode;
  mode: "modal" | "redirect";
  asChild?: boolean;
}

const LoginButton = ({ children, mode, asChild }: LoginButtonProps) => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/auth/login");
  };

  if (mode === "modal") {
    return <span>TODO: Login Modal</span>;
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <span className='cursor-pointer' onClick={handleClick}>
      {children}
    </span>
  );
};

export default LoginButton;
