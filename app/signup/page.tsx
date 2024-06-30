import Image from "next/image";

import { SignUpForm } from "@/components/SignUpForm";
export default function SignUp() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <SignUpForm />
    </div>
  );
}
