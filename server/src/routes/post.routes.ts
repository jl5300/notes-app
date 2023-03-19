import { Router } from 'express';
import * as posts from '../controllers/post.controller';

const router = Router();

// Create a new post
router.post('/', posts.createOne);

// Retrieve all posts
router.get('/', posts.findAll);

// Retreive a single post with postId
router.get('/:postId', posts.findOne);

// Update a post with postId
router.put('/:postId', posts.updateOne);

// Delete a post with postId
router.delete('/:postId', posts.deleteOne);

export default router;