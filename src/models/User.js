const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define allowed values for enums
const GENDERS = ['male', 'female', 'other'];
const MARITAL_STATUSES = ['single', 'married', 'divorcee', 'widow'];
const EDUCATIONS = ['none', 'high school' , 'bachelor', 'master', 'phd'];

// Adjust these arrays above to match your actual allowed values if needed

const userSchema = new Schema({
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

const User = mongoose.model('User', userSchema);

module.exports = { User };
