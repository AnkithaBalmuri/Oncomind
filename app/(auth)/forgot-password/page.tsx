import Link from "next/link";
import { AuthForm } from "@/components/shared/auth-form";

export default function ForgotPasswordPage() {
  return (
    <AuthForm
      title="Reset password"
      description="Send a secure recovery link to your email."
      action="Send reset link"
      footer={
        <>
          Remembered it? <Link className="text-primary" href="/login">Back to login</Link>
        </>
      }
    />
  );
}
