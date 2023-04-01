import { useState, useEffect } from 'react';
import PostEditor from '../components/PostEditor';
import PostsList from '../components/PostsList';
import { db } from '../config/app.config';
import Post from '../types/Post';
import './Home.css';

const defaultPost: Post = {
	title: 'No posts',
	content: 'Create one to get started.'
};

export default function Home() {
    const [posts, setPosts] = useState<Array<Post>>([]);
	const [status, setStatus] = useState<string>('');
    const [user, setUser] = useState<string | null>(null);
	const [focusedPost, setFocusedPost] = useState<Post>(defaultPost);

	const updatePosts = async (focusFirstPost=false, updateStatus=false) => {
		setStatus('Getting posts from userbase...');
	
		try {
			const res = await fetch(db.posts);
			const data = await res.json();
			
			if (!res.ok) {
				throw new Error(data.message);
			}
			
			setPosts(data);

			if (focusFirstPost) {
				setFocusedPost(data.length ? data[0] : defaultPost);
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

            // Status if no user logged in is 204, so it won't
            // be caught by the above conditional
            if (res.status == 200) {
                setUser(currentUser.username);
            }
        }
        catch (err: any) {
            console.log(err.message);
        }
    }
	
	// Set up initial display on page load
	useEffect(() => {
		updatePosts(true, true);
        fetchUser();
	}, []);

	return (
		<div>
            <header>
                <div className='welcome-message'>
                    {
                        user ?
                        <p>Welcome {user}! <a href='/logout' onClick={() => setUser(null)}>Log Out</a></p> :
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
		</div>
	);
}