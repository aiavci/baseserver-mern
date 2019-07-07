/*
 * Copyright (c) 2019 Ali I. Avci
 */

import {Blog} from '@models';
import { Controller, Delete, Get, Post, Put } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { NextFunction, Request, Response } from 'express';

@Controller('api/blog')
export class BlogController {

  /**
   * Get all blogs
   *
   * @param req HTTP request
   * @param res HTTP response
   */
  @Get()
  private async getAllBlogs(req: Request, res: Response, next: NextFunction) {
    Logger.Info('Getting all posts');

    try {
      const allBlogs = await Blog.find();

      res.send(allBlogs);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get blog with [id] param
   *
   * @param req HTTP request
   * @param res HTTP response
   */
  @Get(':id')
  private async getBlog(req: Request, res: Response, next: NextFunction) {
    Logger.Info(req.params.id);

    try {
      const blog = await Blog.find({
        _id: req.params.id,
      });

      res.send(blog);
    } catch (error) {
      next(error);
    }
  }

  @Put()
  private async putBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const blog = await Blog.update({
        _id: req.body.id,
      }, {
        title: req.body.title,
        body: req.body.body,
      });

      return res.send(blog);
    } catch (error) {
      next(error);
    }
  }

  @Post()
  private async postBlog(req: Request, res: Response, next: NextFunction) {
    if (req.isUnauthenticated()) {
      return res.send('Please login');
    }

    try {
      const blog = await Blog.create({
        title: req.body.title,
        body: req.body.body,
      });

      return res.send(blog);
    } catch (error) {
      next(error);
    }
  }

  @Delete()
  private async delBlog(req: Request, res: Response, next: NextFunction) {
    if (req.isUnauthenticated()) {
      return res.send('Please login');
    }

    try {
      const blog = await Blog.deleteOne({
        _id: req.body.id,
      });

      return res.send(blog);
    } catch (error) {
      next(error);
    }
  }
}
