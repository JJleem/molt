"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { agents } from "@/content/agents";
import type { Agent, PipelineStep } from "@/content/types";

const INK = "#0a2540";
const SLATE = "#425466";
const BLURPLE = "#0d9488";
const TRACK = "#e6ebf1";

const AGENT_MAP: Record<string, Agent> = Object.fromEntries(agents.map((a) => [a.id, a]));

// 캐릭터 아바타 — 사진 있으면 사진, 없으면 컬러 + 이니셜 폴백. 이름은 옆에 텍스트로 뜨므로 alt는 비움.
function Avatar({ agent, size = 20 }: { agent: Agent; size?: number }) {
  const [failed, setFailed] = useState(false);
  const showImg = agent.avatar && !failed;
  return (
    <span
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full"
      style={{
        width: size, height: size,
        backgroundColor: showImg ? "#0b1220" : `${agent.color}33`,
        boxShadow: `0 0 0 1.5px ${agent.color}66`,
      }}
    >
      {showImg ? (
        <Image src={agent.avatar as string} alt="" fill sizes="28px" className="object-cover" onError={() => setFailed(true)} />
      ) : (
        <span className="font-bold" style={{ color: agent.color, fontSize: size * 0.42 }}>{agent.name.charAt(0)}</span>
      )}
    </span>
  );
}

// 단계 노드 — teal 그라데이션 원 + 번호 + 부드러운 글로우.
function NodeCircle({ n }: { n: number }) {
  return (
    <span
      className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[15px] font-bold text-white"
      style={{ background: `linear-gradient(135deg, ${BLURPLE}, #0891b2)`, boxShadow: `0 8px 18px -6px ${BLURPLE}aa` }}
    >
      {n}
    </span>
  );
}

function AgentChips({ members, center }: { members: Agent[]; center?: boolean }) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${center ? "justify-center" : ""}`}>
      {members.map((agent) => (
        <span key={agent.id} className="inline-flex items-center gap-1.5 rounded-full border border-[#e6ebf1] bg-[#f6f9fc] py-1 pl-1 pr-2.5">
          <Avatar agent={agent} />
          <span className="text-[12px] font-bold leading-none" style={{ color: INK }}>{agent.name}</span>
        </span>
      ))}
    </div>
  );
}

// 멀티에이전트 파이프라인 — 노드가 흐름선으로 이어지고 teal 빛이 흐르는 비주얼.
// 데스크탑: 가로 타임라인 / 모바일: 세로 타임라인.
export default function PipelineDiagram({ steps }: { steps: PipelineStep[] }) {
  const reduce = useReducedMotion();
  const resolve = (step: PipelineStep) => (step.agentIds ?? []).map((id) => AGENT_MAP[id]).filter(Boolean);

  return (
    <div>
      {/* ── 데스크탑: 가로 타임라인 ── */}
      <div className="hidden items-start md:flex">
        {steps.map((step, i) => {
          const members = resolve(step);
          return (
            <React.Fragment key={step.id}>
              <motion.div
                className="flex flex-1 flex-col items-center px-2 text-center"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.4, delay: reduce ? 0 : i * 0.1 }}
              >
                <NodeCircle n={i + 1} />
                <p className="mt-3 text-[14px] font-bold leading-tight tracking-tight break-keep" style={{ color: INK }}>{step.desc}</p>
                <div className="mt-2.5">
                  {members.length > 0 ? <AgentChips members={members} center /> : <span className="text-[13px] font-bold" style={{ color: INK }}>{step.label}</span>}
                </div>
              </motion.div>

              {i < steps.length - 1 && (
                <div className="relative mt-6 h-[3px] w-12 shrink-0 overflow-hidden rounded-full" style={{ background: TRACK }}>
                  {!reduce && (
                    <motion.span
                      className="absolute inset-y-0 w-1/2 rounded-full"
                      style={{ background: `linear-gradient(90deg, transparent, ${BLURPLE}, transparent)` }}
                      animate={{ x: ["-130%", "260%"] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay: i * 0.18 }}
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── 모바일: 세로 타임라인 ── */}
      <div className="md:hidden">
        {steps.map((step, i) => {
          const members = resolve(step);
          const last = i === steps.length - 1;
          return (
            <motion.div
              key={step.id}
              className="flex gap-4"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.4, delay: reduce ? 0 : i * 0.06 }}
            >
              <div className="flex flex-col items-center">
                <NodeCircle n={i + 1} />
                {!last && (
                  <div className="relative my-1 w-[3px] flex-1 overflow-hidden rounded-full" style={{ background: TRACK, minHeight: 24 }}>
                    {!reduce && (
                      <motion.span
                        className="absolute inset-x-0 h-1/2 rounded-full"
                        style={{ background: `linear-gradient(180deg, transparent, ${BLURPLE}, transparent)` }}
                        animate={{ y: ["-130%", "260%"] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay: i * 0.18 }}
                      />
                    )}
                  </div>
                )}
              </div>
              <div className={last ? "pt-1.5" : "pb-7 pt-1.5"}>
                <p className="text-[15px] font-bold leading-tight tracking-tight break-keep" style={{ color: INK }}>{step.desc}</p>
                <div className="mt-2.5">
                  {members.length > 0 ? <AgentChips members={members} /> : <span className="text-[13px] font-bold" style={{ color: INK }}>{step.label}</span>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
