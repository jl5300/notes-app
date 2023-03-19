import { render, screen, within, waitFor } from '@testing-library/react';
import noteActions from './__mocks__/noteActions.json';
import getExisting from './__mocks__/getExisting.json';
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';
import Note from './types/Post';
import App from './App';

/*
 * The states of all other components depend on the state of the
 * app component. Therefore, all tests are located within this app
 * component test file.
*/

const NOTES = {
    NEW: {
        TITLE: /untitled note/i,
        CONTENT: /empty note/i
    },
    TEST: {
        TITLE: /test/i,
        CONTENT: /example/i
    }
};
const EDITOR_DEFAULT = {
    TITLE: /no notes/i,
    CONTENT: /create one to get started/i
};
const CREATE_NOTE_LABEL = /create new note/i;

function setup(mockResponse: Array<Note>): void {
    fetchMock.once(JSON.stringify(mockResponse));
    render(<App />);
}

describe('Notes list', () => {
    it('renders create note button', async () => {
        setup([]);
        const notesList = screen.getByRole('list');

        expect(within(notesList).getByText(CREATE_NOTE_LABEL)).toBeInTheDocument();
        await waitFor(() => within(notesList).findByText(CREATE_NOTE_LABEL));
    });

    it('updates display on render', async () => {
        setup(getExisting.oneTitled);
        const notesList = screen.getByRole('list');

        expect(within(notesList).queryByText(NOTES.TEST.TITLE)).not.toBeInTheDocument();
        await waitFor(() => within(notesList).findByText(NOTES.TEST.TITLE));
    });
});

describe('Create note button', () => {
    it('adds note to list and focuses on click', async () => {
        setup([]);
        const notesList = screen.getByRole('list');
        fetchMock.once(JSON.stringify(noteActions.create));
        fetchMock.once(JSON.stringify(getExisting.oneUntitled));
        
        userEvent.click(within(notesList).getByText(CREATE_NOTE_LABEL));
        await waitFor(() => within(notesList).findByText(NOTES.NEW.TITLE));
        await waitFor(() => within(notesList).findByText(NOTES.NEW.CONTENT));

        const [ focusedTitle, focusedContent ] = screen.getAllByRole('textbox');
        await waitFor(() => within(focusedTitle).findByText(NOTES.NEW.TITLE));
        await waitFor(() => within(focusedContent).findByText(NOTES.NEW.CONTENT));
    });
});

describe('Note editor', () => {
    it('renders default message', async () => {
        setup([]);
        const [ title, content ] = screen.getAllByRole('textbox');

        expect(within(title).getByText(EDITOR_DEFAULT.TITLE)).toBeInTheDocument();
        expect(within(content).getByText(EDITOR_DEFAULT.CONTENT)).toBeInTheDocument();

        await waitFor(() => within(title).findByText(EDITOR_DEFAULT.TITLE));
        await waitFor(() => within(content).findByText(EDITOR_DEFAULT.CONTENT));
    });


    // Giving act(...) error and I don't know why
    // On useEffect(() => setState(focusedNote), []) in noteEditor
    it('updates display on render', async () => {
        setup(getExisting.oneTitled);
        const [ title, content ] = screen.getAllByRole('textbox');

        expect(within(title).getByText(EDITOR_DEFAULT.TITLE)).toBeInTheDocument();
        expect(within(content).getByText(EDITOR_DEFAULT.CONTENT)).toBeInTheDocument();

        await waitFor(() => within(title).findByText(NOTES.TEST.TITLE));
        await waitFor(() => within(content).findByText(NOTES.TEST.CONTENT));
    });
});