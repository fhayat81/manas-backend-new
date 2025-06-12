import mongoose, { Document, Schema } from 'mongoose';
import { Gender, MaritalStatus, Education } from '../types';

export interface IUser extends Document {
  username: string;
  full_name: string;
  email: string;
  password: string;
  profile_photo?: string;
  age: number;
  gender: Gender;
  marital_status: MaritalStatus;
  education: Education;
  location: {
    address: string;
    city: string;
    country: string;
  };
  children_count: number;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30
  },
  full_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profile_photo: {
    type: String
  },
  age: {
    type: Number,
    required: true,
    min: 18
  },
  gender: {
    type: String,
    enum: Object.values(Gender),
    required: true
  },
  marital_status: {
    type: String,
    enum: Object.values(MaritalStatus),
    required: true
  },
  education: {
    type: String,
    enum: Object.values(Education),
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  children_count: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  is_verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

export const User = mongoose.model<IUser>('User', userSchema); 