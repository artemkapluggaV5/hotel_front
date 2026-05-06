import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
    return (
        <BrowserRouter>
            <nav className="navbar">
                <Link to="/" className="logo">GRAND HOTEL</Link>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Номера</Link>
                    <Link to="/login" className="nav-link">Войти</Link>
                    <Link to="/register" className="nav-link">Регистрация</Link>
                </div>
            </nav>

            <div className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;