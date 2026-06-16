import { useEffect, useState } from "react";

const emptyState = {
  title: "",
  status: "",
  text: "",
};

export default function ActivityForm({ initialData, onCancel, onSubmit, loading }) {
  const [form, setForm] = useState(emptyState);

  useEffect(() => {
    setForm(
      initialData
        ? {
            title: initialData.title || "",
            status: initialData.status || "",
            text: initialData.text || "",
          }
        : emptyState
    );
  }, [initialData]);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form className="member-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Judul Kegiatan
          <input
            type="text"
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            required
          />
        </label>

        <label>
          Status
          <input
            type="text"
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({ ...current, status: event.target.value }))
            }
            placeholder="Contoh: Workshop Inti"
            required
          />
        </label>
      </div>

      <label>
        Deskripsi
        <textarea
          rows="4"
          value={form.text}
          onChange={(event) =>
            setForm((current) => ({ ...current, text: event.target.value }))
          }
          required
        />
      </label>

      <div className="form-actions">
        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? "Menyimpan..." : initialData ? "Update Kegiatan" : "Tambah Kegiatan"}
        </button>
        <button type="button" className="button-secondary" onClick={onCancel}>
          Batal
        </button>
      </div>
    </form>
  );
}
