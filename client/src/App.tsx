import { Route, Routes } from 'react-router-dom';
import FileNotFound from './pages/FileNotFound';
import SignUp from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import './App.css';

function App() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='*' element={<FileNotFound />} />
        </Routes>
    );
}

export default App;
