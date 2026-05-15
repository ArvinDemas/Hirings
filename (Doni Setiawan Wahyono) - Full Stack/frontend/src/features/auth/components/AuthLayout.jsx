import {
  BarChart3,
  BriefcaseBusiness,
  CalendarCheck,
  CloudUpload,
  FileText,
  Mail,
  MessageSquareText,
  Settings,
  UsersRound,
} from "lucide-react";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    title: "Connect with every module.",
    description: "Everything you need in an easily customizable enterprise dashboard.",
  },
  {
    title: "Intelligence at your fingertips.",
    description: "Make data-driven decisions with our advanced career analytics tools.",
  },
  {
    title: "Streamlined recruitment.",
    description: "Optimize your hiring process with automated workflows and AI screening.",
  },
];

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="h-dvh bg-white text-[#081024] overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="grid h-full lg:grid-cols-[45%_55%]">
        <section className="flex flex-col px-7 pt-[8vh] pb-8 sm:px-12 lg:px-[6vw]">
          <LogoMark subtitle={eyebrow} />

          <div className="mt-10 w-full max-w-[460px] lg:mt-[6vh]">
            <h1 className="text-[32px] font-extrabold leading-[1.1] tracking-tight text-[#050b1d] sm:text-[36px]">
              {title}
            </h1>
            <p className="mt-2 text-[16px] leading-[1.4] tracking-normal text-[#667085]">
              {subtitle}
            </p>

            <div className="mt-8 lg:mt-[5vh]">{children}</div>
          </div>

          <p className="mt-auto w-full pt-6 text-center text-[13px] font-medium leading-none text-[#98a2b3]">
            © 2026 Hirings. All rights reserved.
          </p>
        </section>

        <section className="relative hidden h-full overflow-hidden bg-[#2b0b3d] text-white lg:flex lg:flex-col">
          <div className="flex flex-1 items-center justify-center px-12 pt-[2vh]">
            <ModuleOrbit />
          </div>

          <div className="pb-[8vh] text-center">
            <div className="relative h-[110px] px-8">
              {SLIDES.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex flex-col items-center transition-opacity duration-1000 ease-in-out ${
                    index === activeSlide 
                      ? "opacity-100" 
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <h2 className="text-[26px] font-extrabold leading-tight tracking-normal">
                    {slide.title}
                  </h2>
                  <p className="mx-auto mt-2 max-w-[480px] text-[15px] leading-[1.5] text-white/80">
                    {slide.description}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center gap-2.5">
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeSlide ? "w-6 bg-white" : "w-1.5 bg-white/35"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function LogoMark({ subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <img 
        src="/image/logo_hirings.png" 
        alt="Hirings" 
        className="h-11 w-auto object-contain"
      />
      <div className="flex flex-col items-start">
        <span className="text-[22px] font-black leading-none tracking-tight text-[#2b0b3d]">
          Hirings
        </span>
        <span className="mt-1.5 inline-block rounded-md bg-[#fdf2ff] px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-[#2b0b3d] uppercase shadow-sm">
          {subtitle}
        </span>
      </div>
    </div>
  );
}

function ModuleOrbit() {
  const modules = [
    { Icon: MessageSquareText, className: "left-[47%] top-[-4%] bg-[#35c778]" },
    { Icon: CloudUpload, className: "right-[6%] top-[15%] bg-[#09c7d8]" },
    { Icon: BarChart3, className: "right-[-2%] top-[48%] bg-[#954eea]" },
    { Icon: FileText, className: "right-[12%] bottom-[5%] bg-[#ef4057]" },
    { Icon: CalendarCheck, className: "left-[47%] bottom-[-7%] bg-[#f5c31a]" },
    { Icon: UsersRound, className: "left-[11%] bottom-[8%] bg-[#36b8ea]" },
    { Icon: Settings, className: "left-[0%] top-[48%] bg-[#0d4da3]" },
    { Icon: Mail, className: "left-[12%] top-[15%] bg-[#ff8b36]" },
  ];

  return (
    <div className="relative aspect-square w-full max-w-[320px]">
      <div className="absolute inset-[9%] rounded-full border-[1.5px] border-[#fdb9ff]/25" />
      <div className="absolute inset-[18%] rounded-full border border-[#fdb9ff]/15" />

      <OrbitLine className="rotate-0" />
      <OrbitLine className="rotate-45" />
      <OrbitLine className="-rotate-45" />
      <OrbitLine className="rotate-90" />

      <div className="absolute left-1/2 top-1/2 w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-[15px] border-[4px] border-[#fdb9ff]/35 bg-[#fff2ff] p-2.5 shadow-[0_25px_60px_rgba(43,11,61,0.35)]">
        <div className="rounded-[11px] bg-white p-2.5">
          <div className="mb-2.5 flex gap-1.25">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f16555]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#f2bd4d]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#2fc17c]" />
          </div>
          <div className="grid grid-cols-[0.7fr_1.3fr] gap-2.5">
            <div className="space-y-2.5">
              <span className="block h-8 rounded-lg bg-[#f9e0ff]" />
              <span className="block h-[56px] rounded-lg bg-[#fdf2ff]" />
              <span className="block h-[48px] rounded-lg bg-[#fdf2ff]" />
            </div>
            <div className="space-y-2.5 pt-0.5">
              <span className="block h-3 w-4/5 rounded-full bg-[#f9e0ff]" />
              <span className="block h-3 w-3/5 rounded-full bg-[#fdf2ff]" />
              <div className="grid grid-cols-3 items-end gap-2 pt-6">
                <span className="h-[40px] rounded bg-[#f9e0ff]" />
                <span className="h-[64px] rounded bg-[#fdb9ff]" />
                <span className="h-8 rounded bg-[#fdf2ff]" />
              </div>
              <div className="h-[48px] rounded-lg border-[1.5px] border-[#fdf2ff] bg-[linear-gradient(135deg,transparent_48%,#fdb9ff_49%,#fdb9ff_56%,transparent_57%)]" />
            </div>
          </div>
        </div>
      </div>

      {modules.map(({ Icon, className }) => (
        <span
          className={`absolute grid h-[40px] w-[40px] place-items-center rounded-xl text-white shadow-[0_12px_24px_rgba(43,11,61,0.25)] xl:h-[44px] xl:w-[44px] ${className}`}
          key={className}
        >
          <Icon size={20} strokeWidth={2.7} aria-hidden="true" />
        </span>
      ))}
    </div>
  );
}

function OrbitLine({ className }) {
  return (
    <div
      className={`absolute left-[10%] top-1/2 h-[1px] w-[80%] -translate-y-1/2 bg-[#fdb9ff]/15 ${className}`}
    >
      <span className="absolute left-[10%] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full border border-[#fdb9ff]/30 bg-[#2b0b3d]" />
      <span className="absolute right-[10%] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full border border-[#fdb9ff]/30 bg-[#2b0b3d]" />
    </div>
  );
}
