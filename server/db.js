import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const membersFile = path.join(__dirname, "data", "members.json");
const activitiesFile = path.join(__dirname, "data", "activities.json");

export async function readMembers() {
  const raw = await fs.readFile(membersFile, "utf-8");
  return JSON.parse(raw);
}

export async function writeMembers(members) {
  await fs.writeFile(membersFile, JSON.stringify(members, null, 2));
}

export async function readActivities() {
  const raw = await fs.readFile(activitiesFile, "utf-8");
  return JSON.parse(raw);
}

export async function writeActivities(activities) {
  await fs.writeFile(activitiesFile, JSON.stringify(activities, null, 2));
}
