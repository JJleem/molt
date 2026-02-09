"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Code2, Code, GraduationCap } from "lucide-react";
import WormholeBackground from "@/ui/WormholeBackground";

const LOG_DATA = [
  {
    id: "EDU-2026",
    date: "2026.03 - Scheduled",
    title: "ddㅇㅇ",
    subtitle: "ddd",
    desc: "adsdasddddffafasf af fa fa가나다라마바아사자차타파ㅏㅎ *Pretendard(프리텐다드)**는 SIL Open Font License를 따르는 오픈소스 폰트라서, 개인/상업적 용도로 자유롭게 사용 가능합니다. 다른 사람 포트폴리오에서 가져온 파일이라도 폰트 자체가 프리텐다드라면 저작권 문제는 없습니다.하지만, 가져오신 코드와 방식은 수정이 필요합니다. 보여주신 코드(url(/_next/static/media/...))는 Next.js가 빌드(Build)할 때 자동으로 생성한 임시 경로입니다. 이걸 그대로 복사해서 쓰면 나중에 폰트가 깨지거나 연결이 끊깁니다.다운로드하신 .woff2 파일(아마도 가변 폰트 파일인 것 같습니다)을 활용해 **Next.js의 최적화 기능(next/font/local)**으로 제대로 적용하는 법을 알려드릴게요. dasdasdsadsadsadadada dasdsadad",
    tech: ["CS Theory", "Algorithm", "Architecture"],
    status: "STANDBY",
    icon: <Code2 className="w-5 h-5 text-resume-primary" />,
  },
  {
    id: "PJ-2025",
    date: "2025.01 - Running",
    title: "ddd",
    subtitle: "ddd",
    desc: "adsdasddddffafasf af fa fa가나다라마바아사자차타파ㅏㅎ *Pretendard(프리텐다드)**는 SIL Open Font License를 따르는 오픈소스 폰트라서, 개인/상업적 용도로 자유롭게 사용 가능합니다. 다른 사람 포트폴리오에서 가져온 파일이라도 폰트 자체가 프리텐다드라면 저작권 문제는 없습니다.하지만, 가져오신 코드와 방식은 수정이 필요합니다. 보여주신 코드(url(/_next/static/media/...))는 Next.js가 빌드(Build)할 때 자동으로 생성한 임시 경로입니다. 이걸 그대로 복사해서 쓰면 나중에 폰트가 깨지거나 연결이 끊깁니다.다운로드하신 .woff2 파일(아마도 가변 폰트 파일인 것 같습니다)을 활용해 **Next.js의 최적화 기능(next/font/local)**으로 제대로 적용하는 법을 알려드릴게요. dasdasdsadsadsadadada dasdsadad",
    tech: ["Next.js", "Django", "PostgreSQL"],
    status: "ACTIVE",
    icon: <Code2 className="w-5 h-5 text-resume-primary" />,
  },
  {
    id: "JOB-2024",
    date: "2024.04 - Active",
    title: "ddd",
    subtitle: "ddd",
    desc: "adsdasddddffafasf af fa fa가나다라마바아사자차타파ㅏㅎ *Pretendard(프리텐다드)**는 SIL Open Font License를 따르는 오픈소스 폰트라서, 개인/상업적 용도로 자유롭게 사용 가능합니다. 다른 사람 포트폴리오에서 가져온 파일이라도 폰트 자체가 프리텐다드라면 저작권 문제는 없습니다.하지만, 가져오신 코드와 방식은 수정이 필요합니다. 보여주신 코드(url(/_next/static/media/...))는 Next.js가 빌드(Build)할 때 자동으로 생성한 임시 경로입니다. 이걸 그대로 복사해서 쓰면 나중에 폰트가 깨지거나 연결이 끊깁니다.다운로드하신 .woff2 파일(아마도 가변 폰트 파일인 것 같습니다)을 활용해 **Next.js의 최적화 기능(next/font/local)**으로 제대로 적용하는 법을 알려드릴게요. dasdasdsadsadsadadada dasdsadad",
    tech: ["React", "WebSocket", "Three.js"],
    status: "STABLE",
    icon: <Briefcase className="w-5 h-5 text-emerald-500" />,
  },
  {
    id: "J3",
    date: "2023.01 - 2024.03",
    title: "Previous Experience",
    subtitle: "Frontend Developer",
    desc: "adsdasddddffafasf af fa fa가나다라마바아사자차타파ㅏㅎ *Pretendard(프리텐다드)**는 SIL Open Font License를 따르는 오픈소스 폰트라서, 개인/상업적 용도로 자유롭게 사용 가능합니다. 다른 사람 포트폴리오에서 가져온 파일이라도 폰트 자체가 프리텐다드라면 저작권 문제는 없습니다.하지만, 가져오신 코드와 방식은 수정이 필요합니다. 보여주신 코드(url(/_next/static/media/...))는 Next.js가 빌드(Build)할 때 자동으로 생성한 임시 경로입니다. 이걸 그대로 복사해서 쓰면 나중에 폰트가 깨지거나 연결이 끊깁니다.다운로드하신 .woff2 파일(아마도 가변 폰트 파일인 것 같습니다)을 활용해 **Next.js의 최적화 기능(next/font/local)**으로 제대로 적용하는 법을 알려드릴게요. dasdasdsadsadsadadada dasdsadad",
    tech: ["Vue.js", "JavaScript", "SCSS"],
    status: "DONE",
    icon: <Briefcase className="w-5 h-5 text-slate-500" />,
  },
  {
    id: "J4",
    date: "2023.01 - 2024.03",
    title: "Previous Experience",
    subtitle: "Frontend Developer",
    desc: "adsdasddddffafasf af fa fa가나다라마바아사자차타파ㅏㅎ *Pretendard(프리텐다드)**는 SIL Open Font License를 따르는 오픈소스 폰트라서, 개인/상업적 용도로 자유롭게 사용 가능합니다. 다른 사람 포트폴리오에서 가져온 파일이라도 폰트 자체가 프리텐다드라면 저작권 문제는 없습니다.하지만, 가져오신 코드와 방식은 수정이 필요합니다. 보여주신 코드(url(/_next/static/media/...))는 Next.js가 빌드(Build)할 때 자동으로 생성한 임시 경로입니다. 이걸 그대로 복사해서 쓰면 나중에 폰트가 깨지거나 연결이 끊깁니다.다운로드하신 .woff2 파일(아마도 가변 폰트 파일인 것 같습니다)을 활용해 **Next.js의 최적화 기능(next/font/local)**으로 제대로 적용하는 법을 알려드릴게요. dasdasdsadsadsadadada dasdsadad",
    tech: ["Vue.js", "JavaScript", "SCSS"],
    status: "DONE",
    icon: <Briefcase className="w-5 h-5 text-slate-500" />,
  },
  {
    id: "J7",
    date: "2023.01 - 2024.03",
    title: "Previous Experience",
    subtitle: "Frontend Developer",
    desc: "adsdasddddffafasf af fa fa가나다라마바아사자차타파ㅏㅎ *Pretendard(프리텐다드)**는 SIL Open Font License를 따르는 오픈소스 폰트라서, 개인/상업적 용도로 자유롭게 사용 가능합니다. 다른 사람 포트폴리오에서 가져온 파일이라도 폰트 자체가 프리텐다드라면 저작권 문제는 없습니다.하지만, 가져오신 코드와 방식은 수정이 필요합니다. 보여주신 코드(url(/_next/static/media/...))는 Next.js가 빌드(Build)할 때 자동으로 생성한 임시 경로입니다. 이걸 그대로 복사해서 쓰면 나중에 폰트가 깨지거나 연결이 끊깁니다.다운로드하신 .woff2 파일(아마도 가변 폰트 파일인 것 같습니다)을 활용해 **Next.js의 최적화 기능(next/font/local)**으로 제대로 적용하는 법을 알려드릴게요. dasdasdsadsadsadadada dasdsadad",
    tech: ["Vue.js", "JavaScript", "SCSS"],
    status: "DONE",
    icon: <Briefcase className="w-5 h-5 text-slate-500" />,
  },
  {
    id: "J9",
    date: "2023.01 - 2024.03",
    title: "Previous Experience",
    subtitle: "Frontend Developer",
    desc: "adsdasddddffafasf af fa fa가나다라마바아사자차타파ㅏㅎ *Pretendard(프리텐다드)**는 SIL Open Font License를 따르는 오픈소스 폰트라서, 개인/상업적 용도로 자유롭게 사용 가능합니다. 다른 사람 포트폴리오에서 가져온 파일이라도 폰트 자체가 프리텐다드라면 저작권 문제는 없습니다.하지만, 가져오신 코드와 방식은 수정이 필요합니다. 보여주신 코드(url(/_next/static/media/...))는 Next.js가 빌드(Build)할 때 자동으로 생성한 임시 경로입니다. 이걸 그대로 복사해서 쓰면 나중에 폰트가 깨지거나 연결이 끊깁니다.다운로드하신 .woff2 파일(아마도 가변 폰트 파일인 것 같습니다)을 활용해 **Next.js의 최적화 기능(next/font/local)**으로 제대로 적용하는 법을 알려드릴게요. dasdasdsadsadsadadada dasdsadad",
    tech: ["Vue.js", "JavaScript", "SCSS"],
    status: "DONE",
    icon: <Briefcase className="w-5 h-5 text-slate-500" />,
  },
  {
    id: "J8",
    date: "2023.01 - 2024.03",
    title: "Previous Experience",
    subtitle: "Frontend Developer",
    desc: "adsdasddddffafasf af fa fa가나다라마바아사자차타파ㅏㅎ *Pretendard(프리텐다드)**는 SIL Open Font License를 따르는 오픈소스 폰트라서, 개인/상업적 용도로 자유롭게 사용 가능합니다. 다른 사람 포트폴리오에서 가져온 파일이라도 폰트 자체가 프리텐다드라면 저작권 문제는 없습니다.하지만, 가져오신 코드와 방식은 수정이 필요합니다. 보여주신 코드(url(/_next/static/media/...))는 Next.js가 빌드(Build)할 때 자동으로 생성한 임시 경로입니다. 이걸 그대로 복사해서 쓰면 나중에 폰트가 깨지거나 연결이 끊깁니다.다운로드하신 .woff2 파일(아마도 가변 폰트 파일인 것 같습니다)을 활용해 **Next.js의 최적화 기능(next/font/local)**으로 제대로 적용하는 법을 알려드릴게요. dasdasdsadsadsadadada dasdsadad",
    tech: ["Vue.js", "JavaScript", "SCSS"],
    status: "DONE",
    icon: <Briefcase className="w-5 h-5 text-slate-500" />,
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
                viewport={{ once: true, margin: "-100px" }}
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
