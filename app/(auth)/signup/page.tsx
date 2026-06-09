import Link from "next/link";
import { AuthForm } from "@/components/shared/auth-form";

export default function SignupPage() {
  return (
    <AuthForm
      title="Create your workspace"
      description="Start with mock authentication or connect Clerk in production."
      action="Create account"
      footer={
        <>
          Already registered? <Link className="text-primary" href="/login">Sign in</Link>
        </>
      }
    />
  );
}
