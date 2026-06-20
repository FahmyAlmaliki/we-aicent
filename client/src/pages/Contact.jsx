const contacts = [
  {
    icon: "✉️",
    label: "Email",
    value: "aicenter@ub.ac.id",
    href: "mailto:aicenter@ub.ac.id",
  },
  {
    icon: "📸",
    label: "Instagram",
    value: "@aicenter.ub",
    href: "https://instagram.com/aicenter.ub",
  },
  {
    icon: "📍",
    label: "Lokasi",
    value: "Kampus Universitas Brawijaya, Malang, Jawa Timur",
    href: null,
  },
  {
    icon: "🤝",
    label: "Kolaborasi",
    value: "Terbuka untuk workshop, riset, dan inisiatif komunitas berbasis AI.",
    href: null,
  },
];

export default function Contact() {
  return (
    <div>
      <section className="bg-gradient-to-br from-navy via-slate-800 to-slate-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <span className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-3 block animate-fade-up">
            Kontak
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 animate-fade-up delay-100">
            Terhubung dengan AI Center UB
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl animate-fade-up delay-200">
            Gunakan informasi ini untuk kolaborasi, pendaftaran workshop, atau komunikasi umum.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {contacts.map((item, i) => (
            <div
              key={item.label}
              className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all animate-fade-up delay-${(i + 1) * 100}`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl mb-4">
                {item.icon}
              </div>
              <p className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-1">{item.label}</p>
              {item.href ? (
                <a href={item.href} className="text-navy font-semibold hover:text-amber-600 transition-colors">
                  {item.value}
                </a>
              ) : (
                <p className="text-slate-600 text-sm leading-relaxed">{item.value}</p>
              )}
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-navy to-slate-800 rounded-3xl p-8 sm:p-12 text-white text-center animate-fade-up">
          <p className="text-2xl font-bold mb-3">Bergabung bersama kami</p>
          <p className="text-slate-300 max-w-xl mx-auto">
            Kami selalu terbuka untuk kolaborasi dengan mahasiswa, dosen, dan komunitas yang tertarik mengembangkan solusi AI.
          </p>
        </div>
      </div>
    </div>
  );
}
