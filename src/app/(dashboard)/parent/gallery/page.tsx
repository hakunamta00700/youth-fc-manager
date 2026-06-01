"use client";

import { useState } from "react";
import { Download, Image as ImageIcon, Filter, Search, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface GalleryAlbum {
  id: string;
  title: string;
  date: string;
  photoCount: number;
  color: string;
  tagged: boolean;
}

const albums: GalleryAlbum[] = [
  {
    id: "1",
    title: "5월 수업 사진",
    date: "2026-05-30",
    photoCount: 24,
    color: "linear-gradient(135deg, #667eea, #764ba2)",
    tagged: true,
  },
  {
    id: "2",
    title: "대회 사진",
    date: "2026-05-15",
    photoCount: 36,
    color: "linear-gradient(135deg, #f093fb, #f5576c)",
    tagged: true,
  },
  {
    id: "3",
    title: "훈련 모습",
    date: "2026-05-10",
    photoCount: 18,
    color: "linear-gradient(135deg, #4facfe, #00f2fe)",
    tagged: false,
  },
  {
    id: "4",
    title: "간식 제공",
    date: "2026-05-08",
    photoCount: 12,
    color: "linear-gradient(135deg, #43e97b, #38f9d7)",
    tagged: true,
  },
  {
    id: "5",
    title: "체육대회",
    date: "2026-04-25",
    photoCount: 30,
    color: "linear-gradient(135deg, #fa709a, #fee140)",
    tagged: false,
  },
  {
    id: "6",
    title: "4월 일상",
    date: "2026-04-15",
    photoCount: 20,
    color: "linear-gradient(135deg, #a18cd1, #fbc2eb)",
    tagged: true,
  },
];

export default function ParentGalleryPage() {
  const [showTaggedOnly, setShowTaggedOnly] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAlbums = albums.filter((album) => {
    if (showTaggedOnly && !album.tagged) return false;
    if (searchTerm && !album.title.includes(searchTerm)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">훈련 갤러리</h2>
        <p className="mt-1 text-sm text-gray-500">
          아이들의 훈련 사진을 확인하세요
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="앨범 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <button
          onClick={() => setShowTaggedOnly(!showTaggedOnly)}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
            showTaggedOnly
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Filter className="h-4 w-4" />
          {showTaggedOnly ? (
            <>
              <Check className="h-3.5 w-3.5" />
              내 자녀 사진만
            </>
          ) : (
            "전체 앨범"
          )}
        </button>
      </div>

      {/* Album Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {filteredAlbums.map((album) => (
          <Card key={album.id} hoverable className="overflow-hidden p-0">
            <div
              className="flex h-36 items-center justify-center"
              style={{ background: album.color }}
            >
              <div className="flex flex-col items-center gap-1 text-white">
                <ImageIcon className="h-8 w-8 opacity-70" />
                <span className="text-xs font-medium opacity-80">
                  {album.photoCount}장
                </span>
              </div>
            </div>
            <div className="px-3 pb-3 pt-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {album.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">{album.date}</p>
                </div>
                <div className="flex items-center gap-1">
                  {album.tagged && (
                    <Badge variant="info" size="sm">
                      태그됨
                    </Badge>
                  )}
                  <button className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredAlbums.length === 0 && (
        <div className="py-12 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">앨범이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
