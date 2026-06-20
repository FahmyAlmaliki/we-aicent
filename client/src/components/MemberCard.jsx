import { getImageUrl } from "../api";
import { IconEnvelope, IconLinkedIn, IconGitHub, IconInstagram } from "./Icons";

export default function MemberCard({ member }) {
  const hasContact = member.email || member.linkedin || member.github || member.instagram;

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
                <IconEnvelope />
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
            {member.instagram && (
              <a
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-50 hover:bg-pink-50 text-slate-500 hover:text-pink-600 transition-colors"
                title="Instagram"
                aria-label="Instagram"
              >
                <IconInstagram />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
