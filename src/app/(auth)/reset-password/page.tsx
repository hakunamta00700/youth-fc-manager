"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { KeyRound, ArrowLeft, Loader2, MailCheck } from "lucide-react";

function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    setLoading(true);

    try {
      // Simulate sending reset email
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSent(true);
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
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600">
          <KeyRound className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">비밀번호 재설정</h1>
        <p className="mt-1 text-sm text-gray-500">
          가입한 이메일을 입력하시면 인증 링크를 보내드립니다
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Success state */}
      {sent ? (
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
            <MailCheck className="h-7 w-7 text-emerald-600" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            이메일이 전송되었습니다
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            <span className="font-medium text-gray-700">{email}</span>로
            비밀번호 재설정 링크를 보냈습니다.
            <br />
            이메일을 확인해주세요.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            로그인으로 돌아가기
          </Link>
        </div>
      ) : (
        <>
          {/* Reset form */}
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
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  전송 중...
                </>
              ) : (
                "인증 메일 보내기"
              )}
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-4 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              로그인으로 돌아가기
            </Link>
          </div>

          {/* Steps info */}
          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 text-xs font-semibold text-gray-500">
              <svg
                className="mr-1 inline-block h-3 w-3"
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
              인증 절차
            </h3>
            <ol className="list-inside list-decimal space-y-1 text-xs text-gray-500">
              <li>이메일 주소 입력</li>
              <li>인증 메일 수신 (1~2분 소요)</li>
              <li>메일 내 링크 클릭</li>
              <li>새 비밀번호 설정 완료</li>
            </ol>
          </div>
        </>
      )}
    </div>
  );
}

export default ResetPasswordPage;
