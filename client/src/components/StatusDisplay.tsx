import db from '../config/app.config';
import './StatusDisplay.css';

export default function StatusDisplay(props: any) {
    const setStatus = props.setStatus;

    const handleClick = async (event: React.MouseEvent<HTMLDivElement>) => {
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

        props.refreshPosts();
        setStatus('Created post successfully.');
    }

    return (
        <div className='status-display'>
            <span className='status'>
                {props.status}
            </span>
            {
                props.user ?
                <span
                    className='material-symbols-outlined'
                    onClick={handleClick}
                    title='Create new post'
                >
                    add
                </span> :
                null
            }
        </div>
    );
}