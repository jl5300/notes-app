import mongoose, { Types } from 'mongoose';
import { IUser } from './user.model';

interface IPost {
    title: string;
    content: string;
    author: IUser
};

const PostSchema = new mongoose.Schema<IPost>({
	title: String,
	content: String,
    author: {
        _id: Types.ObjectId,
        username: String,
        avatar: String
    }
}, {
	timestamps: true,
});

export { IPost };
export default mongoose.model('Post', PostSchema);