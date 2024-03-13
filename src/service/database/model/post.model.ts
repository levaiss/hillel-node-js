// Core
import { Document, Schema, model } from 'mongoose';

// Types
import { IUserModel } from './user.model';

// Helpers
import { truncateWithEllipses } from '../../../utils/truncate';

export interface IPostModel extends Document {
  title: string;
  body: string;
  author: IUserModel;

  isAuthor(user: IUserModel): boolean;
  toJSON(): object;
  toJSONShort(): object;
}

const PostSchema = new Schema<IPostModel>(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

PostSchema.methods.isAuthor = function (user: IUserModel): boolean {
  return this.author.toString() === user._id.toString();
};

PostSchema.methods.toJSON = function () {
  return {
    id: this._id,
    title: this.title,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    author: this.author.toJSON(),
  };
};

PostSchema.methods.toJSONShort = function () {
  return {
    id: this._id,
    title: this.title,
    body: truncateWithEllipses(this.body),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export default model<IPostModel>('Post', PostSchema);
