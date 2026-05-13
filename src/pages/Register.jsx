import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: ''
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: null });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});

        api.post('register/', formData)
            .then((response) => {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', formData.username);
                navigate('/');
                window.location.reload();
            })
            .catch(err => {
                if (err.response) {
                    console.log("Ошибка от сервера:", err.response.data);

                    if (err.response.status === 400) {
                        setFieldErrors(err.response.data);
                    } else {
                        setError(`Ошибка сервера (${err.response.status}). Попробуйте позже.`);
                    }
                } else {
                    setError('Не удалось связаться с сервером. Проверьте соединение.');
                }
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
                        <input
                            type="text"
                            name="username"
                            className={`form-input ${fieldErrors.username ? 'error-border' : ''}`}
                            placeholder="ivan_ivanov"
                            required
                            onChange={handleChange}
                        />
                        {fieldErrors.username && <span className="error-text">{fieldErrors.username[0]}</span>}
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            className={`form-input ${fieldErrors.email ? 'error-border' : ''}`}
                            placeholder="ivan@mail.ru"
                            required
                            onChange={handleChange}
                        />
                        {fieldErrors.email && <span className="error-text">{fieldErrors.email[0]}</span>}
                    </div>

                    <div className="form-group">
                        <label>Телефон</label>
                        <input
                            type="text"
                            name="phone"
                            className={`form-input ${fieldErrors.phone ? 'error-border' : ''}`}
                            placeholder="+79991234567"
                            required
                            onChange={handleChange}
                        />
                        {fieldErrors.phone && <span className="error-text">{fieldErrors.phone[0]}</span>}
                    </div>

                    <div className="form-group">
                        <label>Пароль</label>
                        <input
                            type="password"
                            name="password"
                            className={`form-input ${fieldErrors.password ? 'error-border' : ''}`}
                            placeholder="Минимум 8 символов"
                            required
                            onChange={handleChange}
                        />
                        {fieldErrors.password && <span className="error-text">{fieldErrors.password[0]}</span>}
                    </div>

                    <button type="submit" className="btn-auth">Зарегистрироваться</button>
                </form>

                <div className="auth-footer">
                    Уже есть аккаунт? <Link to="/login" className="auth-link">Войти</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;