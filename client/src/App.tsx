import { Route, Routes } from 'react-router-dom';
import FileNotFound from './pages/FileNotFound';
import Login from './pages/Login';
import Home from './pages/Home';
import './App.css';

function App() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login display='login' />} />
            <Route path='/login/failure' element={<Login display='failure' />} />
            <Route path='/register' element={<Login display='register' />} />
            <Route path='*' element={<FileNotFound />} />
        </Routes>
    );
}

export default App;
