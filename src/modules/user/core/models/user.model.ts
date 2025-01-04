import { model, Schema } from 'mongoose'

export enum UserStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  BLOCKED = 'BLOCKED'
}

export interface IUser {
  name: string
  email: string
  status: UserStatus
  password: string
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    status: { type: String, enum: UserStatus, default: UserStatus.DRAFT },
    password: { type: String }
  },
  { timestamps: true }
)

export const User = model<IUser>('User', userSchema)
