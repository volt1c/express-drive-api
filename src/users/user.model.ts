import { Schema, Document, model } from 'mongoose'

export const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  hash: {
    type: Number,
    required: true,
  },
})

export interface IUser extends Document {
  name: string
  hash: string
}

export interface ICreateUser {
  name: IUser['name']
  hash: IUser['hash']
}

export const User = model<IUser>('User', UserSchema)
