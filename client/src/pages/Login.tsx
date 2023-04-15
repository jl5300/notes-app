import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

export default function LoginForm(props: any) {
    const display = props.display;

    let action: string;
    let label: string;

    switch (display) {
        case 'register':
            action = '/register';
            label = 'Sign Up';
            break;

        case 'failure':
            toast.error('User credentials invalid. Please try again.');

        default:
            action = '/login';
            label = 'Log In';
    }

    return(
        <div className='login-container'>
            <ToastContainer
                position='top-center'
                hideProgressBar={true}
                autoClose={false}
                theme='colored'
            />
            <form action={action} method='post'>
                <h1>{label}</h1>
                <div className='input'>
                    <label htmlFor='username'>Username</label>
                    <input type='text' name='username' id='username' maxLength={15} />
                </div>
                <div className='input'>
                    <label htmlFor='password'>Password</label>
                    <input type='password' name='password' id='password' />
                </div>
                <input type='submit' value={label} />
                {
                    display === 'register' ? null :
                    <p>Don't have an account? <a href='/register'>Sign up</a>.</p>
                }
            </form>
        </div>
    );
}