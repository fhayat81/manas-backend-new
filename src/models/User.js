const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define allowed values for enums - match the validation schema exactly
const GENDERS = ['male', 'female'];
const MARITAL_STATUSES = ['divorcee', 'widow', 'single'];
const EDUCATIONS = ['none', 'primary school', 'high school', 'bachelor\'s', 'master\'s', 'phd'];

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
  age: {
    type: Number,
    required: true,
    min: 18
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

const User = mongoose.model('User', userSchema);

module.exports = { User };
