import React, { useState, useEffect } from 'react';
import parseTimestamp from '../utils/parseTimestamp';
import PostEditor from '../components/PostEditor';
import NavBar from '../components/NavBar';
import Modal from '../components/Modal';
import db from '../config/app.config';
import User from '../types/User';
import Post from '../types/Post';
import axios from 'axios';
import './Home.css';

export default function Home(props: any) {
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState<Boolean>(false);
    const [isEditPostOpen, setEditPostOpen] = useState<Boolean>(false);
    const [activePost, setActivePost] = useState<Post>({
        title: '', content: '', author: {username: '', profilePicture: null, _id: ''}
    });

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
                    setUser(res.data);
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

        const profilePictureUrl = post.author.profilePicture ?
            post.author.profilePicture :
            '/default-profile.png';

        console.log(post.author.profilePicture);

        return (
            <li className='post' key={post._id}>
                <div className='header'>
                    <span className='top-left'>
                        <span className='profile-picture'>
                            <img src={profilePictureUrl} alt='Profile Picture' />
                        </span>
                        <span className='text'>
                            <h2 className='title'>{post.title}</h2>
                            <p className='username'>{'@' + post.author.username}</p>
                        </span>
                    </span>
                    {user && (
                        user.username === post.author.username &&
                        <span
                            className='material-symbols-outlined'
                            onClick={handleEditClick}
                        >
                            edit
                        </span>
                        )
                    }
                </div>
                <p className='content'>{post.content}</p>
                <div className='extras'>
                    <p className='timestamp'>{date} | {time}</p>
                    {user && (
                        user.username === post.author.username &&
                        <span
                            className='material-symbols-outlined'
                            onClick={handleDeleteClick}
                        >
                            delete
                        </span>
                        )
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
                    <PostEditor
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
                        <PostEditor
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