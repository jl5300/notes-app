import { Route, Routes } from 'react-router-dom';
import FileNotFound from './pages/FileNotFound';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Home from './pages/Home';
import './App.css';

function App() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login display='login' />} />
            <Route path='/login/failure' element={<Login display='loginFailed' />} />
            <Route path='/register' element={<Login display='register' />} />
            <Route path='/register/failure' element={<Login display='registerFailed' />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='*' element={<FileNotFound />} />
        </Routes>
    );
}

export default App;
