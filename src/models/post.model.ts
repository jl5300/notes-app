import mongoose, { Types } from 'mongoose';
import { IUser } from './user.model';

interface IPost {
    title: string;
    content: string;
    authorId: Types.ObjectId;
    author: null | IUser;
};

const PostSchema = new mongoose.Schema<IPost>({
	title: String,
	content: String,
    authorId: Types.ObjectId,
    author: null || Object
    ,
}, {
	timestamps: true,
});

export { IPost };
export default mongoose.model('Post', PostSchema);