import './NewPostEditor.css';
import { useState } from 'react';
import db from '../config/app.config';

export default function NewPostEditor(props: any) {
    const [newPost, setNewPost] = useState({title: props.title, content: props.content});

    const handlePostClick = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        try {
            // Using fetch because axios does not send POST request body
            let method = 'POST';
            let destination = db.posts;

            if (props.id) {
                method = 'PUT';
                destination += `/${props.id}`
            }

            const res = await fetch(destination, {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: newPost.title,
                    content: newPost.content,
                    author: props.user
                }),
                mode: 'cors'
            });

            if (!res.ok) {
                throw new Error(await res.json())
            }
            
            setNewPost({title: '', content: ''});
            await props.refreshPosts();

            if (props.setModalOpen) {
                props.setModalOpen(false);
            }
        }
        catch (err: any) {
            console.log(err.message);
        }
    }

    return (
        <div className='new-post-input'>
            <textarea 
                className='title'
                placeholder="What's on your mind?"
                value={newPost.title}
                onChange={(event) => setNewPost({...newPost, title: event.target.value})}
            />
            <textarea
                className='content'
                placeholder='Add body text...'
                value={newPost.content}
                onChange={(event) => setNewPost({...newPost, content: event.target.value})}
            />
            <button 
                onClick={handlePostClick}
                disabled={!newPost.title || !newPost.content}
            >
                Post
            </button>
        </div>
    )
}