import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Sign in | Odeon Print Hub",
  description: "Sign in to your Odeon Print Hub account to manage your print orders.",
};

export default function LoginPage() {
  return <LoginForm />;
}