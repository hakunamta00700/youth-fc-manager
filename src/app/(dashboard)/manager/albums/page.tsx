"use client";

import { useState } from "react";
import {
  Image,
  Plus,
  Upload,
  Trash2,
  Star,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

interface Album {
  id: string;
  title: string;
  coverImage: string;
  photoCount: number;
  createdAt: string;
  isFeatured: boolean;
}

const ALBUM_DATA: Album[] = [
  { id: "a1", title: "6월 정기 수업", coverImage: "", photoCount: 24, createdAt: "2026-06-15", isFeatured: true },
  { id: "a2", title: "어린이날 행사", coverImage: "", photoCount: 48, createdAt: "2026-05-05", isFeatured: true },
  { id: "a3", title: "5월 수업 스냅", coverImage: "", photoCount: 36, createdAt: "2026-05-30", isFeatured: false },
  { id: "a4", title: "대회 출전", coverImage: "", photoCount: 52, createdAt: "2026-04-20", isFeatured: false },
  { id: "a5", title: "봄학기 개강", coverImage: "", photoCount: 18, createdAt: "2026-03-02", isFeatured: false },
];

export default function AlbumsPage() {
  const [albums, setAlbums] = useState(ALBUM_DATA);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleCreateAlbum = () => {
    if (!newTitle.trim()) return;
    const newAlbum: Album = {
      id: `a${Date.now()}`,
      title: newTitle,
      coverImage: "",
      photoCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      isFeatured: false,
    };
    setAlbums((prev) => [newAlbum, ...prev]);
    setNewTitle("");
    setShowCreateModal(false);
    alert(`앨범 "${newTitle}"이(가) 생성되었습니다.`);
  };

  const toggleFeatured = (id: string) => {
    setAlbums((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isFeatured: !a.isFeatured } : a))
    );
  };

  const deleteAlbum = (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setAlbums((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">앨범 관리</h2>
          <p className="mt-1 text-sm text-gray-500">
            수업 및 행사 사진을 앨범으로 관리합니다
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gray-300 bg-white">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-l-lg p-2 transition-colors ${
                viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-r-lg p-2 transition-colors ${
                viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            새 앨범
          </button>
        </div>
      </div>

      {/* Albums */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {albums.map((album) => (
            <div
              key={album.id}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              {/* Cover / Placeholder */}
              <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                <Image className="h-12 w-12 text-gray-300" />
                <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
                  {album.photoCount}장
                </span>
                {album.isFeatured && (
                  <span className="absolute left-2 top-2 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-medium text-yellow-900">
                    대표
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 truncate">{album.title}</h3>
                <p className="mt-0.5 text-xs text-gray-400">{album.createdAt}</p>
              </div>

              {/* Actions */}
              <div className="absolute inset-x-0 bottom-0 flex translate-y-full justify-end gap-1 bg-white/90 p-2 backdrop-blur-sm transition-transform group-hover:translate-y-0">
                <button
                  onClick={() => alert(`사진 업로드: ${album.title}`)}
                  className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <Upload className="mr-1 inline-block h-3 w-3" />
                  업로드
                </button>
                <button
                  onClick={() => toggleFeatured(album.id)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                    album.isFeatured
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Star className={`mr-1 inline-block h-3 w-3 ${album.isFeatured ? "fill-current" : ""}`} />
                  {album.isFeatured ? "대표" : "표시"}
                </button>
                <button
                  onClick={() => deleteAlbum(album.id)}
                  className="rounded-lg bg-red-50 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                >
                  <Trash2 className="mr-1 inline-block h-3 w-3" />
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <div className="space-y-2">
            {albums.map((album) => (
              <div
                key={album.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                    <Image className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {album.title}
                      {album.isFeatured && (
                        <Badge variant="warning" className="ml-2">대표</Badge>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">{album.photoCount}장 · {album.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`사진 업로드: ${album.title}`)}
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    업로드
                  </button>
                  <button
                    onClick={() => deleteAlbum(album.id)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Create modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="새 앨범 만들기"
        size="sm"
        footer={
          <div className="flex gap-2">
            <button
              onClick={() => setShowCreateModal(false)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={handleCreateAlbum}
              disabled={!newTitle.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              생성
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">앨범 제목</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="앨범 제목을 입력하세요"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">커버 이미지</label>
            <div className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-blue-400 hover:bg-blue-50">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-1 text-sm text-gray-500">클릭하여 이미지 업로드</p>
                <p className="text-xs text-gray-400">PNG, JPG, WebP</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
