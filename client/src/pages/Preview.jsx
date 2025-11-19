import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ResumePreview from "../components/ResumePreview";
import { ArrowLeftIcon } from "lucide-react";
import Loader from "../components/Loader";
import api from "../config/api"; // <- added
import { toast } from "react-hot-toast"; // <- added

const Preview = () => {
  const { resumeId } = useParams();

  const [resumeData, setResumeData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadResume = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/api/resume/public/${resumeId}`);
      // be tolerant about response shape (many APIs wrap payload)
      const payload = res.data?.resume || res.data?.data || res.data;
      if (!payload) {
        throw new Error("No resume payload returned from API");
      }
      setResumeData(payload);
    } catch (error) {
      console.error("loadResume error:", error);
      toast.error("Failed to load resume data.");
      setResumeData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // include resumeId so it reloads when the route param changes
  useEffect(() => {
    if (resumeId) loadResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId]);

  return resumeData ? (
    <div className="bg-slate-100 min-h-screen">
      <div className="max-w-3xl mx-auto py-10">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accent_color}
          classes="py-4 bg-white"
        />
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p className="text-center text-6xl text-slate-400 font-medium">
            Resume not found
          </p>
          <Link
            to="/home"
            className="mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-green-400 flex items-center transition-colors"
          >
            <ArrowLeftIcon className="mr-2 w-4 h-4" />
            Go to home page
          </Link>
        </div>
      )}
    </div>
  );
};

export default Preview;
