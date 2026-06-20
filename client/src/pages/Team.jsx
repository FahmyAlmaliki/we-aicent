import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import MemberCard from "../components/MemberCard";
import { IconPeople } from "../components/Icons";


function categorizeMembersToSections(members, angkatanList) {
  const dosen = [];
  const byAngkatan = {};
  const lainnya = [];

  for (const member of members) {
    const angkatan = member.angkatan;

    if (angkatan === "Dosen") {
      dosen.push(member);
    } else if (angkatan && angkatan !== "") {
      if (!byAngkatan[angkatan]) byAngkatan[angkatan] = [];
      byAngkatan[angkatan].push(member);
    } else {
      // fallback: deteksi dari role untuk data lama tanpa field angkatan
      if (/dosen/i.test(member.role)) {
        dosen.push(member);
      } else {
        const yearMatch = member.role.match(/\b(20\d{2})\b/);
        if (yearMatch) {
          const year = yearMatch[1];
          if (!byAngkatan[year]) byAngkatan[year] = [];
          byAngkatan[year].push(member);
        } else {
          lainnya.push(member);
        }
      }
    }
  }

  // Urutkan: tahun terbesar (termuda) paling atas, "Dosen" dikecualikan
  const yearKeys = Object.keys(byAngkatan);
  const angkatanNonDosen = angkatanList.filter((a) => a !== "Dosen");
  const orderedKeys = yearKeys.sort((a, b) => {
    const idxA = angkatanNonDosen.indexOf(a);
    const idxB = angkatanNonDosen.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxB - idxA; // urutan terbalik dari list (termuda/terbesar di atas)
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return b.localeCompare(a); // fallback: sort descending
  });

  const mahasiswaSections = orderedKeys.map((key) => ({
    title: `Mahasiswa Angkatan ${key}`,
    members: byAngkatan[key],
  }));

  if (lainnya.length > 0) {
    mahasiswaSections.push({ title: "Anggota Lainnya", members: lainnya });
  }

  return { mahasiswaSections, dosen };
}

function MemberGrid({ members }) {
  return (
    <div className="flex flex-wrap justify-center gap-5">
      {members.map((member, i) => (
        <div
          key={member.id}
          className={`w-full max-w-[280px] animate-fade-up delay-${Math.min(i * 100, 500)}`}
        >
          <MemberCard member={member} />
        </div>
      ))}
    </div>
  );
}

function SectionBlock({ title, members }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px flex-1 bg-slate-200" />
        <h2 className="text-sm font-bold tracking-widest uppercase text-amber-600 whitespace-nowrap">
          {title}
        </h2>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
      <MemberGrid members={members} />
    </div>
  );
}

export default function Team() {
  const [members, setMembers] = useState([]);
  const [angkatanList, setAngkatanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiFetch("/api/members"),
      apiFetch("/api/angkatan").catch(() => []),
    ])
      .then(([memberData, angkatanData]) => {
        setMembers(memberData);
        setAngkatanList(angkatanData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const { mahasiswaSections, dosen } = categorizeMembersToSections(members, angkatanList);

  return (
    <div>
      <section className="bg-gradient-to-br from-navy via-slate-800 to-slate-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <span className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-3 block animate-fade-up">
            Tim Kami
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 animate-fade-up delay-100">
            Anggota Workshop AI Center UB
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl animate-fade-up delay-200">
            Orang-orang di balik program workshop, riset, dan komunitas AI di Universitas Brawijaya.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && (
          <div className="flex flex-wrap justify-center gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-full max-w-[280px] bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
                <div className="aspect-square bg-slate-100" />
                <div className="p-5 space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && members.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <div className="mb-4 text-slate-300"><IconPeople /></div>
            <p className="text-lg font-semibold">Belum ada anggota yang ditambahkan.</p>
            <p className="text-sm mt-1">Tambahkan melalui dashboard admin.</p>
          </div>
        )}

        {!loading && !error && members.length > 0 && (
          <>
            {mahasiswaSections.map((section) => (
              <SectionBlock key={section.title} title={section.title} members={section.members} />
            ))}

            {dosen.length > 0 && (
              <SectionBlock title="Dosen Pembimbing" members={dosen} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
