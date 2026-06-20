import { Router } from "express";
import { promises as fs } from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import {
  readActivities,
  readAngkatan,
  readConfig,
  readMembers,
  writeActivities,
  writeAngkatan,
  writeConfig,
  writeMembers,
} from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "..", "uploads");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    const sanitizedBase = path
      .basename(file.originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    cb(null, `${Date.now()}-${sanitizedBase || "member"}${extension}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("File harus berupa gambar."));
      return;
    }

    cb(null, true);
  },
});

const router = Router();

router.get("/members", async (_req, res, next) => {
  try {
    const members = await readMembers();
    res.json(members);
  } catch (error) {
    next(error);
  }
});

router.get("/activities", async (_req, res, next) => {
  try {
    const activities = await readActivities();
    res.json(activities);
  } catch (error) {
    next(error);
  }
});

router.get("/angkatan", async (_req, res, next) => {
  try {
    const angkatan = await readAngkatan();
    res.json(angkatan);
  } catch (error) {
    next(error);
  }
});

router.get("/config", async (_req, res, next) => {
  try {
    const config = await readConfig();
    res.json(config);
  } catch (error) {
    next(error);
  }
});

router.post("/admin/logo", requireAuth, upload.single("logo"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File logo wajib diupload." });
    }
    const config = await readConfig();
    if (config.logo?.startsWith("/uploads/")) {
      const prev = path.join(uploadsDir, path.basename(config.logo));
      await fs.rm(prev, { force: true });
    }
    config.logo = `/uploads/${req.file.filename}`;
    await writeConfig(config);
    return res.json(config);
  } catch (error) {
    next(error);
  }
});

router.delete("/admin/logo", requireAuth, async (req, res, next) => {
  try {
    const config = await readConfig();
    if (config.logo?.startsWith("/uploads/")) {
      const prev = path.join(uploadsDir, path.basename(config.logo));
      await fs.rm(prev, { force: true });
    }
    config.logo = "";
    await writeConfig(config);
    return res.json(config);
  } catch (error) {
    next(error);
  }
});

router.post("/admin/angkatan", requireAuth, async (req, res, next) => {
  try {
    const { nama } = req.body;
    if (!nama || !nama.trim()) {
      return res.status(400).json({ message: "Nama angkatan wajib diisi." });
    }
    const angkatan = await readAngkatan();
    const trimmed = nama.trim();
    if (angkatan.includes(trimmed)) {
      return res.status(400).json({ message: "Angkatan sudah ada." });
    }
    angkatan.push(trimmed);
    await writeAngkatan(angkatan);
    return res.status(201).json(angkatan);
  } catch (error) {
    next(error);
  }
});

router.delete("/admin/angkatan/:nama", requireAuth, async (req, res, next) => {
  try {
    const nama = decodeURIComponent(req.params.nama);
    const angkatan = await readAngkatan();
    const filtered = angkatan.filter((a) => a !== nama);
    if (filtered.length === angkatan.length) {
      return res.status(404).json({ message: "Angkatan tidak ditemukan." });
    }
    await writeAngkatan(filtered);
    return res.json(filtered);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/admin/members",
  requireAuth,
  upload.single("photo"),
  async (req, res, next) => {
    try {
      const { name, role, angkatan, quote, email, linkedin, github } = req.body;

      if (!name || !role || !quote) {
        return res.status(400).json({ message: "Nama, jabatan, dan pesan wajib diisi." });
      }

      const members = await readMembers();
      const now = new Date().toISOString();
      const member = {
        id: crypto.randomUUID(),
        name,
        role,
        angkatan: angkatan || "",
        quote,
        email: email || "",
        linkedin: linkedin || "",
        github: github || "",
        photo: req.file ? `/uploads/${req.file.filename}` : "",
        createdAt: now,
        updatedAt: now,
      };

      members.unshift(member);
      await writeMembers(members);

      return res.status(201).json(member);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/admin/members/:id",
  requireAuth,
  upload.single("photo"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, role, angkatan, quote, email, linkedin, github } = req.body;
      const members = await readMembers();
      const memberIndex = members.findIndex((member) => member.id === id);

      if (memberIndex === -1) {
        return res.status(404).json({ message: "Anggota tidak ditemukan." });
      }

      const currentMember = members[memberIndex];

      if (req.file && currentMember.photo?.startsWith("/uploads/")) {
        const previousPath = path.join(uploadsDir, path.basename(currentMember.photo));
        await fs.rm(previousPath, { force: true });
      }

      const updatedMember = {
        ...currentMember,
        name: name || currentMember.name,
        role: role || currentMember.role,
        angkatan: angkatan !== undefined ? angkatan : currentMember.angkatan ?? "",
        quote: quote || currentMember.quote,
        email: email !== undefined ? email : currentMember.email ?? "",
        linkedin: linkedin !== undefined ? linkedin : currentMember.linkedin ?? "",
        github: github !== undefined ? github : currentMember.github ?? "",
        photo: req.file ? `/uploads/${req.file.filename}` : currentMember.photo,
        updatedAt: new Date().toISOString(),
      };

      members[memberIndex] = updatedMember;
      await writeMembers(members);

      return res.json(updatedMember);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/admin/members/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const members = await readMembers();
    const member = members.find((item) => item.id === id);

    if (!member) {
      return res.status(404).json({ message: "Anggota tidak ditemukan." });
    }

    if (member.photo?.startsWith("/uploads/")) {
      const photoPath = path.join(uploadsDir, path.basename(member.photo));
      await fs.rm(photoPath, { force: true });
    }

    const filteredMembers = members.filter((item) => item.id !== id);
    await writeMembers(filteredMembers);

    return res.json({ message: "Anggota berhasil dihapus." });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/admin/activities",
  requireAuth,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const { title, status, text } = req.body;

      if (!title || !status || !text) {
        return res.status(400).json({ message: "Judul, status, dan deskripsi wajib diisi." });
      }

      const activities = await readActivities();
      const now = new Date().toISOString();
      const activity = {
        id: crypto.randomUUID(),
        title,
        status,
        text,
        image: req.file ? `/uploads/${req.file.filename}` : "",
        createdAt: now,
        updatedAt: now,
      };

      activities.unshift(activity);
      await writeActivities(activities);

      return res.status(201).json(activity);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/admin/activities/:id",
  requireAuth,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, status, text } = req.body;
      const activities = await readActivities();
      const activityIndex = activities.findIndex((activity) => activity.id === id);

      if (activityIndex === -1) {
        return res.status(404).json({ message: "Kegiatan tidak ditemukan." });
      }

      const currentActivity = activities[activityIndex];

      if (req.file && currentActivity.image?.startsWith("/uploads/")) {
        const previousPath = path.join(uploadsDir, path.basename(currentActivity.image));
        await fs.rm(previousPath, { force: true });
      }

      const updatedActivity = {
        ...currentActivity,
        title: title || currentActivity.title,
        status: status || currentActivity.status,
        text: text || currentActivity.text,
        image: req.file ? `/uploads/${req.file.filename}` : currentActivity.image,
        updatedAt: new Date().toISOString(),
      };

      activities[activityIndex] = updatedActivity;
      await writeActivities(activities);

      return res.json(updatedActivity);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/admin/activities/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const activities = await readActivities();
    const activity = activities.find((item) => item.id === id);

    if (!activity) {
      return res.status(404).json({ message: "Kegiatan tidak ditemukan." });
    }

    if (activity.image?.startsWith("/uploads/")) {
      const imagePath = path.join(uploadsDir, path.basename(activity.image));
      await fs.rm(imagePath, { force: true });
    }

    const filteredActivities = activities.filter((item) => item.id !== id);
    await writeActivities(filteredActivities);

    return res.json({ message: "Kegiatan berhasil dihapus." });
  } catch (error) {
    next(error);
  }
});

export default router;
