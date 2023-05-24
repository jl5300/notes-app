import React, { useState, useEffect, useRef } from 'react';
import parseTimestamp from '../utils/parseTimestamp';
import NewPostEditor from '../components/NewPostEditor';
import NavBar from '../components/NavBar';
import Modal from '../components/Modal';
import db from '../config/app.config';
import Post from '../types/Post';
import axios from 'axios';
import './Feed.css';

export default function Feed(props: any) {
    const [user, setUser] = useState<string>('');
    const [posts, setPosts] = useState<Post[]>([]);
    const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState<Boolean>(false);
    const [isEditPostOpen, setEditPostOpen] = useState<Boolean>(false);
    const [activePost, setActivePost] = useState<Post>({title: '', content: '', author: ''});

    // Fetch posts and current user on page load
    useEffect(() => {
        (async () => {
            try {
                await refreshPosts();

                const res = await axios.get(db.user);
                if (res.status !== 200) {
                    throw new Error(res.data);
                }

                if (res.data) {
                    setUser(res.data.username);
                }
            } catch (err: any) {
                console.log(err.message);
            }
        })();
    }, []);

    const refreshPosts = async (): Promise<void> => {
        try {
            const res = await axios.get(db.posts);
            if (res.status !== 200) {
                throw new Error(res.data);
            }
    
            // Reverse list order because we want newest posts first
            setPosts(res.data.reverse());
        } catch (err: any) {
            console.log(err.message);
        }
    }

    const deleteActivePost = async (): Promise<void> => {
        try {
            const res = await axios.delete(`${db.posts}/${activePost._id}`);

            if (res.status !== 200) {
                throw new Error(res.data.message);
            }

            await refreshPosts();
        } catch (err: any) {
            console.log(err.message);
        }
    }

    const postsList = posts.map((post) => {
        const { date, time } = parseTimestamp(post.updatedAt);

        const handleDeleteClick = async (event: React.MouseEvent<HTMLSpanElement>) => {
            setActivePost(post);
            setConfirmDeleteOpen(true);
        }

        const handleEditClick = async (event: React.MouseEvent<HTMLSpanElement>) => {
            setActivePost(post);
            setEditPostOpen(true);
        }

        return (
            <li className='post' key={post._id}>
                <div className='header'>
                    <h2 className='title'>{post.title}</h2>
                    {
                        user === post.author &&
                        <span
                            className='material-symbols-outlined'
                            onClick={handleEditClick}
                        >
                            edit
                        </span>
                    }
                </div>
                <p className='author'>{'@' + post.author}</p>
                <p className='content'>{post.content}</p>
                <div className='extras'>
                    <p className='timestamp'>{date} | {time}</p>
                    {
                        user === post.author &&
                        <span
                            className='material-symbols-outlined'
                            onClick={handleDeleteClick}
                        >
                            delete
                        </span>
                    }
                </div>
            </li>
        )
    });

    return (
        <>
            <NavBar user={user} setUser={setUser} />
            <div className='container'>
                <Modal
                    title='Edit post'
                    isOpen={isEditPostOpen}
                    setOpen={setEditPostOpen}
                >
                    <NewPostEditor
                        user={user}
                        id={activePost._id}
                        title={activePost.title}
                        content={activePost.content}
                        refreshPosts={refreshPosts}
                        setModalOpen={setEditPostOpen}
                    />
                </Modal>
                <Modal
                    title='Are you sure you want to delete this post?'
                    deletePost={deleteActivePost}
                    isOpen={isConfirmDeleteOpen}
                    setOpen={setConfirmDeleteOpen}
                >
                    It will be deleted forever.
                </Modal>
                <h1>News Feed</h1>
                <ul>
                    {
                        user &&
                        <NewPostEditor
                            title=''
                            content=''
                            user={user}
                            refreshPosts={refreshPosts}
                        />
                    }
                    {
                        postsList.length ?
                        postsList :
                        <p>No posts.</p>
                    }
                </ul>
            </div>
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