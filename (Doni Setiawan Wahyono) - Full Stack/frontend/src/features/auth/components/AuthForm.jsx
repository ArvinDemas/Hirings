import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function AuthForm({
  mode,
  error,
  isSubmitting,
  onSubmit,
  footer,
}) {
  const isRegister = mode === "register";
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(isRegister ? form : { email: form.email, password: form.password });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {isRegister ? (
        <label className="block">
          <span className="text-[16px] font-extrabold leading-none text-[#1d2939]">
            Nama Lengkap
          </span>
          <input
            className="mt-2 h-[52px] w-full rounded-xl border border-[#d9e2ef] bg-white px-5 text-[18px] text-[#344054] outline-none transition placeholder:text-[#9aa7bd] focus:border-[#2b0b3d] focus:ring-4 focus:ring-[#fdf2ff]"
            name="fullName"
            type="text"
            autoComplete="name"
            value={form.fullName}
            onChange={updateField}
            required
            minLength={2}
            maxLength={120}
            placeholder="Doni Setiawan"
          />
        </label>
      ) : null}

      <label className="block">
        <span className="text-[16px] font-extrabold leading-none text-[#1d2939]">
          Alamat Email
        </span>
        <input
          className="mt-2 h-[52px] w-full rounded-xl border border-[#d9e2ef] bg-white px-5 text-[18px] text-[#344054] outline-none transition placeholder:text-[#9aa7bd] focus:border-[#2b0b3d] focus:ring-4 focus:ring-[#fdf2ff]"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={updateField}
          required
          placeholder="nama@email.com"
        />
      </label>

      <label className="block">
        <span className="flex items-center justify-between text-[16px] font-extrabold leading-none text-[#1d2939]">
          Password
          {!isRegister ? (
            <Link className="font-extrabold text-[#2b0b3d] transition hover:text-[#5e1781]" to="/login">
              Lupa password?
            </Link>
          ) : null}
        </span>
        <div className="relative mt-2">
          <input
            className="h-[52px] w-full rounded-xl border border-[#d9e2ef] bg-white px-5 pr-16 text-[18px] text-[#344054] outline-none transition placeholder:text-[#9aa7bd] focus:border-[#2b0b3d] focus:ring-4 focus:ring-[#fdf2ff]"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={isRegister ? "new-password" : "current-password"}
            value={form.password}
            onChange={updateField}
            required
            minLength={isRegister ? 8 : 1}
            maxLength={72}
            placeholder={isRegister ? "Minimum 8 karakter" : "Password Anda"}
          />
          <button
            className="absolute right-4 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-[#98a2b3] transition hover:bg-slate-100 hover:text-slate-700"
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </label>

      {!isRegister ? (
        <label className="flex w-fit items-center gap-3 text-[16px] leading-none text-[#475467]">
          <input
            className="h-5 w-5 rounded border-[#98a2b3] text-[#2b0b3d] focus:ring-[#2b0b3d]"
            type="checkbox"
          />
          Ingat saya
        </label>
      ) : null}

      {error ? (
        <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-800">
          <AlertCircle className="mt-0.5 shrink-0 text-red-500" size={16} aria-hidden="true" />
          <p>{error}</p>
        </div>
      ) : null}

      <button
        className="flex h-[60px] w-full items-center justify-center gap-2 rounded-xl bg-[#2b0b3d] px-4 text-[18px] font-extrabold text-white shadow-[0_10px_20px_rgba(43,11,61,0.2)] transition hover:bg-[#1a0625] disabled:cursor-not-allowed disabled:opacity-65"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : null}
        {isRegister ? "Buat Akun" : "Masuk ke Dashboard"}
      </button>

      {footer}
    </form>
  );
}
