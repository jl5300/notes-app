import './Modal.css';

export default function Modal(props: any) {
    if (!props.isOpen) {
        return null;
    }

    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <h2>{props.title}</h2>
                <div className='contents'>
                    {props.children}
                </div>
                <div className='buttons'>
                    {
                        props.deletePost &&
                        <button
                            className='confirm-delete-button'
                            onClick={async () => {
                                await props.deletePost();
                                props.setOpen(false);
                            }}
                        >    
                            Yes
                        </button>
                    }
                    <button onClick={() => {props.setOpen(false)}}>
                        {props.deletePost ? 'No' : 'Close'}
                    </button>
                </div>
            </div>
        </div>
    )
}