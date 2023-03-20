import { useState, useRef } from 'react';
import './SortDropdown.css';

const SORT = {
    ALPHABET: 'Alphabet',
    DATE: 'Date',
};

export default function SortDropdown(props: any) {
    const [ open, setOpen ] = useState<boolean>(false);
    const [ buttonText, setButtonText ] = useState<string>(SORT.DATE);

    const lastSortClicked = useRef<string>(SORT.DATE);
    const sortAscending = useRef<boolean>(true);

    const handleSortClick = (property: string) => {
        let criteria: string;

        switch (property) {
            case SORT.ALPHABET:
                criteria = 'title';
                break;

            case SORT.DATE:
                criteria = 'updatedAt'
                break;

            default:
                console.error(`Sort called with invalid argument: ${property}`);
                return;
        }

        if (property === lastSortClicked.current) {
            sortAscending.current = !sortAscending.current;
        }

        else {
            sortAscending.current = true;
            lastSortClicked.current = property;
            setButtonText(property);
        }

        props.setPosts(props.posts.slice().sort((a: any, b: any) => {
            if (a[criteria] === b[criteria]) {
                return 0;
            }

            if (sortAscending.current) {
                if (a[criteria] < b[criteria]) {
                    return -1;
                }

                return 1;
            }

            else {
                if (a[criteria] > b[criteria]) {
                    return -1;
                }

                return 1;
            }
        }));

        setOpen(false);
    }

    const menuItems = [SORT.ALPHABET, SORT.DATE].map((value) => {
        return (
            <li key={value} className="menu-item" onClick={() => {handleSortClick(value)}}>
                {value}
            </li>
        );
    });

    return (
        <div className="dropdown">
            <label htmlFor="sort-button" className="sort-by-label">
                Sort by:
            </label>
            <button id="sort-button" onClick={() => setOpen(!open)}>
                <span className="label">
                    {buttonText}
                </span>
                <span
                    className="material-symbols-outlined"
                    style={{ transform: `rotate(${open ? '180deg' : '0'})` }}
                >
                    expand_more
                </span>
            </button>
            {open ? (
                <ul className="menu">
                    {menuItems}
                </ul>
            ) : null}
        </div>
    )
}