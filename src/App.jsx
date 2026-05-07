import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from "./pages/About.jsx";
import Gallery from "./pages/Gallery.jsx";
import RoomDetails from "./pages/RoomDetails.jsx";
import Account from './pages/Account';

function NavLinks() {
    const location = useLocation();

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');

        window.location.reload();
    };

    return (
        <div className="nav-links">
            <Link
                to="/"
                className={location.pathname === '/' ? "nav-link active" : "nav-link"}
            >
                Номера
            </Link>

            <Link to="/gallery" className="nav-link">
                Галерея
            </Link>

            <Link to="/about" className="nav-link">
                О нас
            </Link>

            <Link to="/account" className="nav-link">
                Личный кабинет
            </Link>

            {!token ? (
                <>
                    <Link
                        to="/register"
                        className="nav-link"
                        style={{ marginLeft: '20px' }}
                    >
                        Регистрация
                    </Link>

                    <Link to="/login" className="btn-login">
                        Войти
                    </Link>
                </>
            ) : (
                <>
                    <div
                        className="nav-link"
                        style={{
                            marginLeft: '20px',
                            fontWeight: '700',
                            color: '#0EA5E9'
                        }}
                    >
                        Привет, {username} 👋
                    </div>

                    <button
                        onClick={handleLogout}
                        className="btn-login"
                        style={{ border: 'none', cursor: 'pointer' }}
                    >
                        Выйти
                    </button>
                </>
            )}
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <header className="main-header">
                <div className="container header-container">
                    <Link to="/" className="logo-container">
                        <h1>OASIS</h1>
                        <p>Boutique Hotel</p>
                    </Link>
                    <NavLinks />
                </div>
            </header>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/rooms/:id" element={<RoomDetails />} />
                <Route path="/account" element={<Account />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;