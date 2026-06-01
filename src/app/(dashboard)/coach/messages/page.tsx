"use client";

import { useState } from "react";
import {
  Search,
  Send,
  Phone,
  CheckCheck,
  Check,
  ChevronLeft,
  User,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface Parent {
  id: string;
  name: string;
  studentName: string;
  studentClass: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  text: string;
  time: string;
  sender: "me" | "parent";
  read: boolean;
}

const parents: Parent[] = [
  {
    id: "1",
    name: "김수현",
    studentName: "김민재",
    studentClass: "유치부 A",
    lastMessage: "네, 오늘 훈련 잘 마쳤습니다.",
    lastMessageTime: "10:30",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "최미영",
    studentName: "최유진",
    studentClass: "유치부 A",
    lastMessage: "감사합니다! 연습 영상도 보내주세요.",
    lastMessageTime: "어제",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    name: "박지원",
    studentName: "박서준",
    studentClass: "유치부 A",
    lastMessage: "오늘 지각할 것 같아요.",
    lastMessageTime: "09:15",
    unread: 0,
    online: false,
  },
  {
    id: "4",
    name: "정수진",
    studentName: "정예린",
    studentClass: "유치부 A",
    lastMessage: "예린이가 오늘 열이 있어서 결석할게요.",
    lastMessageTime: "08:00",
    unread: 1,
    online: false,
  },
  {
    id: "5",
    name: "홍민수",
    studentName: "홍지우",
    studentClass: "유치부 A",
    lastMessage: "네 알겠습니다.",
    lastMessageTime: "어제",
    unread: 0,
    online: true,
  },
];

const dummyMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      text: "안녕하세요, 김민재 어머님. 오늘 훈련 사진 보내드립니다.",
      time: "10:00",
      sender: "me",
      read: true,
    },
    {
      id: "m2",
      text: "감사합니다! 오늘 훈련은 어땠나요?",
      time: "10:15",
      sender: "parent",
      read: true,
    },
    {
      id: "m3",
      text: "드리블 연습 위주로 진행했는데, 많이 발전했어요.",
      time: "10:20",
      sender: "me",
      read: true,
    },
    {
      id: "m4",
      text: "네, 오늘 훈련 잘 마쳤습니다.",
      time: "10:30",
      sender: "me",
      read: true,
    },
  ],
  "2": [
    {
      id: "m5",
      text: "최유진 어머님, 오늘 평가 결과 공유드립니다.",
      time: "어제 15:00",
      sender: "me",
      read: true,
    },
    {
      id: "m6",
      text: "감사합니다! 연습 영상도 보내주세요.",
      time: "어제 15:30",
      sender: "parent",
      read: true,
    },
  ],
};

export default function CoachMessagesPage() {
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Record<string, Message[]>>(
    dummyMessages
  );

  const filteredParents = parents.filter(
    (p) =>
      p.name.includes(searchTerm) ||
      p.studentName.includes(searchTerm)
  );

  const selectedParent = parents.find(
    (p) => p.id === selectedParentId
  );
  const messages = selectedParentId
    ? chatMessages[selectedParentId] || []
    : [];

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedParentId) return;
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
    setChatMessages((prev) => ({
      ...prev,
      [selectedParentId]: [...(prev[selectedParentId] || []), msg],
    }));
    setNewMessage("");
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col rounded-xl border border-gray-200 bg-white shadow-sm lg:flex-row">
      {/* Parent List - Mobile: overlay when chat selected */}
      <div
        className={cn(
          "flex flex-col border-gray-200 lg:w-80 lg:border-r",
          selectedParentId ? "hidden lg:flex" : "flex"
        )}
      >
        {/* Search */}
        <div className="border-b border-gray-200 p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="학부모 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filteredParents.map((parent) => (
            <button
              key={parent.id}
              onClick={() => setSelectedParentId(parent.id)}
              className={cn(
                "flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors hover:bg-gray-50",
                selectedParentId === parent.id && "bg-blue-50"
              )}
            >
              <div className="relative flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {parent.name[0]}
                </div>
                {parent.online && (
                  <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    {parent.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {parent.lastMessageTime}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-gray-500 truncate">
                  {parent.studentName} · {parent.studentClass}
                </p>
                <p className="mt-0.5 text-xs text-gray-400 truncate">
                  {parent.lastMessage}
                </p>
              </div>
              {parent.unread > 0 && (
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {parent.unread}
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
          !selectedParentId && "hidden lg:flex"
        )}
      >
        {selectedParent ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
              <button
                onClick={() => setSelectedParentId(null)}
                className="flex items-center justify-center rounded-lg p-1 text-gray-500 hover:bg-gray-100 lg:hidden"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {selectedParent.name[0]}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">
                  {selectedParent.name}
                </div>
                <div className="text-xs text-gray-500">
                  {selectedParent.studentName} · {selectedParent.studentClass}
                </div>
              </div>
              <a
                href="#"
                className="flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.sender === "me"
                        ? "justify-end"
                        : "justify-start"
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
                      <p>{msg.text}</p>
                      <div
                        className={cn(
                          "mt-1 flex items-center justify-end gap-1 text-[10px]",
                          msg.sender === "me"
                            ? "text-blue-200"
                            : "text-gray-400"
                        )}
                      >
                        <span>{msg.time}</span>
                        {msg.sender === "me" && (
                          msg.read ? (
                            <CheckCheck className="h-3 w-3" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-3">
              <div className="flex items-center gap-2">
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
                학부모를 선택하여<br />메시지를 보내세요
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
