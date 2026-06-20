import { useEffect, useState } from "react";
import { apiFetch, getImageUrl } from "../api";

const STATUS_COLORS = {
  "Workshop Inti": "bg-blue-100 text-blue-700",
  "Selesai": "bg-green-100 text-green-700",
  "Upcoming": "bg-amber-100 text-amber-700",
  "Sedang Berjalan": "bg-purple-100 text-purple-700",
};

function statusColor(status) {
  return STATUS_COLORS[status] || "bg-slate-100 text-slate-600";
}

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/activities")
      .then(setActivities)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-navy via-slate-800 to-slate-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <span className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-3 block animate-fade-up">
            Kegiatan
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 animate-fade-up delay-100">
            Workshop & Aktivitas
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl animate-fade-up delay-200">
            Daftar program, workshop, dan kegiatan yang diselenggarakan AI Center UB.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
                <div className="aspect-video bg-slate-100" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                  <div className="h-5 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
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

        {!loading && !error && activities.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-lg font-semibold">Belum ada kegiatan yang ditambahkan.</p>
            <p className="text-sm mt-1">Tambahkan melalui dashboard admin.</p>
          </div>
        )}

        {!loading && !error && activities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, i) => (
              <article
                key={activity.id}
                className={`bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-up delay-${Math.min(i * 100, 500)}`}
              >
                {activity.image ? (
                  <div className="aspect-video overflow-hidden bg-slate-100">
                    <img
                      src={getImageUrl(activity.image)}
                      alt={activity.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-navy to-slate-700 flex items-center justify-center">
                    <span className="text-white/30 text-5xl font-extrabold">AI</span>
                  </div>
                )}
                <div className="p-5">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-3 ${statusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                  <h3 className="font-bold text-navy text-base mb-2 leading-snug">{activity.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{activity.text}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
