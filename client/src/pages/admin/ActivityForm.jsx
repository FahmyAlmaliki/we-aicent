import { useEffect, useRef, useState } from "react";
import { getImageUrl } from "../../api";
import { IconImage } from "../../components/Icons";

const emptyState = {
  title: "",
  status: "",
  text: "",
  photoFile: null,
  photoPreview: "",
};

export default function ActivityForm({ initialData, onCancel, onSubmit, loading }) {
  const [form, setForm] = useState(emptyState);
  const fileRef = useRef();

  useEffect(() => {
    setForm(
      initialData
        ? {
            title: initialData.title || "",
            status: initialData.status || "",
            text: initialData.text || "",
            photoFile: null,
            photoPreview: initialData.image ? getImageUrl(initialData.image) : "",
          }
        : emptyState
    );
  }, [initialData]);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, photoFile: file, photoPreview: URL.createObjectURL(file) }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const payload = new FormData();
    payload.append("title", form.title);
    payload.append("status", form.status);
    payload.append("text", form.text);
    if (form.photoFile) payload.append("image", form.photoFile);
    onSubmit(payload);
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Judul Kegiatan</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
          <input
            type="text"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            placeholder="Contoh: Workshop Inti, Upcoming, Selesai"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Deskripsi</label>
        <textarea
          rows="4"
          value={form.text}
          onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Gambar Slide <span className="text-slate-400 font-normal">(opsional, ditampilkan di slider beranda)</span>
        </label>
        <div
          className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center cursor-pointer hover:border-amber-400 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          {form.photoPreview ? (
            <img
              src={form.photoPreview}
              alt="Preview"
              className="h-32 mx-auto object-cover rounded-lg mb-2"
            />
          ) : (
            <div className="text-slate-400 text-sm">
              <div className="mb-2"><IconImage /></div>
              <p>Klik untuk pilih gambar</p>
              <p className="text-xs mt-1">JPG, PNG (rasio 16:9 disarankan untuk tampilan terbaik)</p>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        {form.photoPreview && (
          <button
            type="button"
            className="mt-2 text-xs text-red-500 hover:text-red-700"
            onClick={() => setForm((f) => ({ ...f, photoFile: null, photoPreview: "" }))}
          >
            Hapus gambar
          </button>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-slate-700 transition disabled:opacity-60"
        >
          {loading ? "Menyimpan..." : initialData ? "Update Kegiatan" : "Tambah Kegiatan"}
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
