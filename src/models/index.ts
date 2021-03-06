import mongoose from 'mongoose';

import Blog from './blog';
import {User} from './user';

const connectDb = () => {
  const dbUrl = process.env.DATABASE_URL || '';

  return mongoose.connect(dbUrl, {useNewUrlParser: true});
};

export { connectDb };

export { User, Blog };
