"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Code2,
  Code,
  GraduationCap,
  BookOpen,
  HardHat,
  School,
} from "lucide-react";
import WormholeBackground from "@/ui/WormholeBackground";

const LOG_DATA = [
  {
    id: "EDU-2026",
    date: "2026.03 - Scheduled",
    title: "한양사이버대학교",
    subtitle: "컴퓨터공학과 (3학년 편입)",
    desc: "프론트엔드 실무를 넘어 컴퓨터 공학(CS) 기초를 탄탄히 다지기 위해 편입했습니다. 자료구조, 운영체제, 알고리즘 등 소프트웨어 엔지니어링의 본질적인 역량을 강화하고 있습니다.",
    tech: ["CS Theory", "Algorithm", "Architecture"],
    status: "STANDBY",
    icon: <GraduationCap className="w-5 h-5 text-indigo-500" />,
  },
  {
    id: "WORK-2025",
    date: "2025.01 - Current",
    title: "(주)캐리마",
    subtitle: "프론트엔드 개발자 (C-HUB V2.0)",
    desc: "산업용 3D 프린터 통합 관제 솔루션 'C-Hub'의 프론트엔드 전체 사이클(기획·디자인·개발)을 리딩하며 구축했습니다. 이기종 장비의 대량 센서 데이터를 웹소켓으로 실시간 연동하고 상태 동기화 지연율을 1초 미만으로 단축하여 GS인증 1등급 획득에 기여했습니다.",
    tech: ["React", "TypeScript", "Recoil", "WebSocket", "TanStack Query"],
    status: "ACTIVE",
    icon: <Code2 className="w-5 h-5 text-emerald-500" />,
  },
  {
    id: "WORK-2024",
    date: "2024.09 - 2025.01",
    title: "(주)미디어그룹 사람과숲",
    subtitle: "프론트엔드 개발자 (Golf Course Geofencing App)",
    desc: "골프장 내장객 위치 추적 및 지오펜싱 기반 자동 체크인 모바일 앱 POC를 개발했습니다. React Native 환경에서 Android 네이티브 모듈을 브릿지하여 정밀한 위치 데이터 파싱과 상태 관리를 구현했습니다.",
    tech: ["React Native", "TypeScript", "Android Native", "Recoil"],
    status: "STABLE",
    icon: <Code2 className="w-5 h-5 text-blue-500" />,
  },
  {
    id: "EDU-2024-07",
    date: "2024.07 - 2024.08",
    title: "서울형 뉴딜 일자리사업",
    subtitle: "모던 웹 풀스택 개발자 실무 프로젝트",
    desc: "기업 현장에 즉시 투입 가능한 실무형 인재 양성 과정입니다. React와 Node.js를 활용한 풀스택 프로젝트를 수행하며, 협업 툴(Jira, Git) 활용 및 애자일 프로세스를 경험했습니다.",
    tech: ["React", "Node.js", "Agile", "Jira"],
    status: "DONE",
    icon: <BookOpen className="w-5 h-5 text-slate-600" />,
  },
  {
    id: "EDU-2023",
    date: "2023.12 - 2024.06",
    title: "이젠아카데미DX교육센터",
    subtitle: "스마트 웹콘텐츠 UI/UX 퍼블리셔 & 프론트엔드",
    desc: "웹 표준과 접근성을 준수하는 UI/UX 퍼블리싱부터 JavaScript/React 프론트엔드 코어 기술까지, 개발자로서 필요한 전반적인 베이스를 6개월간 집중적으로 학습했습니다.",
    tech: ["HTML/CSS", "JavaScript", "React", "UI/UX"],
    status: "DONE",
    icon: <BookOpen className="w-5 h-5 text-slate-600" />,
  },
  {
    id: "WORK-2022",
    date: "2022.10 - 2024.01",
    title: "(주)미디어그룹 사람과숲",
    subtitle: "IT 영업지원 & 프로젝트 관리",
    desc: "배송 로봇 데이터 사업의 관리를 수행하였고, 이후 IT 영업지원으로 제안서를 작성해 NIA 국회 정보 개방 등 공공 사업을 수주하였습니다. 이 경험을 통해 비즈니스 요구사항과 기술의 연결 고리를 깊이 체득했습니다.",
    tech: ["Project Management", "Bidding", "Business Cycle"],
    status: "DONE",
    icon: <Briefcase className="w-5 h-5 text-orange-500" />,
  },
  {
    id: "WORK-2020",
    date: "2020.10 - 2022.02",
    title: "영전엔지니어링",
    subtitle: "삼성반도체 현장 전기공사 (팀 리더)",
    desc: "평택 삼성반도체 건설 현장에서 1년 만에 팀 리더로 승진했습니다. 복잡한 도면 해석과 현장의 오차 없는 시공 경험은 현재 개발자로서 꼼꼼한 로직 설계와 강한 책임감의 든든한 원천이 되었습니다.",
    tech: ["Leadership", "Safety First", "Ownership"],
    status: "DONE",
    icon: <HardHat className="w-5 h-5 text-amber-600" />,
  },
  {
    id: "EDU-2017",
    date: "2017.03 - 2021.02",
    title: "인천폴리텍대학교",
    subtitle: "정보통신학과 (졸업)",
    desc: "네트워크, 통신 프로토콜에 대한 기초 이해를 쌓았습니다. 하드웨어와 소프트웨어의 연결 구조를 이해하는 데 큰 도움이 되었습니다.",
    tech: ["Network", "Communication", "Hardware"],
    status: "DONE",
    icon: <GraduationCap className="w-5 h-5 text-slate-500" />,
  },
  {
    id: "EDU-2014",
    date: "2014.03 - 2017.02",
    title: "신도림고등학교",
    subtitle: "인문계 (졸업)",
    desc: "성실하게 교과 과정을 이수하며 졸업했습니다.",
    tech: ["High School"],
    status: "DONE",
    icon: <School className="w-5 h-5 text-slate-400" />,
  },
];

