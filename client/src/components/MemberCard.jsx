import { getImageUrl } from "../api";

export default function MemberCard({ member }) {
  return (
    <article className="member-card">
      <img src={getImageUrl(member.photo)} alt={member.name} />
      <div className="member-content">
        <p className="member-role">{member.role}</p>
        <h3>{member.name}</h3>
        <p className="member-quote">"{member.quote}"</p>
      </div>
    </article>
  );
}
