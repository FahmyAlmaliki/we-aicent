import SectionTitle from "../components/SectionTitle";

const pillars = [
  "Menciptakan ruang belajar AI yang inklusif dan terstruktur.",
  "Mendorong lahirnya karya berbasis riset terapan dan kebutuhan industri.",
  "Membangun komunitas kolaboratif untuk inovasi berkelanjutan.",
];

export default function About() {
  return (
    <div className="page-stack">
      <section className="section-card">
        <SectionTitle
          eyebrow="Tentang Kami"
          title="AI Center Universitas Brawijaya"
          description="AI Center UB adalah wadah pengembangan pengetahuan, kolaborasi, dan implementasi teknologi kecerdasan artifisial di lingkungan kampus."
        />
        <p className="lead-copy">
          Melalui workshop, kelas, dan showcase proyek, kami ingin memastikan
          pembelajaran AI tidak berhenti di teori, tetapi menjadi pengalaman yang
          aplikatif dan berdampak.
        </p>
      </section>

      <section className="two-column-grid">
        <article className="info-panel">
          <p className="eyebrow">Visi</p>
          <h3>Menjadi pusat pengembangan talenta dan inovasi AI yang progresif.</h3>
        </article>

        <article className="info-panel">
          <p className="eyebrow">Misi</p>
          <ul className="clean-list">
            {pillars.map((pillar) => (
              <li key={pillar}>{pillar}</li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
