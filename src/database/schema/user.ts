import { Schema, model } from 'mongoose';
import { IUser } from '../../utils/types'

const userSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, required: true },
});

export const userModel = model<IUser>('User', userSchema);

export function findOneById(id: string) {
    throw new Error('Function not implemented.');
}

