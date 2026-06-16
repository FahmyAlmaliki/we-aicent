import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";

const highlights = [
  {
    title: "Hands-on Workshop",
    text: "Materi berbasis praktik untuk membangun solusi AI dari ide sampai implementasi.",
  },
  {
    title: "Kolaborasi Lintas Disiplin",
    text: "Menghubungkan mahasiswa, dosen, dan komunitas untuk eksperimen yang relevan.",
  },
  {
    title: "Portofolio Nyata",
    text: "Setiap program diarahkan menjadi karya yang dapat dipresentasikan dan diterapkan.",
  },
];

export default function Home() {
  return (
    <div className="page-stack">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Official Profile & Workshop Hub</p>
          <h3>Mengakselerasi talenta AI Universitas Brawijaya lewat workshop yang relevan.</h3>
          <p className="hero-text">
            AI Center UB Workshop hadir sebagai ruang belajar, bereksperimen, dan
            membangun solusi berbasis kecerdasan artifisial dengan arah yang praktis.
          </p>
          <div className="hero-actions">
            <Link to="/team" className="button-primary">
              Lihat Tim
            </Link>
            <Link to="/activities" className="button-secondary">
              Jelajahi Kegiatan
            </Link>
          </div>
        </div>

        <div className="hero-panel">
          <div className="floating-stat">
            <strong>AI Center UB</strong>
            <span>Workshop, riset terapan, dan pengembangan komunitas</span>
          </div>
          <div className="hero-grid">
            <div>
              <span>Fokus</span>
              <strong>Machine Learning, Vision, NLP</strong>
            </div>
            <div>
              <span>Format</span>
              <strong>Bootcamp, showcase, mentoring</strong>
            </div>
            <div>
              <span>Tujuan</span>
              <strong>Belajar cepat, membangun nyata</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <SectionTitle
          eyebrow="Ringkasan"
          title="AI Center UB membangun ekosistem pembelajaran AI yang hidup."
          description="Website ini menjadi pusat informasi untuk kegiatan workshop, profil organisasi, dan tim inti yang bergerak di balik program."
        />
      </section>

      <section className="highlights-grid">
        {highlights.map((item) => (
          <article key={item.title} className="highlight-card">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
