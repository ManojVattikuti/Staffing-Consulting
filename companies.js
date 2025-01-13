// companies.js
const express = require('express');
const { db } = require('./firebase');
const router = express.Router();
const { companySchema, validateSchema, jobPostingSchema } = require('./schemas');
const { checkRole, roles } = require('./middleware/roleAuth');

// Create a new company (accessible by all authenticated users)
router.post('/companies', validateSchema(companySchema), async (req, res) => {
  try {
    const companyData = req.body;
    const docRef = await db.collection('companies').add(companyData);
    res.status(201).send({ id: docRef.id });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all companies (only admins and super admins)
router.get('/companies', 
  checkRole([roles.ADMIN, roles.SUPER_ADMIN]), 
  async (req, res) => {
  try {
    const snapshot = await db.collection('companies').get();
    const companies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.send(companies);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get company by ID (user can view their own, admins/super_admins can view all)
router.get('/companies/:id', async (req, res) => {
  try {
    const doc = await db.collection('companies').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).send('Company not found');
    }

    // Allow users to view only their own company
    if (req.user.role === roles.USER && doc.data().ownerEmail !== req.user.email) {
      return res.status(403).send('Access denied');
    }

    res.send(doc.data());
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update company (admins and super admins only)
router.put('/companies/:id', 
  checkRole([roles.ADMIN, roles.SUPER_ADMIN]), 
  async (req, res) => {
  try {
    await db.collection('companies').doc(req.params.id).update(req.body);
    res.send('Company updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete company (super admins only)
router.delete('/companies/:id', 
  checkRole([roles.SUPER_ADMIN]), 
  async (req, res) => {
  try {
    await db.collection('companies').doc(req.params.id).delete();
    res.send('Company deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;