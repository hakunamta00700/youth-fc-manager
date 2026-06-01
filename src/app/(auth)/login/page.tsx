"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trophy, Eye, EyeOff, Loader2 } from "lucide-react";

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "로그인에 실패했습니다.");
        setLoading(false);
        return;
      }

      // Store token in localStorage for client-side use
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }

      // Redirect based on role
      const role = data.user.role;
      if (role === "admin") router.push("/admin");
      else if (role === "manager") router.push("/manager");
      else if (role === "coach") router.push("/coach");
      else if (role === "parent") router.push("/parent");
      else router.push("/");
    } catch {
      setError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Logo / Title */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
          <Trophy className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Youth FC Manager</h1>
        <p className="mt-1 text-sm text-gray-500">
          유소년 축구클럽 관리 시스템
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Login form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            autoComplete="email"
            disabled={loading}
          />
        </div>

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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              autoComplete="current-password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={loading}
            />
            <span className="text-sm text-gray-600">로그인 상태 유지</span>
          </label>
          <Link
            href="/reset-password"
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            비밀번호 찾기
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              로그인 중...
            </>
          ) : (
            "로그인"
          )}
        </button>
      </form>

      {/* Register link */}
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-500">
          아직 계정이 없으신가요?{" "}
        </span>
        <Link
          href="/register"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          계정 생성
        </Link>
      </div>

      {/* Demo accounts info */}
      <div className="mt-6 rounded-lg bg-gray-50 p-4">
        <p className="mb-2 text-xs font-semibold text-gray-500">
          테스트 계정
        </p>
        <div className="space-y-1 text-xs text-gray-400">
          <p>admin@youthfc.com / admin1234 (관리자)</p>
          <p>manager@youthfc.com / manager1234 (매니저)</p>
          <p>coach@youthfc.com / coach1234 (코치)</p>
          <p>parent@youthfc.com / parent1234 (학부모)</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
