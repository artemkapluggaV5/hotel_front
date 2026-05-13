import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        axios.post('http://127.0.0.1:8000/api/login/', {
            username: username,
            password: password
        })
            .then(response => {
                // Наш бэкенд отдает просто .token (а не .access)
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', username);

                navigate('/');
                window.location.reload();
            })
            .catch(err => {
                console.error(err);
                setError('Неверный логин или пароль!');
            });
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Добро пожаловать</h2>
                {error && <div className="error-msg">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Логин</label>
                        <input type="text" className="form-input" placeholder="Введите ваш логин" required value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Пароль</label>
                        <input type="password" className="form-input" placeholder="Введите пароль" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn-auth">Войти в аккаунт</button>
                </form>
                <div className="auth-footer">
                    Нет аккаунта? <Link to="/register" className="auth-link">Создать</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;