import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

// Define user roles
export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  STAFF = "staff",
}

// Define permissions based on roles
export const RolePermissions = {
  [UserRole.ADMIN]: [
    "user:read",
    "user:create",
    "user:update",
    "user:delete",
    "inventory:read",
    "inventory:create",
    "inventory:update",
    "inventory:delete",
    "role:manage",
    "settings:manage",
  ],
  [UserRole.MANAGER]: [
    "user:read",
    "inventory:read",
    "inventory:create",
    "inventory:update",
    "inventory:delete",
  ],
  [UserRole.STAFF]: ["inventory:read", "inventory:create", "inventory:update"],
};

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  getPermissions(): string[];
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.STAFF,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user permissions based on role
userSchema.methods.getPermissions = function (): string[] {
  return RolePermissions[this.role as UserRole] || [];
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
