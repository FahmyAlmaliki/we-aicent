import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, getImageUrl } from "../../api";
import ActivityForm from "./ActivityForm";
import MemberForm from "./MemberForm";

export default function Dashboard() {
  const [members, setMembers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingMember, setSavingMember] = useState(false);
  const [savingActivity, setSavingActivity] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function loadData() {
    try {
      setLoading(true);
      const [memberData, activityData] = await Promise.all([
        apiFetch("/api/members"),
        apiFetch("/api/activities"),
      ]);
      setMembers(memberData);
      setActivities(activityData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleMemberSubmit(formData) {
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("role", formData.role);
    payload.append("quote", formData.quote);

    if (formData.photoFile) {
      payload.append("photo", formData.photoFile);
    }

    try {
      setSavingMember(true);

      if (selectedMember) {
        await apiFetch(`/api/admin/members/${selectedMember.id}`, {
          method: "PUT",
          body: payload,
        });
      } else {
        await apiFetch("/api/admin/members", {
          method: "POST",
          body: payload,
        });
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
    const confirmed = window.confirm("Hapus anggota ini?");
    if (!confirmed) {
      return;
    }

    try {
      await apiFetch(`/api/admin/members/${id}`, { method: "DELETE" });
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleActivitySubmit(formData) {
    try {
      setSavingActivity(true);

      if (selectedActivity) {
        await apiFetch(`/api/admin/activities/${selectedActivity.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
      } else {
        await apiFetch("/api/admin/activities", {
          method: "POST",
          body: JSON.stringify(formData),
        });
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
    const confirmed = window.confirm("Hapus kegiatan ini?");
    if (!confirmed) {
      return;
    }

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
    <div className="dashboard-shell">
      <div className="dashboard-topbar">
        <div>
          <p className="eyebrow">Dashboard Admin</p>
          <h2>Kelola anggota dan kegiatan AI Center UB</h2>
        </div>
        <div className="dashboard-actions">
          <button
            type="button"
            className="button-primary"
            onClick={() => {
              setSelectedMember(null);
              setShowMemberForm(true);
            }}
          >
            Tambah Anggota
          </button>
          <button
            type="button"
            className="button-secondary"
            onClick={() => {
              setSelectedActivity(null);
              setShowActivityForm(true);
            }}
          >
            Tambah Kegiatan
          </button>
          <button type="button" className="button-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {error ? <p className="status-box error">{error}</p> : null}

      {showMemberForm ? (
        <section className="dashboard-panel">
          <div className="dashboard-section-title">
            <p className="eyebrow">Form Anggota</p>
            <h3>{selectedMember ? "Edit anggota" : "Tambah anggota baru"}</h3>
          </div>
          <MemberForm
            initialData={selectedMember}
            onCancel={() => {
              setShowMemberForm(false);
              setSelectedMember(null);
            }}
            onSubmit={handleMemberSubmit}
            loading={savingMember}
          />
        </section>
      ) : null}

      {showActivityForm ? (
        <section className="dashboard-panel">
          <div className="dashboard-section-title">
            <p className="eyebrow">Form Kegiatan</p>
            <h3>{selectedActivity ? "Edit kegiatan" : "Tambah kegiatan baru"}</h3>
          </div>
          <ActivityForm
            initialData={selectedActivity}
            onCancel={() => {
              setShowActivityForm(false);
              setSelectedActivity(null);
            }}
            onSubmit={handleActivitySubmit}
            loading={savingActivity}
          />
        </section>
      ) : null}

      <section className="dashboard-panel">
        <div className="dashboard-section-title">
          <p className="eyebrow">Anggota Tim</p>
          <h3>Daftar anggota</h3>
        </div>
        {loading ? (
          <p className="status-box">Memuat daftar anggota...</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nama</th>
                  <th>Jabatan</th>
                  <th>Pesan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan="5">Belum ada anggota. Tambahkan data pertama dari dashboard admin.</td>
                  </tr>
                ) : (
                  members.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <img
                          className="table-avatar"
                          src={getImageUrl(member.photo)}
                          alt={member.name}
                        />
                      </td>
                      <td>{member.name}</td>
                      <td>{member.role}</td>
                      <td>{member.quote}</td>
                      <td className="action-row">
                        <button
                          type="button"
                          className="button-secondary"
                          onClick={() => {
                            setSelectedMember(member);
                            setShowMemberForm(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="button-danger"
                          onClick={() => handleMemberDelete(member.id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-section-title">
          <p className="eyebrow">Kegiatan</p>
          <h3>Daftar workshop dan aktivitas</h3>
        </div>
        {loading ? (
          <p className="status-box">Memuat daftar kegiatan...</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Status</th>
                  <th>Deskripsi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan="4">Belum ada kegiatan. Tambahkan data pertama dari dashboard admin.</td>
                  </tr>
                ) : (
                  activities.map((activity) => (
                    <tr key={activity.id}>
                      <td>{activity.title}</td>
                      <td>{activity.status}</td>
                      <td>{activity.text}</td>
                      <td className="action-row">
                        <button
                          type="button"
                          className="button-secondary"
                          onClick={() => {
                            setSelectedActivity(activity);
                            setShowActivityForm(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="button-danger"
                          onClick={() => handleActivityDelete(activity.id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
