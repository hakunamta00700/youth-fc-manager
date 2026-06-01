"use client";

import { useState, useRef } from "react";
import {
  Search,
  Send,
  Phone,
  CheckCheck,
  Check,
  ChevronLeft,
  User,
  Image,
  Paperclip,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface Coach {
  id: string;
  name: string;
  role: string;
  phone: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  text: string;
  time: string;
  sender: "me" | "coach";
  read: boolean;
  hasImage?: boolean;
}

const coaches: Coach[] = [
  {
    id: "1",
    name: "박코치",
    role: "담당 코치",
    phone: "010-5555-6666",
    lastMessage: "김민재 오늘 훈련 잘 참여했습니다.",
    lastMessageTime: "10:30",
    unread: 1,
    online: true,
  },
  {
    id: "2",
    name: "김대표",
    role: "클럽 대표",
    phone: "010-1111-2222",
    lastMessage: "네, 확인했습니다.",
    lastMessageTime: "어제",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    name: "박매니저",
    role: "매니저",
    phone: "010-3333-4444",
    lastMessage: "6월 회비 납부 안내드립니다.",
    lastMessageTime: "3일 전",
    unread: 0,
    online: false,
  },
];

const dummyMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      text: "안녕하세요, 김민재 어머님. 오늘 훈련 사진 보내드립니다.",
      time: "10:00",
      sender: "coach",
      read: true,
    },
    {
      id: "m2",
      text: "감사합니다! 오늘 훈련은 어땠나요?",
      time: "10:15",
      sender: "me",
      read: true,
    },
    {
      id: "m3",
      text: "드리블 연습 위주로 진행했는데, 많이 발전했어요.",
      time: "10:20",
      sender: "coach",
      read: true,
    },
    {
      id: "m4",
      text: "네, 오늘 훈련 잘 마쳤습니다.",
      time: "10:30",
      sender: "coach",
      read: false,
    },
  ],
  "2": [
    {
      id: "m5",
      text: "안녕하세요. 6월 대회 관련해서 문의드립니다.",
      time: "어제 14:00",
      sender: "me",
      read: true,
    },
    {
      id: "m6",
      text: "네, 확인했습니다. 곧 자세한 안내 드리겠습니다.",
      time: "어제 15:30",
      sender: "coach",
      read: true,
    },
  ],
};

export default function ParentMessagesPage() {
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Record<string, Message[]>>(
    dummyMessages
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredCoaches = coaches.filter(
    (c) =>
      c.name.includes(searchTerm) || c.role.includes(searchTerm)
  );

  const selectedCoach = coaches.find((c) => c.id === selectedCoachId);
  const chatMessages = selectedCoachId
    ? messages[selectedCoachId] || []
    : [];

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedCoachId) return;
    const msg: Message = {
      id: String(Date.now()),
      text: newMessage,
      time: new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "me",
      read: false,
    };
    setMessages((prev) => ({
      ...prev,
      [selectedCoachId]: [...(prev[selectedCoachId] || []), msg],
    }));
    setNewMessage("");
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedCoachId) {
      const msg: Message = {
        id: String(Date.now()),
        text: `[이미지] ${file.name}`,
        time: new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sender: "me",
        read: false,
        hasImage: true,
      };
      setMessages((prev) => ({
        ...prev,
        [selectedCoachId]: [...(prev[selectedCoachId] || []), msg],
      }));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">1:1 채팅</h2>
        <p className="mt-1 text-sm text-gray-500">
          담당 코치와 메시지를 주고받으세요
        </p>
      </div>

      <div className="flex h-[calc(100vh-14rem)] flex-col rounded-xl border border-gray-200 bg-white shadow-sm lg:flex-row">
        {/* Coach List */}
        <div
          className={cn(
            "flex flex-col border-gray-200 lg:w-72 lg:border-r",
            selectedCoachId ? "hidden lg:flex" : "flex"
          )}
        >
          {/* Search */}
          <div className="border-b border-gray-200 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="코치 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filteredCoaches.map((coach) => (
              <button
                key={coach.id}
                onClick={() => setSelectedCoachId(coach.id)}
                className={cn(
                  "flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors hover:bg-gray-50",
                  selectedCoachId === coach.id && "bg-blue-50"
                )}
              >
                <div className="relative flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {coach.name[0]}
                  </div>
                  {coach.online && (
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      {coach.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {coach.lastMessageTime}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">{coach.role}</p>
                  <p className="mt-0.5 truncate text-xs text-gray-400">
                    {coach.lastMessage}
                  </p>
                </div>
                {coach.unread > 0 && (
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    {coach.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={cn(
            "flex flex-1 flex-col",
            !selectedCoachId && "hidden lg:flex"
          )}
        >
          {selectedCoach ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
                <button
                  onClick={() => setSelectedCoachId(null)}
                  className="flex items-center justify-center rounded-lg p-1 text-gray-500 hover:bg-gray-100 lg:hidden"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {selectedCoach.name[0]}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900">
                    {selectedCoach.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {selectedCoach.role}
                  </div>
                </div>
                <a
                  href={`tel:${selectedCoach.phone}`}
                  className="flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                >
                  <Phone className="h-5 w-5" />
                </a>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                <div className="space-y-4">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.sender === "me" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                          msg.sender === "me"
                            ? "rounded-br-md bg-blue-600 text-white"
                            : "rounded-bl-md border border-gray-200 bg-white text-gray-800"
                        )}
                      >
                        {msg.hasImage ? (
                          <div className="flex items-center gap-2">
                            <Image className="h-4 w-4" />
                            <span className="text-xs">{msg.text}</span>
                          </div>
                        ) : (
                          <p>{msg.text}</p>
                        )}
                        <div
                          className={cn(
                            "mt-1 flex items-center justify-end gap-1 text-[10px]",
                            msg.sender === "me" ? "text-blue-200" : "text-gray-400"
                          )}
                        >
                          <span>{msg.time}</span>
                          {msg.sender === "me" &&
                            (msg.read ? (
                              <CheckCheck className="h-3 w-3" />
                            ) : (
                              <Check className="h-3 w-3" />
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleImageClick}
                    className="flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="메시지를 입력하세요..."
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="flex items-center justify-center rounded-xl bg-blue-600 p-2.5 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <User className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-3 text-sm font-medium text-gray-500">
                  코치를 선택하여
                  <br />
                  메시지를 보내세요
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
