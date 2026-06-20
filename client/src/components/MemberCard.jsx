import { getImageUrl } from "../api";

function IconEmail() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function MemberCard({ member }) {
  const hasContact = member.email || member.linkedin || member.github;

  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col">
      <div className="aspect-square overflow-hidden bg-slate-100">
        <img
          src={getImageUrl(member.photo)}
          alt={member.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-1">
          {member.role}
        </p>
        <h3 className="font-bold text-navy text-base mb-2">{member.name}</h3>
        <p className="text-slate-500 text-sm leading-relaxed italic flex-1">"{member.quote}"</p>

        {hasContact && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="p-2 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-500 hover:text-amber-600 transition-colors"
                title={member.email}
                aria-label="Email"
              >
                <IconEmail />
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <IconLinkedIn />
              </a>
            )}
            {member.github && (
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                title="GitHub"
                aria-label="GitHub"
              >
                <IconGitHub />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
