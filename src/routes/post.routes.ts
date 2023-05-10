import { Router } from 'express';
import Post from '../models/post.model';

const router = Router();
const notFound = (id: string): string => {
	return `Post not found with id ${id}.`;
};

// Create a new post
router.post('/', async (req, res) => {
	const post = new Post({
		title: req.body.title || 'Untitled Post',
		content: req.body.content || 'Empty post.',
        author: req.body.author
	});

	try {
		res.send(await post.save());
	} catch(err: any) {
		res.status(500).send({
			message: err.message || 'Error occurred while creating post.'
		});
	}
});

// Retrieve all posts
router.get('/', async (req, res) => {
	try {
		res.send(await Post.find());
	} catch(err: any) {
		res.status(500).send({
			message: err.message || 'Error occurred while retrieving posts.'
		});
	}
});

// Retreive a single post with postId
router.get('/:postId', async (req, res) => {
	const postId = req.params.postId;

	try {
		const postFound = await Post.findById(postId);

		if (!postFound) {
			return res.status(404).send({
				message: notFound(postId)
			});
		}

		res.send(postFound);
	} catch(err: any) {
		if (err.kind === 'ObjectId' || err.name === 'NotFound') {
			return res.status(404).send({
				message: notFound(postId)
			});
		}

		return res.status(500).send({
			message: err.message || `Error retrieving post with id ${postId}.`
		});
	}
});

// Update a post with postId
router.put('/:postId', async (req, res) => {
	const postId = req.params.postId;

	try {
		const modifiedPost = await Post.findByIdAndUpdate(postId, {
			title: req.body.title || 'Untitled Post',
			content: req.body.content || 'Empty post'
		}, { new: true });

		if (!modifiedPost) {
			return res.status(404).send({
				message: notFound(postId)
			});
		}

		res.send(modifiedPost);
	} catch(err: any) {
		if (err.kind === 'ObjectId' || err.name === 'NotFound') {
			return res.status(404).send({
				message: notFound(postId)
			});
		}

		return res.status(500).send({
			message: err.message || `Error updating post with id ${postId}.`
		});
	}
});

// Delete a post with postId
router.delete('/:postId', async (req, res) => {
	const postId = req.params.postId;
	
	try {
		if (!await Post.findByIdAndDelete(postId)) {
			return res.status(404).send({
				message: notFound(postId)
			});
		}

		res.send({ message: 'Post deleted successfully.' })
	} catch(err: any) {
		if (err.kind === 'ObjectId' || err.name === 'NotFound') {
			return res.status(404).send({
				message: notFound(postId)
			});
		}

		return res.status(500).send({
			message: err.message || `Could not delete post with id ${postId}.`
		});
	}
});

export default router;