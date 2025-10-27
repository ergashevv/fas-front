import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAddress {
  fullName: string;
  phone: string;
  country: string;
  city: string;
  street: string;
  zip: string;
  isDefault?: boolean;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone: string;
  addresses: IAddress[];
  wishlist: string[];
  recentlyViewed: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AddressSchema = new Schema<IAddress>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  zip: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
}, { _id: false });

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, lowercase: true, sparse: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true, index: true },
    addresses: { type: [AddressSchema], default: [] },
    wishlist: { type: [String], default: [] },
    recentlyViewed: { type: [String], default: [] }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    }
  }
);

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  if (!this.password) {
    return next(new Error('Password is required'));
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);

