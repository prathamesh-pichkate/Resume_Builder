import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../config/api';
import {
  ArrowLeftIcon,
  Briefcase,
  FileText,
  GraduationCap,
  User,
  FolderIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Share2Icon,
  EyeIcon,
  EyeOffIcon,
  DownloadIcon,
} from 'lucide-react';
import PersonalInfoForm from '../components/PersonalInfoForm';
import ResumePreview from '../components/ResumePreview';
import TemplateSelector from '../components/TemplateSelector';
import ColorPicker from '../components/ColorPicker';
import ProfessionalSummary from '../components/ProfessionalSummary';
import ExperienceForm from '../components/ExperienceForm';
import EducationForm from '../components/EducationForm';
import ProjectForm from '../components/ProjectForm';
import SkillsForm from '../components/SkillsForm';
import { useSelector } from 'react-redux';

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth || {});

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: '',
    education: [],
    experience: [],
    project: [],
    skills: [],
    template: 'classic',
    accent_color: '#3B82F6',
    public: false,
  });
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const loadExistingResume = useCallback(async () => {
    try {
      const { data } = await api.get(`/api/resume/get/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.resume) {
        setResumeData(data.resume);
        document.title = data.resume.title;
      }
    } catch (error) {
      toast.error('Error while fetching resume data');
      console.log('Error fetching resume data:', error);
    }
  }, [resumeId, token]);

  useEffect(() => {
    loadExistingResume();
  }, [loadExistingResume]);

  const changeResumeVisiblity = async () => {
    try {
      const formData = new FormData();
      formData.append('resumeId', resumeId);
      formData.append(
        'resumeData',
        JSON.stringify({
          ...resumeData,
          public: !resumeData.public,
        }),
      );

      await api.put('/api/resume/update', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setResumeData((prev) => ({
        ...prev,
        public: !prev.public,
      }));

      toast.success('Resume visibility updated.');
    } catch (error) {
      console.log('Error saving resume visibility:', error);
    }
  };

  const handleShare = async () => {
    if (!resumeData._id) {
      alert('Resume not saved yet. Please save before sharing.');
      return;
    }

    const base = window.location.origin;
    const resumeUrl = `${base}/view/${resumeData._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: resumeData.title || 'My Resume',
          text: 'Check out my resume',
          url: resumeUrl,
        });
        return;
      } catch (err) {
        console.warn('navigator.share failed:', err);
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(resumeUrl);
        alert('Resume URL copied to clipboard!');
        return;
      } catch (err) {
        console.warn('Clipboard write failed:', err);
      }
    }

    window.prompt('Copy this resume URL:', resumeUrl);
  };

  const handleDownload = async () => {
    window.print();
  };

  const saveResumeData = async () => {
    let updatedResumeData = structuredClone(resumeData);

    if (resumeData.personal_info.image instanceof File) {
      delete updatedResumeData.personal_info.image;
    }

    const formData = new FormData();
    formData.append('resumeId', resumeId);
    formData.append('resumeData', JSON.stringify(updatedResumeData));

    if (removeBackground) formData.append('removeBackground', 'yes');
    if (resumeData.personal_info.image instanceof File) {
      formData.append('image', resumeData.personal_info.image);
    }

    console.log(
      'Image value:',
      resumeData.personal_info.image,
      'isFile?',
      resumeData.personal_info.image instanceof File,
    );

    const { data } = await api.put('/api/resume/update', formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Save resume response:', data);
    setResumeData(data.resume);

    return data;
  };

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'summary', name: 'Summary', icon: FileText },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'project', name: 'Projects', icon: FolderIcon },
    { id: 'skills', name: 'Skills', icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIdx];

  return (
    <div className=" py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6 sticky top-20">
          <Link
            to={'/home'}
            className="inline-flex gap-2 items-center text-purple-600 hover:text-pink-600 transition-all font-medium"
          >
            <ArrowLeftIcon className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 sticky top-10">
          {/* Left Panel - Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden">
              {/* Progress Bar */}
              <div className="relative h-1 bg-gradient-to-r from-pink-100 to-purple-100">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 transition-all duration-500 ease-out"
                  style={{
                    width: `${((activeSectionIdx + 1) * 100) / sections.length}%`,
                  }}
                />
              </div>

              <div className="p-6">
                {/* Section Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg">
                      <activeSection.icon className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{activeSection.name}</h2>
                      <p className="text-sm text-gray-500">
                        Step {activeSectionIdx + 1} of {sections.length}
                      </p>
                    </div>
                  </div>

                  {/* Template & Color Selectors */}
                  <div className="flex gap-3 pb-4 border-b border-pink-100">
                    <TemplateSelector
                      selectedTemplate={resumeData.template}
                      onChange={(template) => setResumeData((prev) => ({ ...prev, template }))}
                    />
                    <ColorPicker
                      selectedColor={resumeData.accent_color}
                      onChange={(color) =>
                        setResumeData((prev) => ({
                          ...prev,
                          accent_color: color,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Form Content */}
                <div className="space-y-6  mb-6">
                  {activeSection.id === 'personal' && (
                    <PersonalInfoForm
                      data={resumeData.personal_info}
                      onChange={(data) =>
                        setResumeData((prev) => ({
                          ...prev,
                          personal_info: data,
                        }))
                      }
                      removeBackground={removeBackground}
                      setRemoveBackground={setRemoveBackground}
                    />
                  )}
                  {activeSection.id === 'summary' && (
                    <ProfessionalSummary
                      data={resumeData.professional_summary}
                      onChange={(data) =>
                        setResumeData((prev) => ({
                          ...prev,
                          professional_summary: data,
                        }))
                      }
                      setResumeData={setResumeData}
                    />
                  )}
                  {activeSection.id === 'experience' && (
                    <ExperienceForm
                      data={resumeData.experience}
                      onChange={(data) => setResumeData((prev) => ({ ...prev, experience: data }))}
                    />
                  )}
                  {activeSection.id === 'education' && (
                    <EducationForm
                      data={resumeData.education}
                      onChange={(data) => setResumeData((prev) => ({ ...prev, education: data }))}
                    />
                  )}
                  {activeSection.id === 'project' && (
                    <ProjectForm
                      data={Array.isArray(resumeData.project) ? resumeData.project : []}
                      onChange={(data) => setResumeData((prev) => ({ ...prev, project: data }))}
                    />
                  )}
                  {activeSection.id === 'skills' && (
                    <SkillsForm
                      data={resumeData.skills}
                      onChange={(data) => setResumeData((prev) => ({ ...prev, skills: data }))}
                    />
                  )}
                </div>

                {/* Navigation & Save Buttons */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-pink-100">
                  <div className="flex gap-2">
                    {activeSectionIdx > 0 && (
                      <button
                        onClick={() => setActiveSectionIdx((prevIdx) => Math.max(prevIdx - 1, 0))}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" /> Previous
                      </button>
                    )}
                    {activeSectionIdx < sections.length - 1 && (
                      <button
                        onClick={() =>
                          setActiveSectionIdx((prevIdx) =>
                            Math.min(prevIdx + 1, sections.length - 1),
                          )
                        }
                        className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-pink-600 bg-pink-50 hover:bg-pink-100 transition-all"
                      >
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <button
                    className="flex-1 max-w-[160px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-semibold rounded-lg px-6 py-2.5 text-sm shadow-lg shadow-pink-200 hover:shadow-xl transition-all duration-300"
                    onClick={() =>
                      toast.promise(saveResumeData(), {
                        loading: 'Saving resume...',
                        success: 'Resume saved successfully!',
                        error: 'Error saving resume.',
                      })
                    }
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Section Pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {sections.map((section, idx) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSectionIdx(idx)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    idx === activeSectionIdx
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-pink-50 border border-pink-100'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-7">
            <div className="sticky top-4">
              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 mb-4">
                {resumeData.public && (
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white text-indigo-600 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
                  >
                    <Share2Icon className="w-4 h-4" />
                    Share
                  </button>
                )}
                <button
                  onClick={changeResumeVisiblity}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all shadow-sm ${
                    resumeData.public
                      ? 'bg-white text-purple-600 border-purple-200 hover:bg-purple-50'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {resumeData.public ? (
                    <>
                      <EyeIcon className="w-4 h-4" />
                      Public
                    </>
                  ) : (
                    <>
                      <EyeOffIcon className="w-4 h-4" />
                      Private
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg shadow-pink-200"
                >
                  <DownloadIcon className="w-4 h-4" />
                  Download
                </button>
              </div>

              {/* Resume Preview */}
              <div className="bg-white rounded-2xl shadow-2xl border border-pink-100 overflow-hidden">
                <ResumePreview
                  id="resume-preview"
                  data={resumeData}
                  template={resumeData.template}
                  accentColor={resumeData.accent_color}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
