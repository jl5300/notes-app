import { useState, useEffect } from 'react';
import PostEditor from './components/PostEditor';
import PostsList from './components/PostsList';
import appConfig from './config/app.config';
import Post from './types/Post';
import './App.css';

const defaultPost: Post = {
	title: 'No posts',
	content: 'Create one to get started.'
};

function App() {
	const [posts, setPosts] = useState<Array<Post>>([]);
	const [status, setStatus] = useState<string>('');
	const [focusedPost, setFocusedPost] = useState<Post>(defaultPost);

	const updatePosts = async (focusFirstPost=false, updateStatus=false) => {
		setStatus('Getting posts from database...');
	
		try {
			const res = await fetch(appConfig.dbServer);
			const data = await res.json();
			
			if (!res.ok) {
				console.log(res);
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
	
	// Set up initial display on page load
	useEffect(() => {
		updatePosts(true, true);
	}, []);

	return (
		<div className="App">
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

export default App;
