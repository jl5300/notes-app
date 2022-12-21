import React, { useState, useEffect, useRef } from 'react';
import { Note, ErrorMessage } from './Types';

function App() {
	const [notes, setNotes] = useState<Array<Note>>([]);
	const inputRef = useRef<HTMLInputElement>(null);

	async function refreshNotes(): Promise<void> {
		try {
			const response: Response = await fetch('/notes');
			const data: Array<Note> | ErrorMessage = await response.json();
			
			if (!Array.isArray(data)) {
				throw new Error(data.message);
			}

			setNotes(data);
		} catch (error: any) {
			let message;

			if (error instanceof Error) {
				message = error.message;
			} else {
				message = String(error);
			}

			console.error(message);
		}
	}
	
	// Fetch existing notes on page load
	useEffect(() => {
		refreshNotes();
	}, []);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
		event.preventDefault();
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				'title': inputRef.current?.value,
				'content': 'New Note'
			}),
		}

		fetch('/notes', requestOptions)
			.then((res: Response) => console.log(res.json()))
			.catch((err: Error) => console.log(err));

		refreshNotes();
	}

	const notesList = notes.map((note) => {
		return (
			<li key={note._id}>{note.title}</li>
		);
	});

	return (
		<div className="App">
			<header className="App-header">
				<p>Welcome to the notes app!</p>
				<form onSubmit={handleSubmit}>
					<label htmlFor="new-note-input">Note name:</label>
					<input type="text" id="new-note-input" ref={inputRef} />
					<input type="submit" />
				</form>
			</header>
			<div className="notes-list">
				<h3>Current notes:</h3>
				<ul>{notesList.length === 0 ? "No notes" : notesList}</ul>
			</div>
		</div>
	);
}

export default App;
