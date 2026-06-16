import { useEffect, useState } from "react";
import { getImageUrl } from "../../api";

const emptyState = {
  name: "",
  role: "",
  quote: "",
};

export default function MemberForm({ initialData, onCancel, onSubmit, loading }) {
  const [form, setForm] = useState(emptyState);
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    setForm(
      initialData
        ? {
            name: initialData.name || "",
            role: initialData.role || "",
            quote: initialData.quote || "",
          }
        : emptyState
    );
    setPhotoFile(null);
  }, [initialData]);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({ ...form, photoFile });
  }

  return (
    <form className="member-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Nama
          <input
            type="text"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            required
          />
        </label>

        <label>
          Jabatan
          <input
            type="text"
            value={form.role}
            onChange={(event) =>
              setForm((current) => ({ ...current, role: event.target.value }))
            }
            required
          />
        </label>
      </div>

      <label>
        Pesan Singkat
        <textarea
          rows="4"
          value={form.quote}
          onChange={(event) =>
            setForm((current) => ({ ...current, quote: event.target.value }))
          }
          required
        />
      </label>

      <label>
        Foto
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setPhotoFile(event.target.files?.[0] || null)}
        />
      </label>

      {initialData?.photo ? (
        <img
          className="form-preview"
          src={getImageUrl(initialData.photo)}
          alt={initialData.name}
        />
      ) : null}

      <div className="form-actions">
        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? "Menyimpan..." : initialData ? "Update Anggota" : "Tambah Anggota"}
        </button>
        <button type="button" className="button-secondary" onClick={onCancel}>
          Batal
        </button>
      </div>
    </form>
  );
}
