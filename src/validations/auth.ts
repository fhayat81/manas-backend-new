import { z } from 'zod';
import { Gender, MaritalStatus, Education } from '../types';

export const registerSchema = z.object({
  username: z.string().min(3).max(30),
  full_name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  profile_photo: z.string().optional(),
  age: z.number().min(18),
  gender: z.enum([Gender.MALE, Gender.FEMALE]),
  marital_status: z.enum([MaritalStatus.DIVORCEE, MaritalStatus.WIDOW]),
  education: z.enum([
    Education.NONE,
    Education.PRIMARY_SCHOOL,
    Education.HIGH_SCHOOL,
    Education.BACHELORS,
    Education.MASTERS,
    Education.PHD,
  ]),
  location: z.object({
    address: z.string(),
    city: z.string(),
    country: z.string(),
  }),
  children_count: z.number().min(0),
});

export const loginSchema = z.object({
  username_or_email: z.string(),
  password: z.string(),
});

export const verifyOTPSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export const updateUserSchema = registerSchema.partial();

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  full_name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  age: z.number().min(18).optional(),
  gender: z.enum([Gender.MALE, Gender.FEMALE]).optional(),
  marital_status: z.enum([MaritalStatus.DIVORCEE, MaritalStatus.WIDOW]).optional(),
  education: z.enum([
    Education.NONE,
    Education.PRIMARY_SCHOOL,
    Education.HIGH_SCHOOL,
    Education.BACHELORS,
    Education.MASTERS,
    Education.PHD,
  ]).optional(),
  location: z.object({
    address: z.string(),
    city: z.string(),
    country: z.string(),
  }).optional(),
  children_count: z.number().min(0).optional(),
  profile_photo: z.string().optional(),
});

export const validateRegistration = (req: any, res: any, next: any) => {
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

export const validateLogin = (req: any, res: any, next: any) => {
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

export const validateOTP = (req: any, res: any, next: any) => {
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

export const validateProfileUpdate = (req: any, res: any, next: any) => {
  try {
    console.log('Starting profile update validation...');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);

    // Check if body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('Empty request body detected');
      return res.status(400).json({ message: 'No data provided for update' });
    }

    // Validate the data
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