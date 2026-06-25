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

// 핸드오프 말풍선 — 작성→검토 연결부 위에 떠서 그 사이 장면을 영상으로 보여준다.
// 노드(동그라미)를 가리지 않도록 충분히 위로 띄우고, 꼬리는 두 노드 사이를 가리킨다.
function HandoffBubble({ src }: { src: string }) {
  return (
    <div className="pointer-events-none absolute bottom-[34px] left-1/2 z-20 w-[170px] -translate-x-1/2 lg:w-[200px]">
      <div className="overflow-hidden rounded-xl border border-[#e6ebf1] bg-white shadow-[0_12px_30px_-8px_rgba(10,37,64,0.28)]">
        <video src={src} autoPlay muted loop playsInline preload="metadata" aria-hidden className="aspect-video w-full object-cover" />
      </div>
      {/* 말풍선 꼬리 (아래 두 노드 사이를 가리킴) */}
      <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-[#e6ebf1] bg-white" />
    </div>
  );
}

// CEO(사람) 체크인 — 기획·검토 직후 연결선 위에 앰버 게이트 배지 + 점선 꼬리.
function CeoCheckpoint({ label }: { label: string }) {
  return (
    <div className="pointer-events-none absolute bottom-[8px] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center">
      <span className="whitespace-nowrap rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
        {label}
      </span>
      {/* 점선 꼬리 (연결 트랙으로 내려감) */}
      <span className="mt-px h-2.5 w-px border-l border-dashed border-amber-400" />
    </div>
  );
}

// 검토 → 작성 피드백 루프 — 연결선 아래 좌우대칭 점선 U자 화살표로 "반려 시 재작성"을 표현.
function HandoffLoopBack() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[10px] z-10 flex w-[140px] -translate-x-1/2 flex-col items-center">
      <svg width="80" height="22" viewBox="0 0 80 22" fill="none" className="overflow-visible">
        <defs>
          <marker id="loopback-arrow" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
            <path d="M0 0 L7 3.5 L0 7 Z" fill="#94a3b8" />
          </marker>
        </defs>
        {/* 검토(우) → 작성(좌)으로 되돌아가는 대칭 곡선 */}
        <path d="M72 4 C 72 20, 8 20, 8 4" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" fill="none" strokeLinecap="round" markerEnd="url(#loopback-arrow)" />
      </svg>
      <span className="mt-0.5 whitespace-nowrap text-[10px] font-semibold" style={{ color: SLATE }}>반려 시 재작성</span>
    </div>
  );
}

// 멀티에이전트 파이프라인 — 노드가 흐름선으로 이어지고 teal 빛이 흐르는 비주얼.
// 데스크탑: 가로 타임라인 / 모바일: 세로 타임라인.
export default function PipelineDiagram({ steps }: { steps: PipelineStep[] }) {
  const reduce = useReducedMotion();
  const resolve = (step: PipelineStep) => (step.agentIds ?? []).map((id) => AGENT_MAP[id]).filter(Boolean);
  const hasOverlay = steps.some((s) => s.handoffMedia || s.checkpoint);

  return (
    <div>
      {/* ── 데스크탑: 가로 타임라인 (말풍선·체크인 자리 위해 상단 여백) ── */}
      <div className={`hidden items-start md:flex ${hasOverlay ? "pt-32 lg:pt-36" : ""}`}>
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
                <div className="relative mt-6 w-12 shrink-0">
                  <div className="h-[3px] w-full overflow-hidden rounded-full" style={{ background: TRACK }}>
                    {!reduce && (
                      <motion.span
                        className="absolute inset-y-0 w-1/2 rounded-full"
                        style={{ background: `linear-gradient(90deg, transparent, ${BLURPLE}, transparent)` }}
                        animate={{ x: ["-130%", "260%"] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay: i * 0.18 }}
                      />
                    )}
                  </div>
                  {step.handoffMedia && <HandoffBubble src={step.handoffMedia} />}
                  {step.handoffMedia && <HandoffLoopBack />}
                  {step.checkpoint && <CeoCheckpoint label={step.checkpoint} />}
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
                {step.handoffMedia && (
                  <div className="mt-3 w-[220px] max-w-full">
                    <div className="overflow-hidden rounded-xl border border-[#e6ebf1] bg-white shadow-[0_8px_24px_-8px_rgba(10,37,64,0.22)]">
                      <video src={step.handoffMedia} autoPlay muted loop playsInline preload="metadata" aria-hidden className="aspect-video w-full object-cover" />
                    </div>
                    <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: SLATE }}>
                      <span style={{ color: "#94a3b8" }}>↺</span> 반려 시 재작성
                    </span>
                  </div>
                )}
                {step.checkpoint && (
                  <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                    {step.checkpoint}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
