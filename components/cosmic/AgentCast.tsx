"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { agents } from "@/content/agents";
import type { Agent } from "@/content/types";

// 11명 캐스트 — 캐릭터 사진(있으면) + 이름·직책을 부서별로 보여준다.
// 사진이 없거나 깨지면 컬러 + 이니셜 원으로 폴백(placeholder처럼 의도적으로 보임).
function Avatar({ agent }: { agent: Agent }) {
  const [failed, setFailed] = useState(false);
  const showImg = agent.avatar && !failed;

  return (
    <span
      className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/70"
      style={{
        backgroundColor: showImg ? "transparent" : `${agent.color}33`,
        boxShadow: `0 0 0 1px ${agent.color}55`,
      }}
    >
      {showImg ? (
        <Image
          src={agent.avatar as string}
          alt={agent.name}
          fill
          sizes="48px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-base font-bold" style={{ color: agent.color }}>
          {agent.name.charAt(0)}
        </span>
      )}
    </span>
  );
}

const DEPTS = ["Research", "Creative", "Operations"] as const;

export default function AgentCast() {
  return (
    <div className="space-y-6">
      {DEPTS.map((dept) => {
        const members = agents.filter((a) => a.dept === dept);
        if (!members.length) return null;
        return (
          <div key={dept}>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-resume-text-sub">{dept}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 md:grid-cols-4">
              {members.map((agent, i) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <Avatar agent={agent} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-resume-text-main">{agent.name}</p>
                    <p className="truncate text-[11px] text-resume-text-sub">{agent.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
