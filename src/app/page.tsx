import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="text-center space-y-6 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight">
          Youth FC Manager
        </h1>
        <p className="text-lg text-gray-600">
          유소년 축구 클럽 통합 관리 시스템
        </p>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <Link
            href="/login"
            className="rounded-xl border p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <h2 className="font-semibold text-lg">로그인</h2>
            <p className="text-sm text-gray-500 mt-1">시스템 접속</p>
          </Link>
          <Link
            href="/register"
            className="rounded-xl border p-6 hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <h2 className="font-semibold text-lg">회원가입</h2>
            <p className="text-sm text-gray-500 mt-1">새 계정 생성</p>
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-400 space-y-1">
          <p>역할별 페이지</p>
          <div className="flex gap-4 justify-center">
            {["admin", "manager", "coach", "parent"].map((role) => (
              <Link
                key={role}
                href={`/${role}`}
                className="text-gray-500 hover:text-blue-600 underline underline-offset-2"
              >
                {role}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
