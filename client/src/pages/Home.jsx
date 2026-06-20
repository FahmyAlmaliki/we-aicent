import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch, getImageUrl } from "../api";
import ActivitySlider from "../components/ActivitySlider";
import { IconFlask, IconHandshake, IconRocket, IconArrowRight } from "../components/Icons";

const stats = [
  { label: "Workshop", value: "20+" },
  { label: "Peserta", value: "500+" },
  { label: "Proyek AI", value: "30+" },
  { label: "Mentor", value: "15+" },
];

const highlights = [
  {
    icon: IconFlask,
    title: "Hands-on Workshop",
    text: "Materi berbasis praktik untuk membangun solusi AI dari ide sampai implementasi.",
  },
  {
    icon: IconHandshake,
    title: "Kolaborasi Lintas Disiplin",
    text: "Menghubungkan mahasiswa, dosen, dan komunitas untuk eksperimen yang relevan.",
  },
  {
    icon: IconRocket,
    title: "Portofolio Nyata",
    text: "Setiap program diarahkan menjadi karya yang dapat dipresentasikan dan diterapkan.",
  },
];

export default function Home() {
  const [activities, setActivities] = useState([]);
  const [heroBg, setHeroBg] = useState("");

  useEffect(() => {
    apiFetch("/api/activities")
      .then(setActivities)
      .catch(() => {});
    apiFetch("/api/config")
      .then((config) => setHeroBg(config.heroBg || ""))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section
        className="relative text-white overflow-hidden"
        style={
          heroBg
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(10,20,40,0.7), rgba(10,20,40,0.85)), url(${getImageUrl(heroBg)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      >
        {!heroBg && (
          <div className="absolute inset-0 bg-gradient-to-br from-navy via-slate-800 to-slate-900" />
        )}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-400 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold tracking-widest uppercase mb-6 border border-amber-400/30">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
              Official Profile & Workshop Hub
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Mengakselerasi Talenta AI{" "}
              <span className="text-amber-400">Universitas Brawijaya</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-2xl animate-fade-up delay-200">
              AI Center UB Workshop hadir sebagai ruang belajar, bereksperimen, dan
              membangun solusi berbasis kecerdasan artifisial dengan arah yang praktis.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-up delay-300">
              <Link
                to="/activities"
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-navy font-bold transition-all hover:shadow-lg hover:shadow-amber-400/25 hover:-translate-y-0.5"
              >
                Jelajahi Kegiatan
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 transition-all hover:-translate-y-0.5"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Slider Kegiatan */}
      {activities.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 animate-scale-in">
          <ActivitySlider activities={activities} />
        </section>
      )}

      {/* About Short */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-br from-navy to-slate-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl" />
          <div className="relative max-w-2xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-3 block">
              Tentang Kami
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-4">
              AI Center UB membangun ekosistem pembelajaran AI yang hidup.
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              Website ini menjadi pusat informasi untuk kegiatan workshop, profil organisasi,
              dan tim inti yang bergerak di balik program.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-navy font-bold text-sm transition-all"
            >
              Selengkapnya
              <IconArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-16">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-2 block">
            Program Unggulan
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-navy">
            Apa yang Kami Tawarkan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((item, i) => (
            <article
              key={item.title}
              className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all animate-fade-up delay-${(i + 1) * 100}`}
            >
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                <item.icon />
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
