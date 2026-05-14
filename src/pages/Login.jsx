import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) navigate('/account');
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const loginRes = await api.post('login/', { username, password });
            const token = loginRes.data.token;

            localStorage.setItem('token', token);
            localStorage.setItem('username', username);

            const meRes = await api.get('me/');
            localStorage.setItem('role', meRes.data.role);

            navigate('/');
            window.location.reload();

        } catch (err) {
            console.error("Ошибка при входе:", err);
            setError('Неверный логин или пароль!');
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Добро пожаловать</h2>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Логин</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Введите ваш логин"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Пароль</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Введите пароль"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-auth">Войти в аккаунт</button>
                </form>

                <div className="auth-footer">
                    Нет аккаунта?
                    <Link to="/register" className="auth-link">Создать</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;