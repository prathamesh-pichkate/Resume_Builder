import React, { useEffect, useState } from 'react';
import { FilePenLineIcon, TrashIcon, PencilIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import OpenModal from './OpenModal';
import { useSelector } from 'react-redux';
import api from '../config/api';
import toast from 'react-hot-toast';

const DashboardGetResume = () => {
  const { token } = useSelector((state) => state.auth || {});
  const navigate = useNavigate();
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B'];

  const [getResumes, setAllGetResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editResumeId, setEditResumeId] = useState(null);

  useEffect(() => {
    const fetchResumes = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const { data } = await api.get('/api/resume/list', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllGetResumes(data.resumes || []);
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to load resumes');
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [token]);

  const handleDelete = async (resumeId) => {
    if (!confirm('Delete this resume?')) return;
    try {
      await api.delete(`/api/resume/delete/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllGetResumes((prev) => prev.filter((r) => r._id !== resumeId));
      toast.success('Resume deleted');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete resume');
    }
  };

  // update via OpenModal -> onSubmit triggers this
  const handleUpdate = async ({ name, file }) => {
    // Find the resume
    const resume = getResumes.find((r) => r._id === editResumeId);
    if (!resume) {
      toast.error('Resume not found');
      setEditResumeId(null);
      return;
    }

    try {
      const resumeData = { ...resume, title: name };
      // If you need to send an image, use FormData with 'image' and resumeData as string
      const formData = new FormData();
      formData.append('resumeId', editResumeId);
      formData.append('resumeData', JSON.stringify(resumeData));
      if (file) formData.append('image', file);

      const { data } = await api.put('/api/resume/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setAllGetResumes((prev) => prev.map((r) => (r._id === editResumeId ? data.resume : r)));

      toast.success('Resume updated');
      setEditResumeId(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-pink-500">My Resumes</h1>
          <p className="text-red-200 text-lg">Manage and edit your professional resumes</p>
        </motion.div>

        {loading ? (
          <div className="text-gray-400">Loading resumes...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {getResumes.length === 0 && (
              <div className="text-gray-400">No resumes found. Create one!</div>
            )}
            {getResumes.map((resume, idx) => {
              const baseColor = colors[idx % colors.length];
              return (
                <div
                  key={resume._id}
                  className="relative w-full h-56 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-100 cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                    borderColor: baseColor + '40',
                  }}
                >
                  <button
                    className="absolute inset-0"
                    onClick={() => navigate(`/home/builder/${resume._id}`)}
                    aria-label={`Open ${resume.title}`}
                  />
                  <div className="z-10 flex flex-col items-center space-y-2">
                    <FilePenLineIcon
                      className="size-14 group-hover:scale-105 transition-all"
                      style={{ color: baseColor }}
                    />
                    <p
                      className="text-sm md:text-xl group-hover:scale-105 transition-all px-2 text-center"
                      style={{ color: baseColor }}
                    >
                      {resume.title || 'Untitled Resume'}
                    </p>
                    <p
                      className="text-[11px] md:text-[14px] text-slate-400 transition-all duration-300 px-2 text-center"
                      style={{ color: baseColor + '90' }}
                    >
                      Updated on{' '}
                      {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : '—'}
                    </p>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1 z-20">
                    <button
                      onClick={() => handleDelete(resume._id)}
                      title="Delete"
                      className="p-1.5 hover:bg-white/10 rounded text-slate-200 transition-colors"
                    >
                      <TrashIcon />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditResumeId(resume._id);
                      }}
                      title="Edit"
                      className="p-1.5 hover:bg-white/10 rounded text-slate-200 transition-colors"
                    >
                      <PencilIcon />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {editResumeId && (
        <OpenModal
          mode="edit"
          defaultName={getResumes.find((r) => r._id === editResumeId)?.title || ''}
          onClose={() => setEditResumeId(null)}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
};

export default DashboardGetResume;
