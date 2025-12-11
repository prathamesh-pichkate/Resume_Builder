import imageKit from '../config/imageKit.js';
import Resume from '../models/Resume.js';
import fs from 'fs';

//Creating a new resume: POST: /api/resume/create
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    //create new resume
    const newResume = await Resume.create({ userId, title });

    return res.status(201).json({ message: 'Resume created successfully.', resume: newResume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//Delete a resume: DELETE: /api/resume/delete
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    await Resume.findOneAndDelete({ userId, _id: resumeId });
    return res.status(200).json({ message: 'Resume Deleted Successfully.' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//Get user resume by ID: GET: /api/resume/get
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found.' });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//Get resume by id public: GET: /api/resume/public
export const getResumePublicById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ public: true, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found.' });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    // resumeId and resumeData come via multipart/form-data fields
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    console.log('Received updateResumeById request image', image);

    console.log('updateResumeById called, resumeId:', resumeId, 'userId:', userId);
    console.log('req.file present:', !!image);
    console.log('removeBackground raw:', removeBackground);

    // parse resumeData (could be stringified JSON or already object)
    let resumeDataCopy;
    if (typeof resumeData === 'string') {
      try {
        resumeDataCopy = JSON.parse(resumeData);
      } catch (err) {
        console.error('Failed to JSON.parse resumeData:', err);
        return res.status(400).json({ message: 'Invalid resumeData JSON' });
      }
    } else if (typeof resumeData === 'object' && resumeData !== null) {
      resumeDataCopy = structuredClone(resumeData);
    } else {
      resumeDataCopy = {};
    }

    // Ensure personal_info exists
    if (!resumeDataCopy.personal_info || typeof resumeDataCopy.personal_info !== 'object') {
      resumeDataCopy.personal_info = {};
    }

    // If image file present, upload to ImageKit
    if (image) {
      try {
        // removeBackground might be sent as "yes" or "true" string from client
        const removeBgRequested =
          removeBackground === 'yes' || removeBackground === 'true' || removeBackground === true;

        const transformPre =
          'w-300,h-300,fo-face,z-0.75' + (removeBgRequested ? ',e-bgremove' : '');

        console.log('Uploading to ImageKit, transformPre:', transformPre, 'file.path:', image.path);

        const response = await imageKit.files.upload({
          file: fs.createReadStream(image.path),
          fileName: image.originalname || 'resume.jpg',
          folder: 'user-resumes',
          transformation: { pre: transformPre },
        });

        console.log('ImageKit upload response:', response);

        // imageKit returns url in `response.url` (or `response.filePath` on some SDKs) — prefer url
        const uploadedUrl = response?.url || response?.filePath || response?.filePathUrl;
        if (!uploadedUrl) {
          console.warn('No URL returned from ImageKit response', response);
        } else {
          resumeDataCopy.personal_info.image = uploadedUrl;
        }

        // OPTIONAL: remove the temp file created by multer - cleanup
        try {
          fs.unlink(image.path, (err) => {
            if (err) console.warn('Failed to unlink temp file:', err);
          });
        } catch (e) {
          console.warn('cleanup error:', e);
        }
      } catch (imgErr) {
        console.error('Image upload failed:', imgErr);
        // don't abort update entirely — return helpful error
        return res.status(500).json({
          message: 'Image upload failed',
          error: imgErr.message || imgErr.toString(),
        });
      }
    }

    // Update the resume — ensure we only update allowed fields
    // Using findOneAndUpdate with userId ensures only owner can update
    const resume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      { $set: resumeDataCopy },
      { new: true, runValidators: true },
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or you don't have access." });
    }

    return res.status(200).json({ message: 'Resume updated successfully.', resume });
  } catch (error) {
    console.error('updateResumeById error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

//get list of resumes for a user: GET: /api/resume/list
export const getResumesForUser = async (req, res) => {
  try {
    const userId = req.userId;
    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });
    return res.status(200).json({ resumes });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
