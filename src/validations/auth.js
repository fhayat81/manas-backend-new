const { z } = require('zod');
const { Gender, MaritalStatus, Education, Religion, Caste } = require('../types');

const registerSchema = z.object({
  full_name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  profile_photo: z.string().optional(),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.string().datetime()).or(z.date()),
  gender: z.enum([Gender.MALE, Gender.FEMALE]),
  marital_status: z.enum([MaritalStatus.DIVORCEE, MaritalStatus.WIDOW, MaritalStatus.SINGLE]),
  education: z.enum([
    Education.NONE,
    Education.PRIMARY_SCHOOL,
    Education.HIGH_SCHOOL,
    Education.BACHELORS,
    Education.MASTERS,
    Education.PHD,
  ]),
  profession: z.string().min(1),
  phone_number: z.string().min(1),
  interests_hobbies: z.string().optional(),
  brief_personal_description: z.string().optional(),
  location: z.object({
    village: z.string().min(1),
    tehsil: z.string().min(1),
    district: z.string().min(1),
    state: z.string().min(1),
  }),
  guardian: z.object({
    name: z.string().min(1),
    contact: z.string().min(1),
  }),
  caste: z.enum([Caste.GENERAL, Caste.OBC, Caste.SC, Caste.ST, Caste.OTHER]),
  religion: z.enum([Religion.HINDU, Religion.MUSLIM, Religion.CHRISTIAN, Religion.SIKH, Religion.BUDDHIST, Religion.JAIN, Religion.OTHER]),
  divorce_finalized: z.boolean().optional(),
  children: z.array(z.object({
    gender: z.enum(['boy', 'girl']),
    age: z.number().min(0),
  })).optional(),
  children_count: z.number().min(0),
});

const loginSchema = z.object({
  username_or_email: z.string(),
  password: z.string(),
});

const verifyOTPSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

const updateUserSchema = registerSchema.partial();

const updateProfileSchema = z.object({
  full_name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.string().datetime()).or(z.date()).optional(),
  gender: z.enum([Gender.MALE, Gender.FEMALE]).optional(),
  marital_status: z.enum([MaritalStatus.DIVORCEE, MaritalStatus.WIDOW, MaritalStatus.SINGLE]).optional(),
  education: z.enum([
    Education.NONE,
    Education.PRIMARY_SCHOOL,
    Education.HIGH_SCHOOL,
    Education.BACHELORS,
    Education.MASTERS,
    Education.PHD,
  ]).optional(),
  profession: z.string().min(1).optional(),
  phone_number: z.string().min(1).optional(),
  interests_hobbies: z.string().optional(),
  brief_personal_description: z.string().optional(),
  location: z.object({
    village: z.string().min(1).optional(),
    tehsil: z.string().min(1).optional(),
    district: z.string().min(1).optional(),
    state: z.string().min(1).optional(),
  }).optional(),
  guardian: z.object({
    name: z.string().min(1).optional(),
    contact: z.string().min(1).optional(),
  }).optional(),
  caste: z.enum([Caste.GENERAL, Caste.OBC, Caste.SC, Caste.ST, Caste.OTHER]).optional(),
  religion: z.enum([Religion.HINDU, Religion.MUSLIM, Religion.CHRISTIAN, Religion.SIKH, Religion.BUDDHIST, Religion.JAIN, Religion.OTHER]).optional(),
  divorce_finalized: z.boolean().optional(),
  children: z.array(z.object({
    gender: z.enum(['boy', 'girl']),
    age: z.number().min(0),
  })).optional(),
  children_count: z.number().min(0).optional(),
  profile_photo: z.string().optional(),
});

const validateRegistration = (req, res, next) => {
  try {
    req.body = registerSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(400).json({ message: 'Invalid request data' });
  }
};

const validateLogin = (req, res, next) => {
  try {
    req.body = loginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(400).json({ message: 'Invalid request data' });
  }
};

const validateOTP = (req, res, next) => {
  try {
    req.body = verifyOTPSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(400).json({ message: 'Invalid request data' });
  }
};

const validateProfileUpdate = (req, res, next) => {
  try {
    console.log('Starting profile update validation...');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('Empty request body detected');
      return res.status(400).json({ message: 'No data provided for update' });
    }

    try {
      const validatedData = updateProfileSchema.parse(req.body);
      req.body = validatedData;
      console.log('Data validated successfully:', validatedData);
      next();
    } catch (error) {
      console.error('Validation error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Validation failed',
          errors: error.errors 
        });
      }
      return res.status(400).json({ message: 'Invalid data format' });
    }
  } catch (error) {
    console.error('Profile update validation error:', error);
    return res.status(500).json({ message: 'Server error during validation' });
  }
};

module.exports = {
  registerSchema,
  loginSchema,
  verifyOTPSchema,
  updateUserSchema,
  updateProfileSchema,
  validateRegistration,
  validateLogin,
  validateOTP,
  validateProfileUpdate
};
