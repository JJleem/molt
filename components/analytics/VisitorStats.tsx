"use client";

import React, { useEffect, useState } from "react";
import AnalyticsCard from "./AnalyticsCard";
import { Users, MousePointer2 } from "lucide-react";

export default function VisitorStats() {
  const [data, setData] = useState({ total: 0, today: 0, loading: true });

  useEffect(() => {
    async function getStats() {
      try {
        const res = await fetch("/api/analytics");
        const result = await res.json();
        setData({
          total: result.total || 0,
          today: result.today || 0,
          loading: false,
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
        setData((prev) => ({ ...prev, loading: false }));
      }
    }
    getStats();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      <AnalyticsCard
        label="Total Visitors"
        value={data.loading ? "..." : data.total.toLocaleString()}
        icon={Users}
        delay={0.1}
      />
      <AnalyticsCard
        label="Today's Visitors"
        value={data.loading ? "..." : data.today.toLocaleString()}
        icon={MousePointer2}
        delay={0.2}
        // 오늘 유입이 있으면 간단한 트렌드 표시 가능
        trend={data.today > 0 ? { value: 5, isUpward: true } : undefined}
      />
    </div>
  );
}
