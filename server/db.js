import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "data");
const membersFile = path.join(dataDir, "members.json");
const activitiesFile = path.join(dataDir, "activities.json");
const angkatanFile = path.join(dataDir, "angkatan.json");
const configFile = path.join(dataDir, "config.json");

async function readJson(file, defaultValue) {
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.mkdir(dataDir, { recursive: true });
      await fs.writeFile(file, JSON.stringify(defaultValue, null, 2));
      return defaultValue;
    }
    throw err;
  }
}

export async function readMembers() {
  return readJson(membersFile, []);
}

export async function writeMembers(members) {
  await fs.writeFile(membersFile, JSON.stringify(members, null, 2));
}

export async function readActivities() {
  return readJson(activitiesFile, []);
}

export async function writeActivities(activities) {
  await fs.writeFile(activitiesFile, JSON.stringify(activities, null, 2));
}

export async function readAngkatan() {
  return readJson(angkatanFile, []);
}

export async function writeAngkatan(angkatan) {
  await fs.writeFile(angkatanFile, JSON.stringify(angkatan, null, 2));
}

export async function readConfig() {
  return readJson(configFile, { logo: "" });
}

export async function writeConfig(config) {
  await fs.writeFile(configFile, JSON.stringify(config, null, 2));
}
