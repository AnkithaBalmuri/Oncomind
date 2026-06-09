import Link from "next/link";
import { AuthForm } from "@/components/shared/auth-form";

export default function LoginPage() {
  return (
    <AuthForm
      title="Welcome back"
      description="Access your OncoMind AI workspace."
      action="Sign in"
      footer={
        <>
          New to OncoMind? <Link className="text-primary" href="/signup">Create an account</Link>
        </>
      }
    />
  );
}
