import React from "react";
import ModernTemplate from "../assets/templates/ModernTemplate";
import MinimalTemplate from "../assets/templates/MinimalTemplate";
import MinimalImageTemplate from "../assets/templates/MinimalImageTemplate";
import ClassicTemplate from "../assets/templates/ClassicTemplate";

const ResumePreview = ({
  id = "resume-preview",
  data,
  template,
  accentColor,
  classes = "",
}) => {
  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} accentColor={accentColor} />;
      case "minimal":
        return <MinimalTemplate data={data} accentColor={accentColor} />;
      case "minimal-image":
        return <MinimalImageTemplate data={data} accentColor={accentColor} />;
      default:
        return <ClassicTemplate data={data} accentColor={accentColor} />;
    }
  };

  return (
    <div className="w-full bg-gray-100">
      <div
        id={id}
        className={
          "border border-gray-200 print:shadow-none print:border-none " +
          classes
        }
      >
        {renderTemplate()}
      </div>

      <style>{`
        @page {
          size: letter;
          margin: 0;
        }

        @media print {
          html, body {
            width: 8.5in;
            height: 11in;
            overflow: hidden;
          }

          /* Hide everything first */
          body * {
            visibility: hidden;
          }

          /* Make resume visible (correct selector, no space) */
          #${id}, #${id} * {
            visibility: visible;
          }

          /* Make resume full page */
          #${id} {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumePreview;
