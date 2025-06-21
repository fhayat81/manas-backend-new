const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define allowed values for enums - match the validation schema exactly
const GENDERS = ['male', 'female'];
const MARITAL_STATUSES = ['divorcee', 'widow', 'single'];
const EDUCATIONS = ['none', 'primary school', 'high school', 'bachelor\'s', 'master\'s', 'phd'];
const RELIGIONS = ['hindu', 'muslim', 'christian', 'sikh', 'buddhist', 'jain', 'other'];
const CASTES = ['general', 'obc', 'sc', 'st', 'other'];

// Adjust these arrays above to match your actual allowed values if needed

const userSchema = new Schema({
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
  date_of_birth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: GENDERS,
    required: true
  },
  marital_status: {
    type: String,
    enum: MARITAL_STATUSES,
    required: true
  },
  education: {
    type: String,
    enum: EDUCATIONS,
    required: true
  },
  profession: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    required: true
  },
  interests_hobbies: {
    type: String
  },
  brief_personal_description: {
    type: String
  },
  location: {
    village: {
      type: String,
      required: true
    },
    tehsil: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    }
  },
  guardian: {
    name: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true
    }
  },
  caste: {
    type: String,
    enum: CASTES,
    required: true
  },
  religion: {
    type: String,
    enum: RELIGIONS,
    required: true
  },
  divorce_finalized: {
    type: Boolean
  },
  children: [{
    gender: {
      type: String,
      enum: ['boy', 'girl'],
      required: true
    },
    age: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  children_count: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  expressed_interests: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    sentAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }],
  received_interests: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    sentAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }]
}, {
  timestamps: true
});

module.exports = { User: mongoose.model('User', userSchema) };
