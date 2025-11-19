import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Upload, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OpenModal from "./OpenModal";
import { useSelector, useDispatch } from "react-redux";
import api from "../config/api";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";
import { setLoading } from "../app/features/authSlice";

const DashboardHeroSection = () => {
  const { user, token } = useSelector((state) => state.auth || {});
  const [createResumeModalOpen, setCreateResumeModalOpen] = useState(false);
  const [uploadResumeModalOpen, setUploadResumeModalOpen] = useState(false);
  ``;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // create resume handler: OpenModal -> returns { name }
  const handleCreateSubmit = async ({ name }) => {
    if (!token) return toast.error("Not authenticated");
    try {
      const { data } = await api.post(
        "/api/resume/create",
        { title: name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // After successful create, navigate to builder for the created resume
      navigate(`/home/builder/${data.resume._id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create resume");
    } finally {
      setCreateResumeModalOpen(false);
    }
  };

  const handleUploadSubmit = async ({ name, file }) => {
    if (!token) return toast.error("Not authenticated");

    // start loader via redux action
    dispatch(setLoading(true));

    try {
      if (!file) {
        toast.error("Please select a PDF to upload.");
        dispatch(setLoading(false));
        return;
      }

      // Depending on react-pdftotext API, it might accept File directly,
      // or an ArrayBuffer/Uint8Array. Try the simple approach first:
      let resumeText = "";

      // Option A: pdfToText accepts File or Blob
      try {
        // many versions of client-side pdf extractors accept File
        resumeText = await pdfToText(file);
      } catch (errA) {
        // Option B: convert to ArrayBuffer and pass that
        try {
          const arrayBuffer = await file.arrayBuffer();
          // pass typed array if required
          resumeText = await pdfToText(new Uint8Array(arrayBuffer));
        } catch (errB) {
          console.error("pdfToText failures:", errA, errB);
          throw new Error(
            "Failed to extract text from PDF on client. Consider using server-side parsing."
          );
        }
      }

      console.log(
        "resume_text from dashboardHeroSection:",
        resumeText?.slice?.(0, 200)
      );

      // post parsed text to backend AI endpoint (send JSON with resumeText)
      const { data } = await api.post(
        "/api/ai/upload-resume",
        { title: name, resumeText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Expect server to return created resume id
      const id =
        data?.resumeId || data?.resume?._id || data?.resumeIdFromServer;

      dispatch(setLoading(false));
      setUploadResumeModalOpen(false);

      if (!id) {
        toast.success("Uploaded, but couldn't get resume id from server.");
        return;
      }

      toast.success("Resume uploaded and parsed.");
      navigate(`/home/builder/${id}`);
    } catch (error) {
      console.error("uploadResume error:", error);
      toast.error(
        error?.response?.data?.message || error?.message || "Upload failed"
      );
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="h-fit flex items-center justify-center py-6 text-white overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          <motion.div
            className="flex flex-col gap-6 max-w-2xl text-center lg:text-left"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 self-center lg:self-start"
            >
              <span className="px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full text-[12px] md:text-sm text-pink-400 flex items-center gap-2">
                <Sparkles size={16} className="animate-pulse" />
                AI-Powered Resume Builder
              </span>
            </motion.div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Hii, <br />
              <span className="text-4xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                {user?.name || "Prathamesh Pichkate"}
              </span>
            </h1>

            <p className="text-gray-400 text-sm md:text-lg leading-relaxed">
              Build professional resumes in minutes with AI assistance. Create
              from scratch or enhance your existing resume with intelligent
              suggestions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center lg:justify-start">
              <motion.button
                onClick={() => setCreateResumeModalOpen(true)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 rounded-xl font-semibold text-lg shadow-lg shadow-pink-500/30 transition-all"
              >
                <UserPlus size={20} />
                Create New Resume
              </motion.button>

              <motion.button
                onClick={() => setUploadResumeModalOpen(true)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl font-semibold text-lg border border-slate-700 backdrop-blur-sm transition-all"
              >
                <Upload size={22} />
                Upload Resume
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-8 mt-8 justify-center lg:justify-start text-sm"
            >
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-pink-400">10K+</span>
                <span className="text-gray-500">Resumes Created</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-purple-400">95%</span>
                <span className="text-gray-500">Success Rate</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-blue-400">AI</span>
                <span className="text-gray-500">Powered</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative w-full max-w-lg lg:max-w-xl flex items-center justify-center"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-full flex items-center justify-center"
            >
              <img
                src="/assets/illustration_image1.png"
                alt="AI Resume Builder Illustration"
                className="w-full h-auto max-w-md lg:max-w-lg object-contain drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Create Resume Modal */}
      {createResumeModalOpen && (
        <OpenModal
          mode="create"
          onClose={() => setCreateResumeModalOpen(false)}
          onSubmit={handleCreateSubmit}
        />
      )}

      {/* Upload Resume Modal */}
      {uploadResumeModalOpen && (
        <OpenModal
          mode="upload"
          onClose={() => setUploadResumeModalOpen(false)}
          onSubmit={handleUploadSubmit}
        />
      )}
    </div>
  );
};

export default DashboardHeroSection;
