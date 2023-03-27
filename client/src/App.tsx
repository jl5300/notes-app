import { Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound';
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
            <Route path='*' element={<NotFound />} />
        </Routes>
    );
}

export default App;
