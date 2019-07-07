import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true,
  },
  body: {
    type: String,
    required: true,
  },
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
