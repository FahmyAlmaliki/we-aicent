import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiFetch } from "../../api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiFetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      localStorage.setItem("adminToken", data.token);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Admin Login</p>
        <h2>Masuk ke dashboard</h2>
        <Link to="/" className="button-secondary auth-home-link">
          Home
        </Link>
        <label>
          Username
          <input
            type="text"
            value={form.username}
            onChange={(event) =>
              setForm((current) => ({ ...current, username: event.target.value }))
            }
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            required
          />
        </label>
        {error ? <p className="status-box error">{error}</p> : null}
        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? "Memproses..." : "Login"}
        </button>
      </form>
    </div>
  );
}
