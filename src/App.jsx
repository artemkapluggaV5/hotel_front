import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from "./pages/About.jsx";
import Gallery from "./pages/Gallery.jsx";
import RoomDetails from "./pages/RoomDetails.jsx";
import Account from './pages/Account';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer';

// Измененный блок NavLinks:
function NavLinks() {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        window.location.href = '/login';
    };

    return (
        <div className="nav-links">
            <Link to="/" className={location.pathname === '/' ? "nav-link active" : "nav-link"}>Номера</Link>
            <Link to="/gallery" className="nav-link">Галерея</Link>
            {/* --- ДОБАВИЛИ ССЫЛКУ "О НАС" --- */}
            <Link to="/about" className={location.pathname === '/about' ? "nav-link active" : "nav-link"}>О нас</Link>

            {(role === 'admin' || role === 'staff') && (
                <Link to="/dashboard" className="nav-link" style={{color: '#0EA5E9', fontWeight: 'bold'}}>
                    ⚙️ Панель управления
                </Link>
            )}

            {token ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: '20px' }}>
                    <Link to="/account" className="nav-link" style={{ fontWeight: 'bold', color: '#0F172A' }}>
                        👋 Привет, {username}!
                    </Link>
                    <button onClick={handleLogout} className="btn-login" style={{ background: '#DC2626' }}>
                        Выйти
                    </button>
                </div>
            ) : (
                <>
                    <Link to="/register" className="nav-link" style={{marginLeft: '20px'}}>Регистрация</Link>
                    <Link to="/login" className="btn-login">Войти</Link>
                </>
            )}
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

                <header className="main-header">
                    <div className="container header-container">
                        <Link to="/" className="logo-container">
                            <h1>OASIS</h1>
                            <p>Boutique Hotel</p>
                        </Link>
                        <NavLinks />
                    </div>
                </header>

                <main style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/rooms/:id" element={<RoomDetails />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </main>

                <Footer />

            </div>

            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                theme="colored"
            />
        </BrowserRouter>
    );
}

export default App;