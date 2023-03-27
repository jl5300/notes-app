import './Login.css';

export default function Login() {
    return(
        <main>
            <form action='/login' method='post'>
                <h1>Login</h1>
                <div className='input'>
                    <label htmlFor='username'>Username</label>
                    <input type='text' name='username' id='username' maxLength={10} />
                </div>
                <div className='input'>
                    <label htmlFor='password'>Password</label>
                    <input type='password' name='password' id='password' />
                </div>
                <input type='submit' value='Log In' />
            </form>
        </main>
    );
}