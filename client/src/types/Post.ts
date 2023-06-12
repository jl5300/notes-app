import User from '../types/User';

export default interface Post {
    title: string;
	content: string;
    author: User;
	_id?: string;
	updatedAt?: string;
}