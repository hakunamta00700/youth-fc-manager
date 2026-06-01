"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Eye, EyeOff, Loader2 } from "lucide-react";

function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    inviteCode: "",
    role: "parent" as "parent" | "coach",
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }
    if (!formData.email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (!formData.password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }
    if (formData.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!formData.inviteCode.trim()) {
      setError("초대 코드를 입력해주세요.");
      return;
    }
    if (!formData.agreeTerms) {
      setError("약관에 동의해주세요.");
      return;
    }

    setLoading(true);

    try {
      // Simulated registration (scaffold - no real API yet)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(
        "회원가입이 완료되었습니다! 로그인 페이지로 이동합니다."
      );

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Logo / Title */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600">
          <UserPlus className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">계정 생성</h1>
        <p className="mt-1 text-sm text-gray-500">
          초대 링크를 통해 가입할 수 있습니다
        </p>
      </div>

      {/* Info alert */}
      <div className="mb-4 flex items-start gap-2 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
        <svg
          className="mt-0.5 h-4 w-4 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
          />
        </svg>
        <span>관리자의 초대가 있어야 가입할 수 있습니다.</span>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600">
          {success}
        </div>
      )}

      {/* Register form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            이름
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="홍길동"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="name@example.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="6자 이상"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={
                  showPassword ? "비밀번호 숨기기" : "비밀번호 표시"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="passwordConfirm"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              비밀번호 확인
            </label>
            <div className="relative">
              <input
                id="passwordConfirm"
                type={showPasswordConfirm ? "text" : "password"}
                value={formData.passwordConfirm}
                onChange={(e) =>
                  handleChange("passwordConfirm", e.target.value)
                }
                placeholder="다시 입력"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswordConfirm(!showPasswordConfirm)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={
                  showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 표시"
                }
              >
                {showPasswordConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            전화번호
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="010-1234-5678"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="inviteCode"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            초대 코드
          </label>
          <input
            id="inviteCode"
            type="text"
            value={formData.inviteCode}
            onChange={(e) => handleChange("inviteCode", e.target.value)}
            placeholder="초대 링크의 코드를 입력하세요"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            disabled={loading}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            가입 유형
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                checked={formData.role === "parent"}
                onChange={() => handleChange("role", "parent")}
                className="h-4 w-4 border-gray-300 text-violet-600 focus:ring-violet-500"
                disabled={loading}
              />
              <span className="text-sm text-gray-700">학부모</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                checked={formData.role === "coach"}
                onChange={() => handleChange("role", "coach")}
                className="h-4 w-4 border-gray-300 text-violet-600 focus:ring-violet-500"
                disabled={loading}
              />
              <span className="text-sm text-gray-700">코치</span>
            </label>
          </div>
        </div>

        <div>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={(e) => handleChange("agreeTerms", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              disabled={loading}
            />
            <span className="text-sm text-gray-600">
              {/* biome-ignore lint: lint/suspicious/noMisleadingCharacterClass */}
              <Link href="/terms" className="text-violet-600 hover:underline">
                이용약관
              </Link>{" "}
              및{" "}
              <Link
                href="/privacy"
                className="text-violet-600 hover:underline"
              >
                개인정보처리방침
              </Link>
              에 동의합니다
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              처리 중...
            </>
          ) : (
            "계정 생성"
          )}
        </button>
      </form>

      {/* Login link */}
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-500">
          이미 계정이 있으신가요?{" "}
        </span>
        <Link
          href="/login"
          className="text-sm font-medium text-violet-600 hover:text-violet-700 hover:underline"
        >
          로그인
        </Link>
      </div>
    </div>
  );
}

export default RegisterPage;
