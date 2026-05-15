import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../AuthContext.jsx";
import AuthForm from "../components/AuthForm.jsx";
import AuthLayout from "../components/AuthLayout.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(payload) {
    setError("");
    setIsSubmitting(true);

    try {
      await login(payload);
      navigate(redirectTo, { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Career Intelligence Platform"
      title="Selamat Datang"
      subtitle="Akses sistem Hirings untuk melanjutkan."
    >
      <AuthForm
        mode="login"
        error={error}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        footer={
          <p className="text-center text-base text-[#667085]">
            Belum punya akun?{" "}
            <Link className="font-bold text-[#2b0b3d] hover:text-[#5e1781]" to="/register">
              Daftar sekarang
            </Link>
          </p>
        }
      />
    </AuthLayout>
  );
}
