export enum Gender {
  MALE = "male",
  FEMALE = "female"
}

export enum MaritalStatus {
  DIVORCEE = "divorcee",
  WIDOW = "widow"
}

export enum Education {
  NONE = "none",
  PRIMARY_SCHOOL = "primary school",
  HIGH_SCHOOL = "high school",
  BACHELORS = "bachelor's",
  MASTERS = "master's",
  PHD = "phd"
}

export interface Location {
  address: string;
  city: string;
  country: string;
}

export interface User {
  username: string;
  full_name: string;
  email: string;
  password: string;
  profile_photo?: string;
  age: number;
  gender: Gender;
  marital_status: MaritalStatus;
  education: Education;
  location: Location;
  children_count: number;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface OTP {
  email: string;
  code: string;
  expires_at: Date;
  created_at: Date;
}

export interface JwtPayload {
  userId: string;
  username: string;
  email: string;
} 