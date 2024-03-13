// Core
import { NextFunction, Request, Response } from 'express';

// Models
import PostModel from '../service/database/model/post.model';
import { IUserModel } from '../service/database/model/user.model';

// Helpers
import { RequestStatusCodes } from '../const/request-status-codes';
import { ForbiddenError, NotFoundError } from '../errors';

export async function createPost(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user as IUserModel;
    const { title, body } = req.body;

    const post = new PostModel({
      title,
      body,
      author: user._id,
    });
    await post.save();

    res.status(RequestStatusCodes.Created).json({ post: post.toJSON() });
  } catch (e) {
    next(e);
  }
}

export async function getPosts(req: Request, res: Response) {
  const posts = await PostModel.find();

  res.json({ posts: posts.map((post) => post.toJSONShort()) });
}

export async function getPost(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const post = await PostModel.findById(id).populate('author');
    if (!post) {
      return next(new NotFoundError(`Post not found`));
    }

    res.status(RequestStatusCodes.Created).json({ post: post.toJSON() });
  } catch (e) {
    next(e);
  }
}

export async function updatePost(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      params: { id },
      body,
    } = req;

    const post = await PostModel.findById(id);
    if (!post) {
      return next(new NotFoundError('Post not found'));
    }

    const user = req.user as IUserModel;
    if (!post.isAuthor(user)) {
      return next(new ForbiddenError());
    }

    const updatedPost = await PostModel.findByIdAndUpdate(id, body, { new: true });
    if (!updatedPost) {
      return next(new NotFoundError('Post not found'));
    }

    res.status(RequestStatusCodes.Success).json({
      post: updatedPost.toJSON(),
    });
  } catch (e) {
    next(e);
  }
}

export async function updatePostPartially(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      params: { id },
      body,
    } = req;

    const post = await PostModel.findById(id);
    if (!post) {
      return next(new NotFoundError('Post not found'));
    }

    const user = req.user as IUserModel;
    if (!post.isAuthor(user)) {
      return next(new ForbiddenError());
    }

    const updatedPost = await PostModel.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!updatedPost) {
      return next(new NotFoundError('Post not found'));
    }

    res.status(RequestStatusCodes.Success).json({
      post: updatedPost.toJSON(),
    });
  } catch (e) {
    next(e);
  }
}

export async function deletePost(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const post = await PostModel.findById(id).populate('author');
  if (!post) {
    return next(new NotFoundError('Post not found'));
  }

  const user = req.user as IUserModel;
  if (!post.isAuthor(user)) {
    return next(new ForbiddenError());
  }

  await PostModel.deleteOne({ _id: id });

  res.status(RequestStatusCodes.Success).json({ post: post.toJSON() });
}
