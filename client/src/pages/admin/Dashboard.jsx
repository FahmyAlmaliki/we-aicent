import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, getImageUrl } from "../../api";
import ActivityForm from "./ActivityForm";
import MemberForm from "./MemberForm";
import { IconX, IconMountain, IconClipboard, IconPeople, IconEnvelope, IconLinkedIn, IconGitHub, IconInstagram } from "../../components/Icons";

export default function Dashboard() {
  const [members, setMembers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [angkatanList, setAngkatanList] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [newAngkatan, setNewAngkatan] = useState("");
  const [savingAngkatan, setSavingAngkatan] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingMember, setSavingMember] = useState(false);
  const [savingActivity, setSavingActivity] = useState(false);
  const [error, setError] = useState("");
  const [logo, setLogo] = useState("");
  const [savingLogo, setSavingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const logoInputRef = useRef(null);
  const [heroBg, setHeroBg] = useState("");
  const [savingHeroBg, setSavingHeroBg] = useState(false);
  const [heroBgPreview, setHeroBgPreview] = useState(null);
  const heroBgInputRef = useRef(null);
  const navigate = useNavigate();

  async function loadData() {
    try {
      setLoading(true);
      const [memberData, activityData, angkatanData, configData] = await Promise.all([
        apiFetch("/api/members"),
        apiFetch("/api/activities"),
        apiFetch("/api/angkatan"),
        apiFetch("/api/config"),
      ]);
      setMembers(memberData);
      setActivities(activityData);
      setAngkatanList(angkatanData);
      setLogo(configData.logo || "");
      setHeroBg(configData.heroBg || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  function handleLogoFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
  }

  async function handleLogoUpload() {
    const file = logoInputRef.current?.files[0];
    if (!file) return;
    try {
      setSavingLogo(true);
      const formData = new FormData();
      formData.append("logo", file);
      const result = await apiFetch("/api/admin/logo", { method: "POST", body: formData });
      setLogo(result.logo);
      setLogoPreview(null);
      if (logoInputRef.current) logoInputRef.current.value = "";
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingLogo(false);
    }
  }

  async function handleHeroBgUpload() {
    const file = heroBgInputRef.current?.files[0];
    if (!file) return;
    try {
      setSavingHeroBg(true);
      const formData = new FormData();
      formData.append("heroBg", file);
      const result = await apiFetch("/api/admin/hero-bg", { method: "POST", body: formData });
      setHeroBg(result.heroBg);
      setHeroBgPreview(null);
      if (heroBgInputRef.current) heroBgInputRef.current.value = "";
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingHeroBg(false);
    }
  }

  async function handleHeroBgDelete() {
    if (!window.confirm("Hapus background hero? Hero akan kembali menggunakan gradasi bawaan.")) return;
    try {
      const result = await apiFetch("/api/admin/hero-bg", { method: "DELETE" });
      setHeroBg(result.heroBg);
      setHeroBgPreview(null);
      if (heroBgInputRef.current) heroBgInputRef.current.value = "";
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleLogoDelete() {
    if (!window.confirm("Hapus logo? Website akan kembali menggunakan ikon default.")) return;
    try {
      const result = await apiFetch("/api/admin/logo", { method: "DELETE" });
      setLogo(result.logo);
      setLogoPreview(null);
      if (logoInputRef.current) logoInputRef.current.value = "";
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAngkatanAdd(e) {
    e.preventDefault();
    if (!newAngkatan.trim()) return;
    try {
      setSavingAngkatan(true);
      const updated = await apiFetch("/api/admin/angkatan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama: newAngkatan.trim() }),
      });
      setAngkatanList(updated);
      setNewAngkatan("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingAngkatan(false);
    }
  }

  async function handleAngkatanDelete(nama) {
    if (!window.confirm(`Hapus angkatan "${nama}"? Anggota yang terdaftar di angkatan ini tidak akan terhapus.`)) return;
    try {
      const updated = await apiFetch(`/api/admin/angkatan/${encodeURIComponent(nama)}`, { method: "DELETE" });
      setAngkatanList(updated);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleMemberSubmit(formData) {
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("role", formData.role);
    payload.append("angkatan", formData.angkatan || "");
    payload.append("quote", formData.quote);
    payload.append("email", formData.email || "");
    payload.append("linkedin", formData.linkedin || "");
    payload.append("github", formData.github || "");
    payload.append("instagram", formData.instagram || "");
    if (formData.photoFile) payload.append("photo", formData.photoFile);

    try {
      setSavingMember(true);
      if (selectedMember) {
        await apiFetch(`/api/admin/members/${selectedMember.id}`, { method: "PUT", body: payload });
      } else {
        await apiFetch("/api/admin/members", { method: "POST", body: payload });
      }
      setShowMemberForm(false);
      setSelectedMember(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingMember(false);
    }
  }

  async function handleMemberDelete(id) {
    if (!window.confirm("Hapus anggota ini?")) return;
    try {
      await apiFetch(`/api/admin/members/${id}`, { method: "DELETE" });
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleActivitySubmit(payload) {
    try {
      setSavingActivity(true);
      if (selectedActivity) {
        await apiFetch(`/api/admin/activities/${selectedActivity.id}`, { method: "PUT", body: payload });
      } else {
        await apiFetch("/api/admin/activities", { method: "POST", body: payload });
      }
      setShowActivityForm(false);
      setSelectedActivity(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingActivity(false);
    }
  }

  async function handleActivityDelete(id) {
    if (!window.confirm("Hapus kegiatan ini?")) return;
    try {
      await apiFetch(`/api/admin/activities/${id}`, { method: "DELETE" });
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-navy text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center font-extrabold text-navy text-xs">
              AI
            </div>
            <span className="font-bold text-sm">Dashboard Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setSelectedMember(null); setShowMemberForm(true); }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition"
            >
              + Anggota
            </button>
            <button
              type="button"
              onClick={() => { setSelectedActivity(null); setShowActivityForm(true); }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-navy text-xs font-semibold transition"
            >
              + Kegiatan
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm flex items-center justify-between">
            {error}
            <button type="button" onClick={() => setError("")} className="text-red-400 hover:text-red-600 ml-4"><IconX /></button>
          </div>
        )}

        {/* Mobile buttons */}
        <div className="flex sm:hidden gap-3">
          <button
            type="button"
            onClick={() => { setSelectedMember(null); setShowMemberForm(true); }}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
          >
            + Anggota
          </button>
          <button
            type="button"
            onClick={() => { setSelectedActivity(null); setShowActivityForm(true); }}
            className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-navy text-sm font-semibold transition"
          >
            + Kegiatan
          </button>
        </div>

        {/* Logo Management */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <p className="text-xs font-semibold tracking-widest uppercase text-purple-600">Logo Website</p>
            <h3 className="font-bold text-navy">Kelola Logo</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Preview */}
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs text-slate-400 font-medium">Logo saat ini</p>
                <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Preview" className="w-full h-full object-contain p-2" />
                  ) : logo ? (
                    <img src={getImageUrl(logo)} alt="Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center font-extrabold text-navy text-lg">
                      AI
                    </div>
                  )}
                </div>
                {logoPreview && (
                  <span className="text-xs text-amber-600 font-medium">Preview — belum disimpan</span>
                )}
              </div>

              {/* Upload form */}
              <div className="flex-1 space-y-3">
                <p className="text-sm text-slate-500">
                  Upload gambar logo (PNG/SVG transparan disarankan). Logo akan tampil di navbar dan footer website.
                </p>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition cursor-pointer"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleLogoUpload}
                    disabled={savingLogo || !logoPreview}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition disabled:opacity-40"
                  >
                    {savingLogo ? "Menyimpan..." : "Simpan Logo"}
                  </button>
                  {logo && (
                    <button
                      type="button"
                      onClick={handleLogoDelete}
                      className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium transition"
                    >
                      Hapus Logo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Background Management */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <p className="text-xs font-semibold tracking-widest uppercase text-purple-600">Hero Background</p>
            <h3 className="font-bold text-navy">Kelola Background Halaman Utama</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs text-slate-400 font-medium">Background saat ini</p>
                <div className="w-48 h-32 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                  {heroBgPreview ? (
                    <img src={heroBgPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : heroBg ? (
                    <img src={getImageUrl(heroBg)} alt="Hero BG" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-300 text-xs">
                      <IconMountain />
                      <span>Gradasi bawaan</span>
                    </div>
                  )}
                </div>
                {heroBgPreview && (
                  <span className="text-xs text-amber-600 font-medium">Preview — belum disimpan</span>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <p className="text-sm text-slate-500">
                  Upload gambar background untuk hero section (16:9 landscape recommended). Background akan tampil di halaman utama website.
                </p>
                <input
                  ref={heroBgInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setHeroBgPreview(URL.createObjectURL(file));
                  }}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition cursor-pointer"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleHeroBgUpload}
                    disabled={savingHeroBg || !heroBgPreview}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition disabled:opacity-40"
                  >
                    {savingHeroBg ? "Menyimpan..." : "Simpan Background"}
                  </button>
                  {heroBg && (
                    <button
                      type="button"
                      onClick={handleHeroBgDelete}
                      className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium transition"
                    >
                      Hapus Background
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Angkatan Management */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <p className="text-xs font-semibold tracking-widest uppercase text-green-600">Angkatan</p>
            <h3 className="font-bold text-navy">Kelola Section Angkatan</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {angkatanList.length === 0 && (
                <p className="text-sm text-slate-400">Belum ada angkatan. Tambahkan di bawah.</p>
              )}
              {angkatanList.map((a) => (
                <div key={a} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
                  <span>{a === "Dosen" ? "Dosen Pembimbing" : `Angkatan ${a}`}</span>
                  <button
                    type="button"
                    onClick={() => handleAngkatanDelete(a)}
                    className="text-slate-400 hover:text-red-500 transition ml-1"
                    title="Hapus angkatan"
                  >
                    <IconX />
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={handleAngkatanAdd} className="flex gap-2 items-center">
              <input
                type="text"
                value={newAngkatan}
                onChange={(e) => setNewAngkatan(e.target.value)}
                placeholder="Contoh: 2024 atau Dosen"
                className="px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition text-sm flex-1 max-w-xs"
              />
              <button
                type="submit"
                disabled={savingAngkatan || !newAngkatan.trim()}
                className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition disabled:opacity-50"
              >
                + Tambah Angkatan
              </button>
            </form>
            <p className="text-xs text-slate-400 mt-2">
              Isi tahun (contoh: 2025) untuk angkatan mahasiswa, atau "Dosen" untuk dosen pembimbing. Angkatan termuda otomatis tampil paling atas di halaman Tim.
            </p>
          </div>
        </div>

        {/* Member Form */}
        {showMemberForm && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-1">Form Anggota</p>
            <h3 className="font-bold text-navy text-lg mb-5">
              {selectedMember ? "Edit Anggota" : "Tambah Anggota Baru"}
            </h3>
            <MemberForm
              initialData={selectedMember}
              onCancel={() => { setShowMemberForm(false); setSelectedMember(null); }}
              onSubmit={handleMemberSubmit}
              loading={savingMember}
            />
          </div>
        )}

        {/* Activity Form */}
        {showActivityForm && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-1">Form Kegiatan</p>
            <h3 className="font-bold text-navy text-lg mb-5">
              {selectedActivity ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}
            </h3>
            <ActivityForm
              initialData={selectedActivity}
              onCancel={() => { setShowActivityForm(false); setSelectedActivity(null); }}
              onSubmit={handleActivitySubmit}
              loading={savingActivity}
            />
          </div>
        )}

        {/* Activities Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-amber-600">Kegiatan</p>
              <h3 className="font-bold text-navy">Daftar Workshop & Aktivitas ({activities.length})</h3>
            </div>
            <button
              type="button"
              onClick={() => { setSelectedActivity(null); setShowActivityForm(true); }}
              className="px-4 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold transition"
            >
              + Tambah
            </button>
          </div>
          {loading ? (
            <div className="p-6 text-slate-400 text-sm text-center">Memuat data...</div>
          ) : activities.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              <div className="mb-3 text-slate-300"><IconClipboard /></div>
              <p className="text-sm">Belum ada kegiatan. Tambahkan sekarang.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Gambar</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Judul</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Deskripsi</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                      <td className="px-6 py-3">
                        {activity.image ? (
                          <img
                            src={getImageUrl(activity.image)}
                            alt={activity.title}
                            className="w-16 h-10 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300 text-xs">
                            No img
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-3 font-medium text-navy">{activity.title}</td>
                      <td className="px-6 py-3 hidden sm:table-cell">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-500 hidden md:table-cell max-w-xs">
                        <p className="truncate">{activity.text}</p>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => { setSelectedActivity(activity); setShowActivityForm(true); }}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleActivityDelete(activity.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-blue-600">Anggota</p>
              <h3 className="font-bold text-navy">Daftar Anggota Tim ({members.length})</h3>
            </div>
            <button
              type="button"
              onClick={() => { setSelectedMember(null); setShowMemberForm(true); }}
              className="px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition"
            >
              + Tambah
            </button>
          </div>
          {loading ? (
            <div className="p-6 text-slate-400 text-sm text-center">Memuat data...</div>
          ) : members.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              <div className="mb-3 text-slate-300"><IconPeople /></div>
              <p className="text-sm">Belum ada anggota. Tambahkan sekarang.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Foto</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Nama</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Jabatan</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Angkatan</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Kontak</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                      <td className="px-6 py-3">
                        <img
                          src={getImageUrl(member.photo)}
                          alt={member.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                      </td>
                      <td className="px-6 py-3 font-medium text-navy">{member.name}</td>
                      <td className="px-6 py-3 text-slate-500 hidden sm:table-cell">{member.role}</td>
                      <td className="px-6 py-3 hidden md:table-cell">
                        {member.angkatan ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {member.angkatan === "Dosen" ? "Dosen" : member.angkatan}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-6 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          {member.email && (
                            <a href={`mailto:${member.email}`} className="text-slate-400 hover:text-amber-600 transition-colors" title={member.email}>
                              <IconEnvelope />
                            </a>
                          )}
                          {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors" title="LinkedIn">
                              <IconLinkedIn />
                            </a>
                          )}
                          {member.github && (
                            <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-800 transition-colors" title="GitHub">
                              <IconGitHub />
                            </a>
                          )}
                          {member.instagram && (
                            <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-600 transition-colors" title="Instagram">
                              <IconInstagram />
                            </a>
                          )}
                          {!member.email && !member.linkedin && !member.github && !member.instagram && (
                            <span className="text-xs text-slate-300">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => { setSelectedMember(member); setShowMemberForm(true); }}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMemberDelete(member.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
