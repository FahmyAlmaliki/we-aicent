import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import SectionTitle from "../components/SectionTitle";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadActivities() {
      try {
        const data = await apiFetch("/api/activities");
        setActivities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, []);

  return (
    <div className="page-stack">
      <section className="section-card">
        <SectionTitle
          eyebrow="Kegiatan"
          title="Projects"
          description="Halaman ini sudah disiapkan agar mudah dikembangkan ketika daftar kegiatan perlu dikelola lebih detail ke depannya."
        />
      </section>

      {loading ? <p className="status-box">Memuat daftar kegiatan...</p> : null}
      {error ? <p className="status-box error">{error}</p> : null}
      {!loading && !error && activities.length === 0 ? (
        <p className="status-box">Belum ada kegiatan yang ditambahkan.</p>
      ) : null}

      {!loading && !error && activities.length > 0 ? (
        <section className="activity-list">
          {activities.map((activity) => (
            <article key={activity.id} className="activity-card">
              <p>{activity.status}</p>
              <h3>{activity.title}</h3>
              <span>{activity.text}</span>
            </article>
          ))}
        </section>
      ) : null}
    </div>
  );
}
