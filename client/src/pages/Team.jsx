import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import MemberCard from "../components/MemberCard";
import SectionTitle from "../components/SectionTitle";

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMembers() {
      try {
        const data = await apiFetch("/api/members");
        setMembers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadMembers();
  }, []);

  return (
    <div className="page-stack">
      <section className="section-card">
        <SectionTitle
          eyebrow="Tim"
          title="Anggota Workshop AIoT"
          description="Data anggota ditarik langsung dari backend dan dapat diperbarui admin kapan saja melalui dashboard."
        />
      </section>

      {loading ? <p className="status-box">Memuat data anggota...</p> : null}
      {error ? <p className="status-box error">{error}</p> : null}

      {!loading && !error && members.length === 0 ? (
        <p className="status-box">Belum ada anggota yang ditambahkan.</p>
      ) : null}

      {!loading && !error && members.length > 0 ? (
        <section className="team-grid">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </section>
      ) : null}
    </div>
  );
}
