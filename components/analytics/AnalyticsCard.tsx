"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

// 1. Props 인터페이스 정의 (any 제거)
interface AnalyticsCardProps {
  label: string;
  value: string | number;
  // 증감률 데이터 (선택 사항)
  trend?: {
    value: number;
    isUpward: boolean;
  };
  icon: LucideIcon;
  delay?: number;
}

const AnalyticsCard = ({
  label,
  value,
  trend,
  icon: Icon,
  delay = 0,
}: AnalyticsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:shadow-md transition-all duration-300"
    >
      <div className="flex justify-between items-start">
        {/* 아이콘 영역 */}
        <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100/50">
          <Icon size={20} />
        </div>

        {/* 증감률 배지 (데이터가 있을 때만 렌더링) */}
        {trend && (
          <div
            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${
              trend.isUpward
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            {trend.isUpward ? (
              <TrendingUp size={12} />
            ) : (
              <TrendingDown size={12} />
            )}
            {trend.value}%
          </div>
        )}
      </div>

      {/* 텍스트 정보 영역 */}
      <div>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">
          {label}
        </p>
        <h4 className="text-2xl font-bold text-slate-900 tracking-tight">
          {value}
        </h4>
      </div>
    </motion.div>
  );
};

export default AnalyticsCard;
