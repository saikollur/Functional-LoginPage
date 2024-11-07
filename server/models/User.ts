import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define an interface for your User schema
interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  mobileNumber: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  country: string;
  receiveEmails: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the User schema
const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other'],
    },
    country: {
      type: String,
      required: true,
    },
    receiveEmails: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Pre-save hook for password hashing
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Add the comparePassword method to the schema
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the User model
export const User = mongoose.model<IUser>('User', userSchema);
