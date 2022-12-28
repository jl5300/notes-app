import './NewNoteButton.css';
import { Note } from '../Types'
import React from 'react';

export default function NewNoteButton(props: any) {
    const handleClick = (event: React.MouseEvent): void => {
        (async (): Promise<void> => {
            try {
                const data: Note = await (
                    await fetch('/notes', { method: 'POST' })
                ).json();
    
                // Add some type of error checking
                // Check against possible responses from API
                // Make use of data declared above
    
                props.focusNote(data);
            } catch (error) {
                console.error(error);
            }
        })();
    
        props.refreshNotes();
    }

    return (
        <li className="new-note-button" onClick={handleClick}>
            <span className="material-symbols-outlined">
                note_add
            </span>
            <span>
                Create new note
            </span>
        </li>
    );
}