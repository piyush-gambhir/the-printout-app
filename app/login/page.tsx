import Image from "next/image";

import { LoginForm } from "@/components/LoginForm";
export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <LoginForm />
    </div>
  );
}
