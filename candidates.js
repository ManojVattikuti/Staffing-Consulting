const express = require('express');
const { db, bucket } = require('./firebase');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { candidateSchema, validateSchema } = require('./schemas');
const { checkRole, roles } = require('./middleware/roleAuth');

// Create a new candidate (accessible by all authenticated users)
router.post('/candidates', upload.single('resume'), async (req, res) => {
  try {
    const candidateData = req.body;
    const now = new Date();
    candidateData.createdAt = now.toISOString();
    candidateData.updatedAt = now.toISOString();

    if (req.file) {
      const resumeBuffer = req.file.buffer;
      const resumeBase64 = resumeBuffer.toString('base64');
      candidateData.resume = resumeBase64;
    }
    const docRef = await db.collection('candidates').add(candidateData);
    res.status(201).send({ id: docRef.id });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update a candidate by ID (user can update their own, admins/super_admins can update all)
router.put('/candidates/:id', async (req, res) => {
  try {
    const doc = await db.collection('candidates').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).send('Candidate not found');
    }

    // Allow users to update only their own profile
    if (req.user.role === roles.USER && doc.data().email !== req.user.email) {
      return res.status(403).send('Access denied');
    }

    const updateData = req.body;
    updateData.updatedAt = new Date().toISOString();

    await db.collection('candidates').doc(req.params.id).update(updateData);
    res.send('Candidate updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Read a candidate by ID (user can view their own, admins/super_admins can view all)
router.get('/candidatesById/:id', async (req, res) => {
  try {
    const doc = await db.collection('candidates').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).send('Candidate not found');
    }
    
    // Allow users to view only their own profile
    if (req.user.role === roles.USER && doc.data().email !== req.user.email) {
      return res.status(403).send('Access denied');
    }
    
    res.send(doc.data());
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a candidate by ID (only super admins)
router.delete('/candidates/:id', 
  checkRole([roles.SUPER_ADMIN]), 
  async (req, res) => {
  try {
    await db.collection('candidates').doc(req.params.id).delete();
    res.send('Candidate deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Download a candidate's resume by ID
router.get('/candidates/:id/resume', async (req, res) => {
  try {
    const doc = await db.collection('candidates').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).send('Candidate not found');
    }
    const candidateData = doc.data();
    if (!candidateData.resume) {
      return res.status(404).send('Resume not found');
    }
    const resumeBuffer = Buffer.from(candidateData.resume, 'base64');
    res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(resumeBuffer);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all candidates (only admins and super admins)
router.get('/candidates', 
  checkRole([roles.ADMIN, roles.SUPER_ADMIN]), 
  async (req, res) => {
  try {
    const snapshot = await db.collection('candidates').get();
    const candidates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.send(candidates);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;