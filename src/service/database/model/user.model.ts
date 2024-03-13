// Core
import { Document, Schema, model } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

// Helpers
import bcrypt from 'bcrypt';

export interface IUserModel extends Document {
  username: string;
  email: string;
  password: string;
  createHashedPassword(password: string): string;
  validPassword(password: string): boolean;
}

const UserSchema = new Schema<IUserModel>(
  {
    username: {
      type: Schema.Types.String,
      unique: true,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      unique: true,
      required: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.methods.toJSON = function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
  };
};

UserSchema.methods.createHashedPassword = function (password: string): string {
  const salt = bcrypt.genSaltSync(6);
  return bcrypt.hashSync(password, salt);
};

UserSchema.methods.validPassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.plugin(mongooseUniqueValidator, { message: 'must be unique' });

UserSchema.pre('save', async function (next) {
  this.password = this.createHashedPassword(this.password);

  next();
});

export default model<IUserModel>('User', UserSchema);
