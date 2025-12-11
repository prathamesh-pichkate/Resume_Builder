import React, { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import api from '../config/api';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const ProfessionalSummary = ({ data, onChange, setResumeData }) => {
  const { token } = useSelector((state) => state.auth);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    try {
      setIsGenerating(true);
      const prompt = `Generate a concise professional summary for a resume based on the following information: ${data}`;
      const response = await api.post(
        '/api/ai/enhance-pro-sum',
        { userContent: prompt },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setResumeData((prev) => ({
        ...prev,
        professional_summary: response.data.enhancedContent,
      }));
    } catch (error) {
      toast.error('Failed to generate professional summary.');
      console.error('Error generating professional summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Professional Summary
          </h3>
          <p className="text-sm text-gray-500">Add summary for your resume here.</p>
        </div>
        <button
          disabled={isGenerating}
          onClick={generateSummary}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}

          {isGenerating ? 'Enhancing...' : 'AI Enhance'}
        </button>
      </div>
      <div className="mt-6">
        <textarea
          value={data || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          className="w-full p-3 px-4 mt-2 border text-sm text-black border-gray-300 rounded-lg focus:ring focus:ring-blue-500 outline-none transition-colors resize-none"
          placeholder="Write down your professional summary."
        />
        <p className="text-xs text-gray-500 max-w-4xl mx-auto text-center">
          Tip: Keep it concise and focused on your key strengths.
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSummary;
