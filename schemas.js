const companySchema = {
  properties: {
    name: { type: "string" },
    email: { type: "string" },
    phone: { type: "string" },
    website: { type: "string" },
    address: {
      type: "object",
      properties: {
        street: { type: "string" },
        city: { type: "string" },
        state: { type: "string" },
        zip: { type: "string" },
        country: { type: "string" }
      }
    },
    industry: { type: "string" },
    foundingDate: { type: "string" },
    numberOfEmployees: { type: "number" },
    revenue: { type: "number" },
    socialLinks: {
      type: "object",
      properties: {
        linkedin: { type: "string" },
        twitter: { type: "string" },
        facebook: { type: "string" },
        instagram: { type: "string" }
      }
    },
    consultancy: { 
      type: "string", 
      enum: ["Promates", "Trimah"] // Added consultancy key with allowed values
    },
    createdAt: { type: "string" },
    updatedAt: { type: "string" }
  },
  required: ["name", "email", "address", "industry"],
};


const candidateSchema = {
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string" },
    phone: { type: "string" },
    address: {
      type: "object",
      properties: {
        street: { type: "string" },
        city: { type: "string" },
        state: { type: "string" },
        zip: { type: "string" },
        country: { type: "string" }
      }
    },
    skills: { type: "array" },
    experience: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          company: { type: "string" },
          startDate: { type: "date" },
          endDate: { type: "date" },
          description: { type: "string" }
        }
      }
    },
    education: {
      type: "array",
      items: {
        type: "object",
        properties: {
          degree: { type: "string" },
          institution: { type: "string" },
          yearOfCompletion: { type: "number" }
        }
      }
    },
    resume: { type: "string" },
    githubUrl :{type: "string"},
    linkedinUrl :{type: "string"},
    consultancy: { 
      type: "string", 
      enum: ["Promates", "Trimah"] // Added consultancy key with allowed values
    },
    createdAt: { type: "timestamp" },
    updatedAt: { type: "timestamp" }
  },
  required: ["firstName", "lastName", "email"]
};

const jobPostingSchema = {
  properties: {
    title: { type: "string" },
    companyName: { type: "string" },
    location: { type: "string" },
    employmentType: { type: "string", enum: ["Full-time", "Part-time", "Contract", "Internship"] },
    experienceLevel: { type: "string" },
    salaryRange: { type: "string" },
    description: { type: "string" },
    requirements: { type: "array" },
    benefits: { type: "array" },
    applicationDeadline: { type: "string" },
    createdAt: { type: "string" },
    updatedAt: { type: "string" }
  },
  required: ["title", "companyName", "location", "employmentType", "experienceLevel", "salaryRange", "description", "requirements", "applicationDeadline"],
};

const contactFormSchema = {
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string" },
    phoneNumber: { type: "string" },
    companyName: { type: "string" },
    companyLocation: { type: "string" },
    message: { type: "string" },
    createdAt: { type: "string" }
  },
  required: [
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
    "companyName",
    "companyLocation",
    "message"
  ]
};

function validateSchema(schema) {
  return (req, res, next) => {
    const data = req.body;
    const missingFields = schema.required.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields
      });
    }

    // Validate data types
    for (const [field, value] of Object.entries(data)) {
      const expectedType = schema.properties[field]?.type;
      if (expectedType && typeof value !== expectedType && expectedType !== 'array') {
        return res.status(400).json({
          error: `Invalid type for field '${field}'. Expected ${expectedType}, got ${typeof value}`
        });
      }
      if (expectedType === 'array' && !Array.isArray(value)) {
        return res.status(400).json({
          error: `Invalid type for field '${field}'. Expected array, got ${typeof value}`
        });
      }
    }

    next();
  };
}

module.exports = {
  companySchema,
  candidateSchema,
  jobPostingSchema,
  validateSchema,
  contactFormSchema
}; 