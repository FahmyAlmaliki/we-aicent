const pillars = [
  "Menciptakan ruang belajar AI yang inklusif dan terstruktur.",
  "Mendorong lahirnya karya berbasis riset terapan dan kebutuhan industri.",
  "Membangun komunitas kolaboratif untuk inovasi berkelanjutan.",
];

import { IconRobot, IconEye, IconChat, IconBalance, IconBullseye, IconStar } from "../components/Icons";

const focuses = [
  { title: "Machine Learning", desc: "Dari regresi linier hingga model deep learning terapan.", icon: IconRobot },
  { title: "Computer Vision", desc: "Deteksi objek, klasifikasi gambar, dan analisis visual.", icon: IconEye },
  { title: "Natural Language Processing", desc: "Pemrosesan teks, chatbot, dan analisis sentimen.", icon: IconChat },
  { title: "AI Ethics", desc: "Penerapan AI yang bertanggung jawab dan berkeadilan.", icon: IconBalance },
];

export default function About() {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-navy via-slate-800 to-slate-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <span className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-3 block animate-fade-up">
            Tentang Kami
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 animate-fade-up delay-100">
            AI Center Universitas Brawijaya
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed animate-fade-up delay-200">
            Wadah pengembangan pengetahuan, kolaborasi, dan implementasi teknologi kecerdasan artifisial di lingkungan kampus.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">

        {/* Visi & Misi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm animate-fade-up">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4"><IconBullseye /></div>
            <p className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-2">Visi</p>
            <h2 className="text-xl font-bold text-navy leading-snug">
              Menjadi pusat pengembangan talenta dan inovasi AI yang progresif.
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm animate-fade-up delay-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4"><IconStar /></div>
            <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-3">Misi</p>
            <ul className="space-y-3">
              {pillars.map((pillar) => (
                <li key={pillar} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                  <span className="w-1.5 h-1.5 mt-2 bg-amber-400 rounded-full flex-shrink-0" />
                  {pillar}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="bg-gradient-to-br from-navy to-slate-800 rounded-3xl p-8 sm:p-12 text-white animate-fade-up">
          <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
            Melalui workshop, kelas, dan showcase proyek, kami ingin memastikan
            pembelajaran AI tidak berhenti di teori, tetapi menjadi pengalaman yang
            aplikatif dan berdampak nyata bagi mahasiswa dan komunitas Universitas Brawijaya.
          </p>
        </div>

        {/* Fokus Bidang */}
        <div>
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-2 block">
              Bidang Kajian
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">Fokus Program</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {focuses.map((item, i) => (
              <div
                key={item.title}
                className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all animate-fade-up delay-${(i + 1) * 100}`}
              >
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                  <item.icon />
                </div>
                <h3 className="font-bold text-navy mb-2 text-sm">{item.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
