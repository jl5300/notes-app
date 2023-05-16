import React, { useEffect, useState, useRef } from 'react';
import db from '../config/app.config';
import Post from '../types/Post';
import './PostEditor.css';

export default function PostEditor(props: any) {
    const focusedPost = props.focusedPost;
    const setStatus = props.setStatus;
    const [state, setState] = useState<Post>(focusedPost);

    // Using a ref to avoid useEffect firing on initial render
    // since state is already initialized to focusedPost
    const initialRender = useRef<boolean>(true);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        } else {
            setState(focusedPost);
        }
    }, [focusedPost]);

    const handleSaveClick = async (event: React.MouseEvent<HTMLSpanElement>) => {
        if (!focusedPost._id) {
            return;
        }
        
        setStatus('Saving post to database...');

        try {
            const res = await fetch(`${db.posts}/${focusedPost._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state)
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }
        } catch (err: any) {
            setStatus(err.message);
            return;
        }
    
        props.refreshPosts();
        setStatus('Saved post successfully.');
    }

    const handleDeleteClick = async (event: React.MouseEvent<HTMLSpanElement>) => {
        if (!focusedPost._id) {
            return;
        }

        setStatus('Deleting post from database...');

        try {
            const res = await fetch(`${db.posts}/${focusedPost._id}`, {
                method: 'DELETE'
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }
        } catch (err: any) {
            setStatus(err.message);
            return;
        }
    
        props.refreshPosts(true);
        setStatus('Deleted post successfully.');
    }

    return (
        <section className="post-editor">
            <textarea
                className="focused-post-title"
                onChange={(event) => setState({ ...state, title: event.target.value })}
                value={state.title || ''}
            />
            <textarea
                className="focused-post-content"
                onChange={(event) => setState({ ...state, content: event.target.value })}
                value={state.content || ''}
            />
            {
                props.user === focusedPost.author ?
                <div className="buttons">
                    <button onClick={handleSaveClick}>
                        Save
                    </button>
                    <button onClick={handleDeleteClick}>
                        Delete
                    </button>
                </div> :
                null
            }
        </section>
    );
}