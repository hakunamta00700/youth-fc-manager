"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  MessageSquare,
  Eye,
  Heart,
  Bell,
  Megaphone,
  MessageCircle,
  Pin,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

interface BoardPost {
  id: string;
  title: string;
  content: string;
  category: "notice" | "free" | "tip" | "suggestion";
  author: string;
  authorRole: string;
  date: string;
  views: number;
  comments: number;
  likes: number;
  pinned: boolean;
}

const initialPosts: BoardPost[] = [
  {
    id: "1",
    title: "6월 대회 일정 안내",
    content: "6월 15일(토)에 예정된 대회 일정을 공지드립니다. 참가하는 반은 필히 확인 바랍니다.",
    category: "notice",
    author: "매니저",
    authorRole: "관리자",
    date: "06-01",
    views: 45,
    comments: 3,
    likes: 5,
    pinned: true,
  },
  {
    id: "2",
    title: "오늘 수업 인증샷 📸",
    content: "유치부 A반 오늘 훈련 사진입니다. 다들 열심히 참여했어요!",
    category: "free",
    author: "박코치",
    authorRole: "코치",
    date: "05-30",
    views: 28,
    comments: 7,
    likes: 12,
    pinned: false,
  },
  {
    id: "3",
    title: "드리블 훈련 팁 공유",
    content: "유치부 아이들에게 효과적인 드리블 훈련 방법을 공유합니다. 원콘 드릴을 추천합니다.",
    category: "tip",
    author: "이코치",
    authorRole: "코치",
    date: "05-28",
    views: 33,
    comments: 5,
    likes: 8,
    pinned: false,
  },
  {
    id: "4",
    title: "비품 추가 요청 건의",
    content: "훈련용 콘이 부족합니다. 추가 구매 요청드립니다.",
    category: "suggestion",
    author: "최코치",
    authorRole: "코치",
    date: "05-25",
    views: 15,
    comments: 2,
    likes: 3,
    pinned: false,
  },
  {
    id: "5",
    title: "5월 월말 평가 안내",
    content: "5월 월말 평가는 5월 31일(화)에 진행됩니다. 참고 바랍니다.",
    category: "notice",
    author: "매니저",
    authorRole: "관리자",
    date: "05-20",
    views: 52,
    comments: 1,
    likes: 4,
    pinned: false,
  },
];

const categoryConfig = {
  notice: { label: "공지", color: "bg-red-100 text-red-700" },
  free: { label: "자유", color: "bg-blue-100 text-blue-700" },
  tip: { label: "팁", color: "bg-green-100 text-green-700" },
  suggestion: { label: "건의", color: "bg-amber-100 text-amber-700" },
};

export default function CoachBoardPage() {
  const [posts, setPosts] = useState<BoardPost[]>(initialPosts);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] =
    useState<BoardPost["category"]>("free");

  const categories = [
    { id: "all", label: "전체", count: posts.length },
    {
      id: "notice",
      label: "공지",
      count: posts.filter((p) => p.category === "notice").length,
    },
    {
      id: "free",
      label: "자유",
      count: posts.filter((p) => p.category === "free").length,
    },
    {
      id: "tip",
      label: "팁",
      count: posts.filter((p) => p.category === "tip").length,
    },
    {
      id: "suggestion",
      label: "건의",
      count: posts.filter((p) => p.category === "suggestion").length,
    },
  ];

  const filteredPosts = posts
    .filter(
      (p) =>
        (activeCategory === "all" || p.category === activeCategory) &&
        (p.title.includes(searchTerm) || p.content.includes(searchTerm))
    )
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return 0;
    });

  const handleWrite = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const post: BoardPost = {
      id: String(Date.now()),
      title: newTitle,
      content: newContent,
      category: newCategory,
      author: "박코치",
      authorRole: "코치",
      date: new Date().toISOString().slice(5, 10),
      views: 0,
      comments: 0,
      likes: 0,
      pinned: false,
    };
    setPosts((prev) => [post, ...prev]);
    setShowWriteModal(false);
    setNewTitle("");
    setNewContent("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">내부 게시판</h2>
          <p className="mt-1 text-sm text-gray-500">
            스태프와 소통하고 정보를 공유하세요
          </p>
        </div>
        <button
          onClick={() => setShowWriteModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          글쓰기
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
              activeCategory === cat.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {cat.label}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                activeCategory === cat.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              )}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="게시글 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Post List */}
      <div className="space-y-2">
        {filteredPosts.map((post) => {
          const cat = categoryConfig[post.category];
          return (
            <div
              key={post.id}
              className={cn(
                "rounded-xl border bg-white p-4 shadow-sm transition-all hover:border-gray-300",
                post.pinned && "border-blue-200 bg-blue-50/40"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {post.pinned && (
                      <Pin className="h-3.5 w-3.5 text-blue-500" />
                    )}
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium",
                        cat.color
                      )}
                    >
                      {cat.label}
                    </span>
                  </div>
                  <h4 className="mt-1 text-sm font-semibold text-gray-900 line-clamp-1">
                    {post.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                    {post.content}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-gray-400">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {post.views}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {post.comments}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" />
                  {post.likes}
                </span>
              </div>
            </div>
          );
        })}

        {filteredPosts.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <MessageCircle className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">
              게시글이 없습니다
            </p>
          </div>
        )}
      </div>

      {/* Write Modal */}
      <Modal
        isOpen={showWriteModal}
        onClose={() => setShowWriteModal(false)}
        title="게시글 작성"
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowWriteModal(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={handleWrite}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              등록
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              카테고리
            </label>
            <select
              value={newCategory}
              onChange={(e) =>
                setNewCategory(e.target.value as BoardPost["category"])
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="free">자유</option>
              <option value="notice">공지</option>
              <option value="tip">팁</option>
              <option value="suggestion">건의</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              제목
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              내용
            </label>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={6}
              placeholder="내용을 입력하세요"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
