import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";

const OpenModal = ({
  onClose,
  onSubmit,
  mode = "create",
  defaultName = "",
}) => {
  const [resumeName, setResumeName] = useState(defaultName || "");
  const [file, setFile] = useState(null);
  const modalRef = useRef();

  // 🔹 Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // 🔹 Submit handler
  const handleSubmit = () => {
    if (resumeName.trim() === "") return;

    const formattedName = resumeName.trim().replace(/\s+/g, "-").toLowerCase();
    if (mode === "upload" && !file) {
      return toast.error("Please upload a PDF file.");
    }

    onSubmit({ name: formattedName, file });
    onClose();
  };

  // 🔹 Modal title and description based on mode
  const modalText = {
    create: {
      title: "Create Your Resume",
      subtitle: "Build your ATS-friendly AI resume and get hired!",
      button: "Create Resume",
    },
    upload: {
      title: "Upload Your Resume",
      subtitle: "Upload your existing resume and let AI enhance it!",
      button: "Continue",
    },
    edit: {
      title: "Edit Resume Name",
      subtitle: "Rename your resume and keep it organized.",
      button: "Save Changes",
    },
  };

  const { title, subtitle, button } = modalText[mode];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={modalRef}
          className="flex flex-col items-center bg-white rounded-2xl max-w-lg w-11/12 md:w-[450px] p-6 md:p-8 relative text-gray-900 shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
        >
          {/* Icon */}
          <div className="flex items-center justify-center p-3 rounded-full bg-pink-100 mb-2">
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/model/faceIcon.svg"
              alt="faceIcon"
              className="w-8 h-8"
            />
          </div>

          {/* Title & Subtitle */}
          <h2 className="font-semibold text-2xl text-pink-700 mb-1">{title}</h2>
          <p className="text-sm text-gray-500 text-center max-w-xs mb-4">
            {subtitle}
          </p>

          {/* Resume Name Input */}
          <div className="flex items-center w-full md:px-4">
            <input
              type="text"
              placeholder="Enter name of Resume"
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
              className="text-sm text-gray-800 border border-pink-400 outline-none px-3 w-full h-10 rounded-l-md focus:ring-1 focus:ring-pink-400"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={mode === "upload" && !file}
              className="font-medium text-sm text-white bg-pink-500 w-36 h-10 rounded-r-md hover:bg-pink-600 transition disabled:opacity-50"
            >
              {button}
            </button>
          </div>

          {/* File Upload — only for upload mode */}
          {mode === "upload" && (
            <div className="mt-5 w-full md:px-4">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl py-6 cursor-pointer hover:border-pink-400 transition">
                <Upload size={28} className="text-pink-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {file ? file.name : "Click to upload PDF"}
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-gray-600 mt-4 transition"
          >
            Cancel
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OpenModal;
