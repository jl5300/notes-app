import appConfig from '../config/app.config';
import './NewPostButton.css';
import React from 'react';

export default function NewPostButton(props: any) {
    const setStatus = props.setStatus;

    const handleClick = async (event: React.MouseEvent<HTMLDivElement>) => {
        setStatus('Creating new post in database...');

        try {
            const res = await(fetch(appConfig.dbServer, { method: 'POST' }));
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            props.setFocusedPost(data);
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