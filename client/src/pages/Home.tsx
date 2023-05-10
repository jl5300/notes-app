import { useState, useEffect } from 'react';
import PostEditor from '../components/PostEditor';
import PostsList from '../components/PostsList';
import db from '../config/app.config';
import Post from '../types/Post';
import './Home.css';

const dummyPost: Post = {
    title: 'No posts.',
    content: 'Be the first to share with the world!',
    author: ''
};

export default function Home() {
    const [posts, setPosts] = useState<Array<Post>>([]);
	const [status, setStatus] = useState<string>('');
    const [user, setUser] = useState<string>('');
	const [focusedPost, setFocusedPost] = useState<Post>(dummyPost);

	const updatePosts = async (focusFirstPost=false, updateStatus=false) => {
		setStatus('Getting posts from database...');
	
		try {
			const res = await fetch(db.posts);
			const data = await res.json();
			
			if (!res.ok) {
				throw new Error(data.message);
			}
			
			setPosts(data);

			if (focusFirstPost) {
				setFocusedPost(data.length ? data[0] : dummyPost);
			}
		} catch (err: any) {
			setStatus(err.message);
			return;
		}

		if (updateStatus) {
			setStatus('Updated posts successfully.');
		}
	}

    const fetchUser = async () => {
        try {
            const res = await fetch(db.user);
            const currentUser = await res.json();
            
            if (!res.ok) {
				throw new Error(currentUser.message);
			}
            
            if (currentUser) {
                setUser(currentUser.username);
            }
        }
        catch (err: any) {
            console.log('No user logged in.');
        }
    }
	
	// Set up initial display on page load
	useEffect(() => {
		updatePosts(true, true);
        fetchUser();
	}, []);

	return (
		<>
            <header>
                <div className='welcome-message'>
                    {
                        user ?
                        <p>Welcome {user}! <a href='/logout'>Log Out</a></p> :
                        <a className='login-link' href='/login'>Log In</a>
                    }
                </div>
            </header>
			<main>
				<PostEditor
					post={focusedPost}
					setStatus={setStatus}
					updatePosts={updatePosts}
				/>
				<PostsList
                    user={user}
					posts={posts}
					status={status}
					setPosts={setPosts}
					setStatus={setStatus}
					updatePosts={updatePosts}
					focusedPost={focusedPost}
					setFocusedPost={setFocusedPost}
				/>
			</main>
			<div className="credits">
				<a target="_blank" rel="noopener noreferrer" href="https://icons8.com/icon/3mZCmvlo0TiW/post">
                    Note
                </a> icon by <a target="_blank" rel="noopener noreferrer" href="https://icons8.com">
                    Icons8
                </a>
			</div>
		</>
	);
}