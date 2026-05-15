import { 
  Bell, 
  ChevronRight, 
  Home, 
  User, 
  UserPlus, 
  Target, 
  Star, 
  Upload, 
  Edit3, 
  BarChart3,
  TrendingUp,
  BrainCircuit,
  Database,
  Search,
  ChevronDown,
  LogOut,
  Briefcase
} from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext.jsx";

const skillData = [
  { subject: 'Problem Solving', A: 110, B: 130 },
  { subject: 'Communication', A: 85, B: 110 },
  { subject: 'Teamwork', A: 95, B: 120 },
  { subject: 'Leadership', A: 70, B: 100 },
  { subject: 'Technical Skill', A: 120, B: 110 },
];

const recommendations = [
  { 
    title: "Data Analyst", 
    match: "92% Match", 
    desc: "Peran yang cocok dengan kekuatan skill dan minat Anda.",
    icon: BarChart3,
    color: "bg-purple-100 text-purple-600"
  },
  { 
    title: "Data Scientist", 
    match: "85% Match", 
    desc: "Butuh peningkatan di beberapa skill seperti Machine Learning.",
    icon: BrainCircuit,
    color: "bg-pink-100 text-pink-600"
  },
  { 
    title: "BI Analyst", 
    match: "78% Match", 
    desc: "Kesempatan besar untuk berkembang di bidang analisis data.",
    icon: Database,
    color: "bg-blue-100 text-blue-600"
  }
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[#fdf2ff] pb-40 lg:pb-12 font-['Plus_Jakarta_Sans',sans-serif] text-[#081024]">
      {/* Desktop Navbar (Dealls style) */}
      <nav className="hidden lg:block sticky top-0 z-[100] bg-white border-b border-[#f3e8ff] shadow-sm">
        <div className="max-w-[1440px] mx-auto px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src="/image/logo_hirings.png" alt="Hirings" className="h-9 w-auto" />
              <span className="text-xl font-black text-[#2b0b3d]">Hirings</span>
            </Link>
            
            <div className="flex items-center gap-8">
              <NavLink to="/dashboard" label="Home" active={pathname === '/dashboard'} />
              <NavLink to="/onboarding" label="Onboarding" active={pathname === '/onboarding'} />
              <NavLink to="/skill-gap" label="Skill Gap" active={pathname === '/skill-gap'} />
              <NavLink to="/career" label="Career Recommendation" active={pathname === '/career'} />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Cari fitur atau skill..." 
                className="w-64 h-10 pl-10 pr-4 bg-[#fdf2ff] border-none rounded-full text-sm focus:ring-2 focus:ring-pink-200 outline-none transition-all"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" size={16} />
            </div>
            
            <button className="relative p-2 text-[#2b0b3d] hover:bg-[#fdf2ff] rounded-full transition">
              <Bell size={22} />
              <span className="absolute top-2 right-2 h-2 w-2 bg-pink-500 rounded-full border-2 border-white" />
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 pl-2 pr-1 py-1 bg-[#fdf2ff] rounded-full hover:bg-pink-50 transition"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden border border-white">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-bold">{user?.fullName?.split(' ')[0]}</span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-[#f3e8ff] overflow-hidden py-2 animate-in fade-in zoom-in duration-200">
                  <button className="w-full px-5 py-2.5 text-left text-sm hover:bg-pink-50 flex items-center gap-3">
                    <User size={16} /> Profile Saya
                  </button>
                  <button 
                    onClick={logout}
                    className="w-full px-5 py-2.5 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-3"
                  >
                    <LogOut size={16} /> Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header (Hidden on Desktop) */}
      <header className="lg:hidden flex items-center justify-between px-6 pt-12 pb-6">
        <img src="/image/logo_hirings.png" alt="Hirings" className="h-9 w-auto" />
        <div className="relative">
          <button className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm">
            <Bell size={22} className="text-[#2b0b3d]" />
            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-pink-500" />
          </button>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-5 lg:px-10 mt-6 lg:mt-10 space-y-8">
        {/* Top Section: Welcome & Smart Onboarding */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-6">
            <section className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-[#081024]">
                  Hi, {user?.fullName?.split(' ')[0] || 'User'}! 😊
                </h1>
                <p className="mt-1 text-[14px] lg:text-[16px] text-[#667085] leading-relaxed">
                  Mari kembangkan keterampilan Anda dan temukan jalur karier terbaik Anda.
                </p>
              </div>
              <div className="h-14 w-14 lg:hidden overflow-hidden rounded-full border-2 border-white shadow-md shrink-0">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="Profile" className="h-full w-full object-cover" />
              </div>
            </section>
            
            {/* Quick Stats (Desktop only) */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <StatCard label="Skill Match" value="72%" icon={Target} color="text-purple-600" bg="bg-purple-50" />
              <StatCard label="Career Path" value="3 Ready" icon={Briefcase} color="text-pink-600" bg="bg-pink-50" />
            </div>
          </div>

          <section className="lg:col-span-8 rounded-3xl bg-white p-5 lg:p-6 shadow-[0_10px_40px_rgba(43,11,61,0.06)] relative overflow-hidden border border-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-pink-50 text-pink-500">
                <TrendingUp size={18} />
              </div>
              <span className="text-sm font-bold text-[#2b0b3d]">Smart Onboarding</span>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-6">
              <div>
                <h2 className="text-lg lg:text-xl font-bold leading-tight text-[#081024]">
                  Lengkapi profil untuk hasil rekomendasi yang lebih akurat
                </h2>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-[#fdf2ff] overflow-hidden">
                    <div className="h-full w-[60%] bg-pink-500" />
                  </div>
                  <span className="text-[13px] font-bold text-[#667085]">60% selesai</span>
                </div>
              </div>
              <div className="relative">
                <div className="h-20 w-20 bg-pink-50 rounded-2xl flex items-center justify-center">
                  <div className="relative h-14 w-12 bg-white rounded-lg shadow-sm border border-pink-100 flex flex-col items-center justify-center">
                     <div className="w-8 h-1 bg-pink-50 rounded-full mb-1" />
                     <div className="w-6 h-1 bg-pink-50 rounded-full mb-1" />
                     <span className="text-[10px] font-black text-pink-200">CV</span>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-white shadow-md border border-pink-50 flex items-center justify-center">
                  <Upload size={14} className="text-pink-500" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Link to="/onboarding" className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-[#2b0b3d] text-white text-[13px] font-bold active:scale-95 transition shadow-lg shadow-purple-900/10">
                <Upload size={16} />
                Upload CV (PDF)
              </Link>
              <Link to="/onboarding?manual=true" className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border border-pink-200 bg-white text-pink-600 text-[13px] font-bold active:scale-95 transition hover:bg-pink-50">
                <Edit3 size={16} />
                Input Skill Manual
              </Link>
            </div>
          </section>
        </div>

        {/* Bottom Section: Skill Gap & Recommendations */}
        <div className="grid lg:grid-cols-12 gap-8">
          <section className="lg:col-span-7 rounded-3xl bg-white p-6 lg:p-8 shadow-[0_10px_40px_rgba(43,11,61,0.06)] border border-white/50">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Skill Gap Overview</h2>
              <button className="text-sm font-bold text-pink-600 hover:underline transition">Lihat Detail</button>
            </div>

            <div className="flex gap-6 mb-8">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#2b0b3d]" />
                <span className="text-xs font-bold text-[#667085]">Skill Anda</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-pink-400" />
                <span className="text-xs font-bold text-[#667085]">Benchmark Industri</span>
              </div>
            </div>

            <div className="grid md:grid-cols-[1fr_0.7fr] gap-8 items-center">
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                    <PolarGrid stroke="#f3e8ff" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#667085', fontSize: 11, fontWeight: 600 }} />
                    <Radar name="User" dataKey="A" stroke="#2b0b3d" fill="#2b0b3d" fillOpacity={0.25} />
                    <Radar name="Benchmark" dataKey="B" stroke="#f472b6" fill="#f472b6" fillOpacity={0.15} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-[#fdf2ff] rounded-[32px] p-6 flex flex-col items-center justify-center border border-white">
                <span className="text-sm font-bold text-[#667085] text-center mb-2">Overall Match Score</span>
                <span className="text-5xl font-black text-[#2b0b3d]">72%</span>
                <div className="mt-5 w-full h-2 rounded-full bg-white overflow-hidden">
                  <div className="h-full w-[72%] bg-pink-500 rounded-full" />
                </div>
                <div className="mt-4 px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 text-[13px] font-bold italic shadow-sm">
                  Good Match
                </div>
                <p className="mt-5 text-[11px] lg:text-[12px] text-[#667085] text-center leading-relaxed font-medium">
                  Tingkatkan beberapa skill teknis untuk mencapai hasil yang lebih optimal di pasar kerja.
                </p>
              </div>
            </div>
          </section>

          <section className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold">Rekomendasi Karir</h2>
              <button className="text-sm font-bold text-pink-600 hover:underline transition">Lihat Semua</button>
            </div>

            <div className="space-y-4">
              {recommendations.map((item, idx) => (
                <div key={idx} className="group flex items-center gap-5 bg-white p-5 rounded-[28px] shadow-[0_5px_20px_rgba(43,11,61,0.04)] hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer border border-transparent hover:border-pink-50">
                  <div className={`h-16 w-16 rounded-2xl ${item.color} flex items-center justify-center shrink-0 shadow-sm group-hover:rotate-3 transition-transform`}>
                    <item.icon size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-extrabold text-[17px] truncate">{item.title}</h3>
                      <span className="px-2 py-0.5 rounded-md bg-pink-50 text-pink-600 text-[10px] font-black shrink-0 uppercase tracking-wider">
                        {item.match}
                      </span>
                    </div>
                    <p className="text-sm text-[#667085] line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-[#fdf2ff] flex items-center justify-center text-[#2b0b3d] opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={20} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-24 bg-white border-t border-[#fdf2ff] px-6 flex items-center justify-between z-[100] shadow-[0_-10px_30px_rgba(43,11,61,0.05)]">
        <NavIconButton to="/dashboard" icon={Home} label="Home" active={pathname === '/dashboard'} />
        <NavIconButton to="/onboarding" icon={UserPlus} label="Onboarding" active={pathname === '/onboarding'} />
        <NavIconButton to="/skill-gap" icon={Target} label="Skill Gap" active={pathname === '/skill-gap'} />
        <NavIconButton to="/career" icon={Star} label="Career" active={pathname === '/career'} />
        <NavIconButton to="/profile" icon={User} label="Profile" active={pathname === '/profile'} />
      </nav>
    </div>
  );
}

function NavLink({ to, label, active }) {
  return (
    <Link to={to} className={`text-[15px] font-bold transition-colors ${active ? 'text-[#2b0b3d] relative after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-0.5 after:bg-[#2b0b3d] after:rounded-full' : 'text-[#667085] hover:text-[#2b0b3d]'}`}>
      {label}
    </Link>
  );
}

function NavIconButton({ to, icon: Icon, label, active }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-1">
      <div className={`h-12 w-12 rounded-full flex items-center justify-center transition active:scale-90 ${active ? 'bg-pink-100 text-pink-600' : 'text-[#98a2b3]'}`}>
        <Icon size={24} />
      </div>
      <span className={`text-[11px] font-bold ${active ? 'text-pink-600' : 'text-[#98a2b3]'}`}>{label}</span>
    </Link>
  );
}

function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className={`${bg} p-4 rounded-2xl flex flex-col gap-2 border border-white shadow-sm`}>
      <div className={`${color} flex items-center justify-between`}>
        <Icon size={18} />
        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</span>
      </div>
      <div>
        <div className="text-xs font-bold text-[#667085] mb-0.5">{label}</div>
        <div className="text-xl font-black text-[#2b0b3d]">{value}</div>
      </div>
    </div>
  );
}
