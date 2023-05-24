import { NavLink } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import db from '../config/app.config';
import axios from 'axios';
import './NavBar.css';

export default function NavBar(props: any) {
    const [open, setOpen] = useState<Boolean>(false);
    const menuRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const handleMouseDown = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('keydown', handleEscapeKey);
        }
    }, []);

    const handleProfileClick = (): void => {
        const wasOpen = open;
        setOpen(false);
        if (!wasOpen) {
            setOpen(true);
        }
    };

    const handleLogoutClick = async () => {
        try {
            await axios.post(`${db.user}/logout`);
        } catch (err: any) {
            console.log(err.message);
        }
        setOpen(false);
        props.setUser('');
    };

    return (
        <nav className='nav'>
            <NavLink to='/' className='material-symbols-outlined' title='Home'>
                home
            </NavLink>
            {
                props.user ? (
                    <span
                        className='material-symbols-outlined'
                        title='Profile'
                        onClick={handleProfileClick}
                    >
                        account_circle
                    </span>
                ) : <NavLink to='/login'>Log In</NavLink>
            }
            {
                open && (
                    <ul className='menu' ref={menuRef}>
                        <li className='menu-item'>
                            <button onClick={handleLogoutClick}>Log Out</button>
                        </li>
                    </ul>
                )
            }
        </nav>
    )
}