const SystemTimeline = () => {
  return (
    <div className="relative min-h-screen bg-resume-bg w-full flex flex-col items-center text-resume-text-main p-6 md:p-12  overflow-hidden">
      {/* 타임라인 전체 컨테이너 */}
      <WormholeBackground />

      <div className="relative z-10 flex flex-col items-center text-resume-text-main p-0 md:p-12 w-full">
        <div className="w-full max-w-5xl relative pb-20 flex flex-col gap-6">
          {/* 중앙선 (데스크탑: 중앙, 모바일: 왼쪽) */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 transform md:-translate-x-1/2"></div>

          {LOG_DATA.map((item, index) => {
            // 짝수/홀수 판별 (인덱스 기준)
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={item.id}
                // 애니메이션: 짝수는 왼쪽에서, 홀수는 오른쪽에서 등장
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center  w-full 
                ${isEven ? "md:flex-row-reverse" : ""} 
              `}
              >
                {/* 데스크탑에서 50% 너비를 차지하는 빈 공간 (중앙 정렬을 위해 필요) */}
                <div className="hidden md:block w-1/2" />

                {/* 중앙 점 (Timeline Dot) */}
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-white shadow-sm z-20 flex-shrink-0 flex justify-center items-center">
                  {/* 모바일이나 데스크탑 상태에 따라 점 색상 변경 가능 */}
                  <div className="w-[70%] h-[70%] rounded-full bg-resume-accent-purple relative">
                    <p className="absolute -top-5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit whitespace-nowrap text-[10px] text-white  bg-resume-secondary px-1 py-0.5 rounded-sm">
                      {item.date.split(" - ")[0]}
                    </p>
                  </div>
                </div>

                {/* 카드 영역 */}
                <div
                  className={`w-full pl-16 md:pl-0 md:w-1/2 
                ${isEven ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"}
              `}
                >
                  <div className="group bg-resume-card p-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-resume-primary/20 relative flex flex-col gap-3">
                    {/* 카드 내부 헤더 (날짜 & 상태) */}
                    <div
                      className={`flex flex-col gap-2  
                    ${isEven ? "md:flex-row-reverse md:justify-between" : "md:flex-row md:justify-between"}
                  `}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-bold text-resume-primary bg-resume-badge-bg px-3 py-1 rounded-full">
                          {item.date}
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-2 text-[9px] font-medium text-slate-400 bg-slate-50 px-1 rounded-md w-fit
                       ${isEven ? "ml-auto md:ml-0" : ""}
                    `}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            item.status === "ACTIVE" || item.status === "STABLE"
                              ? "bg-emerald-400 animate-pulse"
                              : "bg-yellow-400"
                          }`}
                        />
                        {item.status}
                      </div>
                    </div>

                    {/* 제목 및 부제 */}
                    <h3
                      className={`text-[14px] font-bold text-slate-800 flex items-center gap-2  
                    ${isEven ? "md:flex-row-reverse" : ""}
                  `}
                    >
                      {/* 여기에 아이콘 렌더링 코드 복구 */}
                      {item.icon}
                      {item.title}
                    </h3>
                    <p className="text-[12px] text-resume-secondary font-medium ">
                      {item.subtitle}
                    </p>

                    {/* 설명글 (줄바꿈 처리 적용됨) */}
                    <p className="text-slate-600 text-[11px] leading-relaxed  break-words whitespace-normal">
                      {item.desc}
                    </p>

                    {/* 기술 스택 */}
                    <div
                      className={`flex flex-wrap gap-2 
                    ${isEven ? "md:justify-end" : "md:justify-start"}
                  `}
                    >
                      {item.tech.map((t) => (
                        <span
                          key={t}
                          className="text-[9px] font-semibold text-resume-badge-text bg-resume-badge-bg px-1 py-1 rounded-lg"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SystemTimeline;
