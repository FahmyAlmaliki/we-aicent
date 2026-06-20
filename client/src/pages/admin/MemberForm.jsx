import { useEffect, useRef, useState } from "react";
import { apiFetch, getImageUrl } from "../../api";

const emptyState = { name: "", role: "", angkatan: "", quote: "", email: "", linkedin: "", github: "" };

export default function MemberForm({ initialData, onCancel, onSubmit, loading }) {
  const [form, setForm] = useState(emptyState);
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [angkatanList, setAngkatanList] = useState([]);
  const fileRef = useRef();

  useEffect(() => {
    apiFetch("/api/angkatan").then(setAngkatanList).catch(() => {});
  }, []);

  useEffect(() => {
    setForm(
      initialData
        ? {
            name: initialData.name || "",
            role: initialData.role || "",
            angkatan: initialData.angkatan || "",
            quote: initialData.quote || "",
            email: initialData.email || "",
            linkedin: initialData.linkedin || "",
            github: initialData.github || "",
          }
        : emptyState
    );
    setPhotoFile(null);
    setPreview(initialData?.photo ? getImageUrl(initialData.photo) : "");
  }, [initialData]);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({ ...form, photoFile });
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Nama & Jabatan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama</label>
          <input
            type="text"
            value={form.name}
            onChange={set("name")}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Jabatan</label>
          <input
            type="text"
            value={form.role}
            onChange={set("role")}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm"
            required
          />
        </div>
      </div>

      {/* Angkatan */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Angkatan / Kategori</label>
        <select
          value={form.angkatan}
          onChange={set("angkatan")}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm bg-white"
          required
        >
          <option value="">— Pilih Angkatan —</option>
          {angkatanList.map((a) => (
            <option key={a} value={a}>{a === "Dosen" ? "Dosen Pembimbing" : `Angkatan ${a}`}</option>
          ))}
        </select>
      </div>

      {/* Pesan */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Pesan Singkat</label>
        <textarea
          rows="3"
          value={form.quote}
          onChange={set("quote")}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm resize-none"
          required
        />
      </div>

      {/* Kontak opsional */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-3">
          Kontak <span className="text-slate-400 font-normal">(opsional)</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1.5">
              <span>✉️</span> Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="nama@email.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1.5">
              <span>💼</span> LinkedIn
            </label>
            <input
              type="url"
              value={form.linkedin}
              onChange={set("linkedin")}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1.5">
              <span>🐙</span> GitHub
            </label>
            <input
              type="url"
              value={form.github}
              onChange={set("github")}
              placeholder="https://github.com/..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm"
            />
          </div>
        </div>
      </div>

      {/* Foto */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Foto</label>
        <div className="flex items-center gap-4">
          {preview && (
            <img src={preview} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="px-4 py-2 rounded-xl border border-dashed border-slate-300 text-slate-500 hover:border-amber-400 hover:text-amber-600 text-sm transition"
          >
            {preview ? "Ganti Foto" : "Pilih Foto"}
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-slate-700 transition disabled:opacity-60"
        >
          {loading ? "Menyimpan..." : initialData ? "Update Anggota" : "Tambah Anggota"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
