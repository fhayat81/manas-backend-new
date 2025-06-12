// Enums as frozen objects
const Gender = Object.freeze({
  MALE: "male",
  FEMALE: "female"
});

const MaritalStatus = Object.freeze({
  DIVORCEE: "divorcee",
  WIDOW: "widow"
});

const Education = Object.freeze({
  NONE: "none",
  PRIMARY_SCHOOL: "primary school",
  HIGH_SCHOOL: "high school",
  BACHELORS: "bachelor's",
  MASTERS: "master's",
  PHD: "phd"
});

// JSDoc type hints (optional, for editor intellisense)
/**
 * @typedef {Object} Location
 * @property {string} address
 * @property {string} city
 * @property {string} country
 */

/**
 * @typedef {Object} User
 * @property {string} username
 * @property {string} full_name
 * @property {string} email
 * @property {string} password
 * @property {string} [profile_photo]
 * @property {number} age
 * @property {string} gender
 * @property {string} marital_status
 * @property {string} education
 * @property {Location} location
 * @property {number} children_count
 * @property {boolean} is_verified
 * @property {Date} created_at
 * @property {Date} updated_at
 */

/**
 * @typedef {Object} OTP
 * @property {string} email
 * @property {string} code
 * @property {Date} expires_at
 * @property {Date} created_at
 */

/**
 * @typedef {Object} JwtPayload
 * @property {string} userId
 * @property {string} username
 * @property {string} email
 */

module.exports = {
  Gender,
  MaritalStatus,
  Education
  // Interfaces are just for documentation in JS, not exported
};
