import React, { useEffect, useState, useRef } from 'react';
import appConfig from '../config/app.config';
import Post from '../types/Post';
import './PostEditor.css';

export default function PostEditor(props: any) {
    const focusedPost = props.post;
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
            const res = await fetch(`${appConfig.dbUrl}/${focusedPost._id}`, {
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
    
        props.updatePosts();
        setStatus('Saved post successfully.');
    }

    const handleDeleteClick = async (event: React.MouseEvent<HTMLSpanElement>) => {
        if (!focusedPost._id) {
            return;
        }

        setStatus('Deleting post from database...');

        try {
            const res = await fetch(`${appConfig.dbUrl}/${focusedPost._id}`, {
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
    
        props.updatePosts(true);
        setStatus('Deleted post successfully.');
    }

    return (
        <section className="post-editor">
            <textarea
                className="focused-post-title"
                onChange={(event) => setState({ ...state, title: event.target.value })}
                value={state.title}
            />
            <textarea
                className="focused-post-content"
                onChange={(event) => setState({ ...state, content: event.target.value })}
                value={state.content}
            />
            <div className="icons">
                <span
                    className="material-symbols-outlined"
                    onClick={handleSaveClick}
                    title="Save"
                >
                    save
                </span>
                <span
                    className="material-symbols-outlined"
                    onClick={handleDeleteClick}
                    title="Delete"
                >
                    delete
                </span>
            </div>
        </section>
    );
}