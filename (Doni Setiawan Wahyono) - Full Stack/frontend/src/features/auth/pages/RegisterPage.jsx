import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../AuthContext.jsx";
import AuthForm from "../components/AuthForm.jsx";
import AuthLayout from "../components/AuthLayout.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, register } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(payload) {
    setError("");
    setIsSubmitting(true);

    try {
      await register(payload);
      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Career Intelligence Platform"
      title="Buat Akun"
      subtitle="Mulai perjalanan karir Anda bersama Hirings."
    >
      <AuthForm
        mode="register"
        error={error}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        footer={
          <p className="text-center text-base text-[#667085]">
            Sudah punya akun?{" "}
            <Link className="font-bold text-[#2b0b3d] hover:text-[#5e1781]" to="/login">
              Masuk
            </Link>
          </p>
        }
      />
    </AuthLayout>
  );
}
