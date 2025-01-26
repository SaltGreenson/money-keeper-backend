import { model, Schema } from 'mongoose'

export enum UserStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  BLOCKED = 'BLOCKED'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER'
}

export interface IUser {
  _id: string
  name: string
  email: string
  status: UserStatus
  password: string
  roles: UserRole[]
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    status: { type: String, enum: UserStatus, default: UserStatus.DRAFT },
    password: { type: String },
    roles: { type: [String], default: [UserRole.USER] }
  },
  { timestamps: true }
)

export const User = model<IUser>('User', userSchema)
