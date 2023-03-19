import mongoose from 'mongoose';

interface IPost {
	title: string;
	content: string;
}

const PostSchema = new mongoose.Schema<IPost>({
	title: String,
	content: String,
}, {
	timestamps: true,
});

export default mongoose.model<IPost>('Post', PostSchema);