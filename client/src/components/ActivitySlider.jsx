import { useEffect, useState, useCallback } from "react";
import { getImageUrl } from "../api";

const GRADIENT_FALLBACKS = [
  "from-blue-600 to-indigo-700",
  "from-emerald-500 to-teal-700",
  "from-violet-600 to-purple-800",
  "from-rose-500 to-pink-700",
  "from-amber-500 to-orange-600",
];

export default function ActivitySlider({ activities }) {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const total = activities.length;

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!isPlaying || total <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [isPlaying, next, total]);

  if (total === 0) return null;

  const slide = activities[current];
  const gradient = GRADIENT_FALLBACKS[current % GRADIENT_FALLBACKS.length];

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-2xl"
      style={{ aspectRatio: "16/7" }}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {activities.map((act, i) => {
        const grad = GRADIENT_FALLBACKS[i % GRADIENT_FALLBACKS.length];
        return (
          <div
            key={act.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              i === current ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            {act.image ? (
              <img
                src={getImageUrl(act.image)}
                alt={act.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${grad}`} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-navy mb-3">
                {act.status}
              </span>
              <h3 className="text-white text-xl sm:text-3xl font-bold leading-tight mb-2 max-w-2xl">
                {act.title}
              </h3>
              <p className="text-white/75 text-sm sm:text-base max-w-xl line-clamp-2">
                {act.text}
              </p>
            </div>
          </div>
        );
      })}

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white flex items-center justify-center transition-all"
            aria-label="Sebelumnya"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white flex items-center justify-center transition-all"
            aria-label="Berikutnya"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div className="absolute bottom-4 right-6 flex gap-1.5">
            {activities.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "bg-amber-400 w-6" : "bg-white/50 hover:bg-white/75 w-1.5"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
