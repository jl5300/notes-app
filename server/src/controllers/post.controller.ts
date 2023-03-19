import Post from '../models/post.model';
import { Request, Response } from 'express';

// Helper function to eliminate string literal repetition
function postNotFoundMessage(id: string): string {
	return `Post not found with id ${id}.`;
}

export async function createOne(req: Request, res: Response) {
	const post = new Post({
		title: req.body.title || "Untitled Post",
		content: req.body.content || "Empty post"
	});

	try {
		res.send(await post.save());
	} catch(err: any) {
		res.status(500).send({
			message: err.message || "Error occurred while creating post."
		});
	}
}

export async function findAll(req: Request, res: Response) {
	try {
		res.send(await Post.find());
	} catch(err: any) {
		res.status(500).send({
			message: err.message || "Error occurred while retrieving posts."
		});
	}
}

export async function findOne(req: Request, res: Response) {
	const postId = req.params.postId;

	try {
		const postFound = await Post.findById(postId);

		if (!postFound) {
			return res.status(404).send({
				message: postNotFoundMessage(postId)
			});
		}

		res.send(postFound);
	} catch(err: any) {
		if (err.kind === 'ObjectId' || err.name === 'NotFound') {
			return res.status(404).send({
				message: postNotFoundMessage(postId)
			});
		}

		return res.status(500).send({
			message: err.message || `Error retrieving post with id ${postId}.`
		});
	}
}

export async function updateOne(req: Request, res: Response) {
	const postId = req.params.postId;

	try {
		const modifiedPost = await Post.findByIdAndUpdate(postId, {
			title: req.body.title || "Untitled Post",
			content: req.body.content || "Empty post"
		}, { new: true });

		if (!modifiedPost) {
			return res.status(404).send({
				message: postNotFoundMessage(postId)
			});
		}

		res.send(modifiedPost);
	} catch(err: any) {
		if (err.kind === 'ObjectId' || err.name === 'NotFound') {
			return res.status(404).send({
				message: postNotFoundMessage(postId)
			});
		}

		return res.status(500).send({
			message: err.message || `Error updating post with id ${postId}.`
		});
	}
}

export async function deleteOne(req: Request, res: Response) {
	const postId = req.params.postId;
	
	try {
		if (!await Post.findByIdAndDelete(postId)) {
			return res.status(404).send({
				message: postNotFoundMessage(postId)
			});
		}

		res.send({ message: "Post deleted successfully." })
	} catch(err: any) {
		if (err.kind === 'ObjectId' || err.name === 'NotFound') {
			return res.status(404).send({
				message: postNotFoundMessage(postId)
			});
		}

		return res.status(500).send({
			message: err.message || `Could not delete post with id ${postId}.`
		});
	}
}