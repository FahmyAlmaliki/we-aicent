import SectionTitle from "../components/SectionTitle";

export default function Contact() {
  return (
    <div className="page-stack">
      <section className="section-card">
        <SectionTitle
          eyebrow="Kontak"
          title="Terhubung dengan AI Center UB"
          description="Gunakan informasi ini untuk kolaborasi, pendaftaran workshop, atau komunikasi umum."
        />
      </section>

      <section className="two-column-grid">
        <article className="info-panel">
          <h3>Email</h3>
          <p>aicenter@ub.ac.id</p>
          <h3>Instagram</h3>
          <p>@aicenter.ub</p>
        </article>

        <article className="info-panel">
          <h3>Lokasi</h3>
          <p>Kampus Universitas Brawijaya, Malang, Jawa Timur</p>
          <h3>Kolaborasi</h3>
          <p>Terbuka untuk workshop, riset, dan inisiatif komunitas berbasis AI.</p>
        </article>
      </section>
    </div>
  );
}
