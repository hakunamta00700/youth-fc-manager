"use client";

import { useState } from "react";
import {
  Bus,
  MapPin,
  Clock,
  Navigation,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface BusStop {
  id: string;
  name: string;
  estimatedTime: string;
  distance: string;
  isCurrent: boolean;
  completed: boolean;
}

interface VehicleInfo {
  id: string;
  routeName: string;
  driverName: string;
  driverPhone: string;
  plateNumber: string;
  currentLocation: string;
  status: "operating" | "stopped" | "finished";
  stops: BusStop[];
}

const vehicleData: VehicleInfo = {
  id: "v1",
  routeName: "A노선 (강남/서초)",
  driverName: "최기사",
  driverPhone: "010-7777-8888",
  plateNumber: "12가 3456",
  currentLocation: "서울시 강남구 역삼동",
  status: "operating",
  stops: [
    {
      id: "s1",
      name: "출발 (훈련장)",
      estimatedTime: "",
      distance: "",
      isCurrent: false,
      completed: true,
    },
    {
      id: "s2",
      name: "강남역 3번 출구",
      estimatedTime: "도착 예정",
      distance: "500m",
      isCurrent: true,
      completed: false,
    },
    {
      id: "s3",
      name: "역삼초등학교",
      estimatedTime: "12:10",
      distance: "1.2km",
      isCurrent: false,
      completed: false,
    },
    {
      id: "s4",
      name: "도곡동 주민센터",
      estimatedTime: "12:20",
      distance: "2.0km",
      isCurrent: false,
      completed: false,
    },
    {
      id: "s5",
      name: "대치동 은마아파트",
      estimatedTime: "12:30",
      distance: "2.8km",
      isCurrent: false,
      completed: false,
    },
  ],
};

export default function ParentVehiclePage() {
  const [expanded, setExpanded] = useState(true);
  const vehicle = vehicleData;

  const statusConfig = {
    operating: { label: "운행중", variant: "success" as const },
    stopped: { label: "정차", variant: "warning" as const },
    finished: { label: "운행종료", variant: "default" as const },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">차량 위치 조회</h2>
        <p className="mt-1 text-sm text-gray-500">
          통학 차량의 현재 위치와 도착 예정 시간을 확인하세요
        </p>
      </div>

      {/* Map Placeholder */}
      <div className="relative h-48 overflow-hidden rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 sm:h-64">
        {/* Placeholder map content */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[radial-gradient(circle_at_30%_50%,_white_0%,_transparent_50%),radial-gradient(circle_at_70%_30%,_white_0%,_transparent_50%),radial-gradient(circle_at_50%_70%,_white_0%,_transparent_50%)]" />
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Bus className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {vehicle.routeName}
              </p>
              <p className="text-xs text-gray-500">
                {vehicle.currentLocation}
              </p>
            </div>
          </div>
          <Badge variant={statusConfig[vehicle.status].variant} size="sm">
            {statusConfig[vehicle.status].label}
          </Badge>
        </div>
        {/* Map overlay instruction */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-xl bg-white/90 px-5 py-3 text-center shadow-lg">
            <Navigation className="mx-auto h-6 w-6 text-blue-500" />
            <p className="mt-1 text-sm font-medium text-gray-700">
              지도 영역
            </p>
            <p className="text-xs text-gray-400">
              실제 위치는 지도 API 연동 시 표시됩니다
            </p>
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <Card title="차량 정보">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">차량번호</p>
            <p className="mt-0.5 text-sm font-medium text-gray-900">
              {vehicle.plateNumber}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">기사님</p>
            <p className="mt-0.5 text-sm font-medium text-gray-900">
              {vehicle.driverName}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">연락처</p>
            <a
              href={`tel:${vehicle.driverPhone}`}
              className="mt-0.5 block text-sm font-medium text-blue-600"
            >
              {vehicle.driverPhone}
            </a>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">현재 위치</p>
            <p className="mt-0.5 text-sm font-medium text-gray-900">
              {vehicle.currentLocation}
            </p>
          </div>
        </div>
      </Card>

      {/* Route / Stops */}
      <Card title="정류장 및 도착 예정 시간">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[18px] top-3 bottom-3 w-0.5 bg-gray-200" />

          <div className="space-y-1">
            {vehicle.stops.map((stop, i) => (
              <div
                key={stop.id}
                className="relative flex items-start gap-4 py-2"
              >
                {/* Timeline dot */}
                <div
                  className={cn(
                    "relative z-10 mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2",
                    stop.completed
                      ? "border-green-500 bg-green-100"
                      : stop.isCurrent
                        ? "border-blue-500 bg-blue-100"
                        : "border-gray-300 bg-white"
                  )}
                >
                  {stop.completed ? (
                    <span className="text-xs font-bold text-green-600">
                      ✓
                    </span>
                  ) : stop.isCurrent ? (
                    <Bus className="h-4 w-4 text-blue-600" />
                  ) : (
                    <span className="text-xs font-bold text-gray-400">
                      {i + 1}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div
                  className={cn(
                    "flex-1 rounded-xl p-3",
                    stop.isCurrent
                      ? "border border-blue-200 bg-blue-50"
                      : "bg-gray-50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin
                        className={cn(
                          "h-4 w-4",
                          stop.isCurrent ? "text-blue-500" : "text-gray-400"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm font-medium",
                          stop.isCurrent ? "text-blue-700" : "text-gray-700"
                        )}
                      >
                        {stop.name}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        stop.isCurrent
                          ? "text-blue-600"
                          : stop.completed
                            ? "text-green-600"
                            : "text-gray-500"
                      )}
                    >
                      {stop.isCurrent
                        ? "도착 예정"
                        : stop.completed
                          ? "출발 완료"
                          : stop.estimatedTime}
                    </span>
                  </div>
                  {stop.distance && (
                    <p className="mt-0.5 pl-6 text-xs text-gray-400">
                      현재 위치에서 약 {stop.distance}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
