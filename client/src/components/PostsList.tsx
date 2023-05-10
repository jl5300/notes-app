import parseTimestamp from '../utils/parseTimestamp';
import NewPostButton from './NewPostButton';
import StatusDisplay from './StatusDisplay';
import { useState } from 'react';
import Post from '../types/Post';
import './PostsList.css'

export default function PostsList(props: any) {
    const setFocusedPost = props.setFocusedPost;
    const [ focusedIndex, setFocusedIndex ] = useState<number>(0);
    
    const postsList: Array<JSX.Element> = props.posts.map((post: Post, index: number) => {
        const handleClick = () => {
            setFocusedPost(post);    
            setFocusedIndex(index);
        };

        const { date, time } = parseTimestamp(post.updatedAt);
        let background = undefined;
       
        if (index === focusedIndex) {
           background = 'var(--current-post-active-bg)';
        }

		return (
			<li
                key={post._id}
                className="posts"
                style={{ background: background }}
                onClick={handleClick}
            >
                <span className="previews">
                    <div className="title-preview">
                        {post.title}
                    </div>
                    <div className="content-preview">
                        {'@' + post.author}
                    </div>
                </span>
                <span className="timestamps">
                    <div className="date">
                        {date}
                    </div>
                    <div className="time">
                        {time}
                    </div>
                </span>
			</li>
		);
	});

    return (
        <section className="right-column">
            <div className="list-header">
                <StatusDisplay
                    posts={props.posts}
                    status={props.status}
                    setPosts={props.setPosts}
                />
                <NewPostButton
                    user={props.user}
                    setStatus={props.setStatus}
                    updatePosts={props.updatePosts}
                    setFocusedPost={setFocusedPost}
                />
            </div>
            <ul className="posts-list">
                {postsList}
            </ul>
        </section>
    );
}