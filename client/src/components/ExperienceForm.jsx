import { Briefcase, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import React from "react";
import api from "../config/api";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const ExperienceForm = ({ data, onChange }) => {
  const addExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };
    onChange([...data, newExperience]);
  };

  const { token } = useSelector((state) => state.auth);
  const [generatingIndex, setGeneratingIndex] = useState(-1);

  const generateJobDescription = async (index) => {
    setGeneratingIndex(index);
    const experience = data[index];
    const prompt = `Generate a detailed job description ${experience.description} for the position of ${experience.position} at ${experience.company}.Include key responsibilities and achievements.`;
    try {
      const { data } = await api.post(
        "api/ai/enhance-job-desc",
        { userContent: prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateExperience(index, "description", data.enhancedContent);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate job description"
      );
    } finally {
      setGeneratingIndex(-1);
    }
  };

  const removeExperience = (index) => {
    const updated = data.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  // Generic single-field updater (keeps updates atomic)
  const updateExperience = (index, field, value) => {
    const updated = data.map((exp, idx) =>
      idx === index ? { ...exp, [field]: value } : exp
    );
    onChange(updated);
  };

  // Toggle "currently working" in a single update (also clear end_date when checked)
  const toggleCurrentlyWorking = (index, checked) => {
    const updated = data.map((exp, idx) =>
      idx === index
        ? {
            ...exp,
            is_current: !!checked,
            // clear end_date when marking current; keep existing when unchecking
            end_date: checked ? "" : exp.end_date,
          }
        : exp
    );
    onChange(updated);
  };

  // Update whole experience object (useful if you want to set multiple fields at once)
  const setExperience = (index, newExp) => {
    const updated = data.map((exp, idx) => (idx === index ? newExp : exp));
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Experience
          </h3>
          <p className="text-sm text-gray-500">
            Add your work experience here.
          </p>
        </div>
        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No work experience added yet</p>
          <p>Click "Add Experience" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((experience, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4 className="text-base font-semibold text-gray-800">
                  Experience #{index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={experience.company || ""}
                  onChange={(e) =>
                    updateExperience(index, "company", e.target.value)
                  }
                  placeholder="Company Name"
                  className="px-3 py-2 text-sm text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />

                <input
                  type="text"
                  value={experience.position || ""}
                  onChange={(e) =>
                    updateExperience(index, "position", e.target.value)
                  }
                  placeholder="Job Title"
                  className="px-3 py-2 text-sm text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={experience.start_date || ""}
                    onChange={(e) =>
                      updateExperience(index, "start_date", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    End Date {experience.is_current && "(Disabled)"}
                  </label>
                  <input
                    type="date"
                    value={experience.end_date || ""}
                    disabled={!!experience.is_current}
                    onChange={(e) =>
                      updateExperience(index, "end_date", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-500"
                  />
                </div>

                <label className="flex items-center gap-2 col-span-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!experience.is_current}
                    onChange={(e) =>
                      toggleCurrentlyWorking(index, e.target.checked)
                    }
                    className="w-4 h-4 accent-purple-600 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 select-none">
                    Currently working here
                  </span>
                </label>

                <div className="col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Job Description
                    </label>
                    <button
                      onClick={() => generateJobDescription(index)}
                      disabled={
                        generatingIndex === index ||
                        !experience.position ||
                        !experience.company
                      }
                      className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 transition-colors"
                      type="button"
                    >
                      {generatingIndex === index ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      Enhance with AI
                    </button>
                  </div>
                  <textarea
                    value={experience.description || ""}
                    onChange={(e) =>
                      updateExperience(index, "description", e.target.value)
                    }
                    rows={4}
                    className="w-full text-sm text-gray-900 placeholder-gray-400 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Describe your key responsibilities and achievements..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
