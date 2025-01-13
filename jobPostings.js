const express = require('express');
const { db } = require('./firebase');
const router = express.Router();
const { jobPostingSchema, validateSchema } = require('./schemas');

// Create a new job posting
router.post('/job-postings', 
  validateSchema(jobPostingSchema), 
  async (req, res) => {
  try {
    const jobData = { ...req.body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const docRef = await db.collection('jobPostings').add(jobData);
    res.status(201).send({ id: docRef.id });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all job postings
router.get('/job-postings', async (req, res) => {
  const { page = 1, limit = 10, title, location, employmentType } = req.query;
  let query = db.collection('jobPostings');

  try {
    // Build query based on provided filters
    const filters = [];
    if (title) filters.push(['title', '>=', title], ['title', '<=', title + '\uf8ff']);
    if (location) filters.push(['location', '==', location]);
    if (employmentType) filters.push(['employmentType', '==', employmentType]);

    // Apply filters sequentially
    filters.forEach(([field, operator, value]) => {
      query = query.where(field, operator, value);
    });

    const parsedLimit = Math.min(parseInt(limit) || 10, 100);
    const parsedPage = Math.max(parseInt(page) || 1, 1);
    
    const snapshot = await query
      .orderBy('title')
      .limit(parsedLimit)
      .offset((parsedPage - 1) * parsedLimit)
      .get();

    const jobPostings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.send(jobPostings);
  } catch (error) {
    if (error.code === 'failed-precondition') {
      return res.status(500).send('Search combination requires a new index. Please contact the administrator.');
    }
    res.status(500).send(error.message);
  }
});

// Update job posting
router.put('/job-postings/:id', async (req, res) => {
  try {
    const jobData = { ...req.body, updatedAt: new Date().toISOString() };
    await db.collection('jobPostings').doc(req.params.id).update(jobData);
    res.send('Job posting updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete job posting
router.delete('/job-postings/:id', async (req, res) => {
  try {
    await db.collection('jobPostings').doc(req.params.id).delete();
    res.send('Job posting deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router; 