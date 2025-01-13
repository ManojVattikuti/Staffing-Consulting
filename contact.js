const express = require('express');
const { db } = require('./firebase');
const router = express.Router();
const { contactFormSchema, validateSchema } = require('./schemas');
const { checkRole, roles } = require('./middleware/roleAuth');

// Submit contact form (public route - no authentication required)
router.post('/contact', validateSchema(contactFormSchema), async (req, res) => {
  try {
    const contactData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('contactSubmissions').add(contactData);
    
    res.status(201).send({ 
      id: docRef.id,
      message: 'Thank you for your message. We will get back to you shortly.'
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all contact form submissions (only admins and super admins)
router.get('/contact', 
  checkRole([roles.ADMIN, roles.SUPER_ADMIN]), 
  async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      let query = db.collection('contactSubmissions');

      // Add sorting by creation date (newest first)
      query = query.orderBy('createdAt', 'desc');

      // Add pagination
      const snapshot = await query
        .limit(parseInt(limit))
        .offset((parseInt(page) - 1) * parseInt(limit))
        .get();

      const submissions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Get total count for pagination
      const totalDocs = await db.collection('contactSubmissions').count().get();

      res.send({
        submissions,
        pagination: {
          total: totalDocs.data().count,
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
});

module.exports = router; 