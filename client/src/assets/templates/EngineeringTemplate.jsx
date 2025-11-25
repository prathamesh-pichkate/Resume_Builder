import { Mail, Phone, MapPin, Linkedin, Globe, Github } from "lucide-react";

const EngineeringTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="max-w-[21cm] mx-auto bg-white text-gray-900 p-8 leading-tight text-[10pt]">
      {/* Header with Name and Contact */}
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-center mb-2">
          {data.personal_info?.full_name || "Your Name"}
        </h1>

        {/* Contact Info - Centered, Pipe Separated */}
        <div className="flex flex-wrap justify-center items-center gap-x-2 text-xs text-gray-700">
          {data.personal_info?.location && (
            <>
              <span>{data.personal_info.location}</span>
              <span>|</span>
            </>
          )}
          {data.personal_info?.email && (
            <>
              <span>{data.personal_info.email}</span>
              <span>|</span>
            </>
          )}
          {data.personal_info?.phone && (
            <>
              <span>{data.personal_info.phone}</span>
              <span>|</span>
            </>
          )}
          {data.personal_info?.website && (
            <>
              <a
                href={data.personal_info.website}
                className="text-blue-600 hover:underline"
              >
                Portfolio
              </a>
              <span>|</span>
            </>
          )}
          {data.personal_info?.linkedin && (
            <>
              <a
                href={data.personal_info.linkedin}
                className="text-blue-600 hover:underline"
              >
                LinkedIn
              </a>
              <span>|</span>
            </>
          )}
          {data.personal_info?.github && (
            <a
              href={data.personal_info.github}
              className="text-blue-600 hover:underline"
            >
              GitHub
            </a>
          )}
        </div>
      </header>

      <hr className="border-t border-gray-300 mb-3" />

      {/* Summary Section */}
      {data.professional_summary && (
        <section className="mb-4">
          <h2
            className="text-sm font-bold mb-1.5"
            style={{ color: accentColor }}
          >
            Summary
          </h2>
          <p className="text-xs leading-relaxed text-gray-800">
            {data.professional_summary}
          </p>
        </section>
      )}

      {/* Education Section */}
      {data.education && data.education.length > 0 && (
        <section className="mb-4">
          <h2
            className="text-sm font-bold mb-1.5"
            style={{ color: accentColor }}
          >
            Education
          </h2>
          <div className="space-y-2">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-semibold text-xs">
                      {edu.institution}
                    </span>
                    <span className="text-xs">, {edu.degree}</span>
                    {edu.field && (
                      <span className="text-xs"> in {edu.field}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-600 italic">
                    {formatDate(edu.graduation_date)}
                  </span>
                </div>
                {edu.gpa && (
                  <div className="text-xs text-gray-700 ml-1">
                    • GPA: {edu.gpa}/10
                  </div>
                )}
                {edu.coursework && (
                  <div className="text-xs text-gray-700 ml-1">
                    • Coursework: {edu.coursework}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-4">
          <h2
            className="text-sm font-bold mb-1.5"
            style={{ color: accentColor }}
          >
            Experience
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <div>
                    <span className="font-semibold text-xs">
                      {exp.position}
                    </span>
                    <span className="text-xs">, {exp.company}</span>
                    {exp.location && (
                      <span className="text-xs"> – {exp.location}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-600 italic whitespace-nowrap">
                    {formatDate(exp.start_date)} –{" "}
                    {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                {exp.description && (
                  <ul className="list-none text-xs text-gray-800 space-y-0.5 ml-1">
                    {exp.description
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((line, i) => (
                        <li key={i} className="leading-relaxed">
                          • {line.trim().replace(/^[•\-*]\s*/, "")}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {data.project && data.project.length > 0 && (
        <section className="mb-4">
          <h2
            className="text-sm font-bold mb-1.5"
            style={{ color: accentColor }}
          >
            Projects
          </h2>
          <div className="space-y-3">
            {data.project.map((proj, index) => (
              <div key={index}>
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="font-semibold text-xs">{proj.name}</span>
                  {proj.github && (
                    <>
                      <span className="text-xs">§</span>
                      <a
                        href={proj.github}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Github
                      </a>
                    </>
                  )}
                  {proj.live && (
                    <a
                      href={proj.live}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Live
                    </a>
                  )}
                </div>
                {proj.description && (
                  <ul className="list-none text-xs text-gray-800 space-y-0.5 ml-1">
                    {proj.description
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((line, i) => (
                        <li key={i} className="leading-relaxed">
                          • {line.trim().replace(/^[•\-*]\s*/, "")}
                        </li>
                      ))}
                  </ul>
                )}
                {proj.tools && (
                  <div className="text-xs text-gray-700 ml-1 mt-0.5">
                    • <span className="font-medium">Tools Used:</span>{" "}
                    {proj.tools}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technologies/Skills Section */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-4">
          <h2
            className="text-sm font-bold mb-1.5"
            style={{ color: accentColor }}
          >
            Technologies
          </h2>
          <p className="text-xs text-gray-800 leading-relaxed">
            {data.skills.join(", ")}
          </p>
        </section>
      )}

      {/* Achievements & Certifications Section */}
      {data.achievements && data.achievements.length > 0 && (
        <section className="mb-4">
          <h2
            className="text-sm font-bold mb-1.5"
            style={{ color: accentColor }}
          >
            Achievements & Certifications
          </h2>
          <ul className="list-none text-xs text-gray-800 space-y-0.5">
            {data.achievements.map((achievement, index) => (
              <li key={index} className="leading-relaxed ml-1">
                • {achievement}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default EngineeringTemplate;
