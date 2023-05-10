import db from '../config/app.config';
import './NewPostButton.css';
import React from 'react';

export default function NewPostButton(props: any) {
    const setStatus = props.setStatus;

    const handleClick = async (event: React.MouseEvent<HTMLDivElement>) => {
        if (!props.user) {
            return;
        }

        setStatus('Creating new post in database...');

        try {
            const res = await fetch(
                db.posts, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify({ author: props.user })
                }
            );
            const newPost = await res.json();

            if (!res.ok) {
                throw new Error(newPost.message);
            }

            props.setFocusedPost(newPost);
        } catch (err: any) {
            setStatus(err.message);
            return;
        }

        props.updatePosts();
        setStatus('Created post successfully.');
    }

    return (
        <div
            className="new-post-button"
            onClick={handleClick}
        >
            <span className="material-symbols-outlined">
                post_add
            </span>
            <span>
                Create new post
            </span>
        </div>
    );
}