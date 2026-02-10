"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Building2,
  HardHat,
  Calendar,
  Briefcase,
  History, // Trophy 대신 History 아이콘 추천
  AlertCircle,
} from "lucide-react";

// 데이터 정의
const EXPERIENCES = [
  {
    id: 1,
    company: "(주)미디어그룹 사람과숲",
    role: "IT 영업지원 ",
    period: "2022.10 - 2024.01",
    location: "서울시, 구로구",

    description:
      "배송 로봇 데이터 사업의 관리를 수행하였고, 이후 IT 영업지원으로 제안서를 작성해 NIA 국회 정보 개방 등 공공 사업을 수주하였습니다. 비즈니스와 기술의 연결 고리를 체득했습니다.",
    tags: ["Proposal & Bidding", "Project Management", "Business Cycle"],
    icon: Briefcase,
    color: "bg-orange-50 text-orange-600",
  },
  {
    id: 2,
    company: "영전엔지니어링 (삼성반도체 현장)",
    role: "전기공사",
    period: "2020.10 - 2022.02",
    location: "경기도, 평택시",
    description:
      "평택 삼성반도체 건설 현장에서 1년 만에 팀 리더로 승진했습니다. 복잡한 도면 해석과 현장의 오차 없는 시공 경험은 꼼꼼한 로직 설계와 책임감의 원천이 되었습니다.",
    tags: ["Leadership", "Safety First", "Ownership"],
    icon: HardHat,
    color: "bg-blue-50 text-blue-600",
  },
];

const OtherExperience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <section className=" py-0 pb-10 bg-resume-bg relative z-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="absolute h-full w-full inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none -z-10" />
        {/* 섹션 헤더 (요청하신 스타일 + 타이틀 변경) */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="mb-10 flex items-center gap-3"
        >
          <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
            <AlertCircle size={20} className="text-amber-600" />
          </div>
          <h2 className="text-1xl md:text-4xl font-bold text-resume-text-main flex items-baseline gap-2">
            Non-Engineering Career
            {/* 필요하다면 아래처럼 한글 부연 설명을 작게 넣을 수도 있습니다 */}
            <span className="text-sm font-normal text-slate-400 ml-1">
              비개발 직군 경력
            </span>
          </h2>
        </motion.div>

        {/* 리스트 그리드 */}
        <div className="grid grid-cols-1 gap-6">
          {EXPERIENCES.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { delay: index * 0.1, duration: 0.5 },
                },
              }}
              className="bg-white p-0 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row"
            >
              {/* 왼쪽: 회사 로고 및 정보 영역 */}
              <div className="p-6 md:w-64 shrink-0 flex flex-row md:flex-col items-center md:items-start gap-4 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50">
                <div
                  className={`p-3 rounded-xl ${exp.color} ring-1 ring-inset ring-black/5`}
                >
                  <exp.icon size={24} />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-bold text-resume-text-main text-base leading-tight mb-1 text-sm">
                    {exp.company}
                  </h3>
                  <div className="text-xs text-resume-text-sub flex flex-col gap-1">
                    <span className="flex items-center gap-1  md:justify-start">
                      <Calendar size={10} /> {exp.period}
                    </span>
                    <span className="flex items-center gap-1  md:justify-start">
                      <Building2 size={10} /> {exp.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* 오른쪽: 상세 내용 영역 (참고 이미지 스타일 반영) */}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-bold text-resume-text-main">
                    {exp.role}
                  </h4>
                  {/* 비개발 직군 뱃지 */}
                  <span className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded border border-slate-200">
                    <AlertCircle size={10} className="text-amber-600" /> Non-Dev
                    Role
                  </span>
                </div>

                {/* 설명 박스 (인프랩/GS홈쇼핑 이미지 스타일) */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-resume-text-main leading-relaxed mb-4">
                  {exp.description}
                </div>

                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-white text-resume-text-sub text-[11px] font-medium rounded border border-slate-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OtherExperience;
