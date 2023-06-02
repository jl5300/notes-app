import { NavLink } from 'react-router-dom';
import db from '../config/app.config';
import axios from 'axios';
import './NavBar.css';

export default function NavBar(props: any) {

    const handleLogoutClick = async () => {
        try {
            await axios.post(`${db.user}/logout`);
        } catch (err: any) {
            console.log(err.message);
        }
        props.setUser('');
    };

    return (
        <nav className='nav'>
            <span className='icons'>
                <NavLink to='/' className='material-symbols-outlined' title='Home'>
                    home
                </NavLink>
                <NavLink to='profile' className='material-symbols-outlined' title='Profile'>
                    account_circle
                </NavLink>
            </span>
            {
                props.user ?
                <p onClick={handleLogoutClick} className='link'>Log Out</p>
                : <NavLink to='/login' className='link'>Log In</NavLink>
            }
        </nav>
    )
}