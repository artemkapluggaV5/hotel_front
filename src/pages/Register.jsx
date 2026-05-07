import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();

    // Храним данные, которые вводит пользователь
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        axios.post('http://127.0.0.1:8000/api/register/', formData)
            .then(async () => {

                const login = await axios.post('http://127.0.0.1:8000/api/token/', {
                    username: formData.username,
                    password: formData.password
                });

                localStorage.setItem('token', login.data.access);
                localStorage.setItem('username', formData.username);

                navigate('/');
            });
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Создать аккаунт</h2>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Логин</label>
                        <input type="text" name="username" className="form-input" placeholder="ivan_ivanov" required onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" className="form-input" placeholder="ivan@mail.ru" required onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Телефон</label>
                        <input type="text" name="phone" className="form-input" placeholder="+7 999 000 00 00" required onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Пароль</label>
                        <input type="password" name="password" className="form-input" placeholder="Минимум 8 символов" required onChange={handleChange} />
                    </div>

                    <button type="submit" className="btn-auth">Зарегистрироваться</button>
                </form>

                <div className="auth-footer">
                    Уже есть аккаунт?
                    <Link to="/login" className="auth-link">Войти</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;