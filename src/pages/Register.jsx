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

    // 1. Новое состояние для хранения ошибок конкретных полей
    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Очищаем ошибку поля, когда пользователь начинает что-то исправлять
        if (fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: null });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setFieldErrors({}); // Сбрасываем старые ошибки перед новым запросом

        api.post('register/', formData)
            .then((response) => {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', formData.username);
                navigate('/');
                window.location.reload();
            })
            .catch(err => {
                console.log("Детали ошибки от Django:", err.response?.data);

                // 2. Если Django вернул ошибку валидации (400 Bad Request)
                if (err.response?.status === 400) {
                    // Сохраняем объект с ошибками (например: {username: ["Занят"], phone: ["Неверный формат"]})
                    setFieldErrors(err.response.data);
                } else {
                    setError('Произошла системная ошибка. Попробуйте позже.');
                }
            });
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Создать аккаунт</h2>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>

                    {/* ПОЛЕ ЛОГИН */}
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
                        {/* 3. Вывод ошибки под полем */}
                        {fieldErrors.username && <span className="error-text">{fieldErrors.username[0]}</span>}
                    </div>

                    {/* ПОЛЕ EMAIL */}
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

                    {/* ПОЛЕ ТЕЛЕФОН */}
                    <div className="form-group">
                        <label>Телефон</label>
                        <input
                            type="text"
                            name="phone"
                            className={`form-input ${fieldErrors.phone ? 'error-border' : ''}`}
                            placeholder="8(999)123-45-67"
                            required
                            onChange={handleChange}
                        />
                        {fieldErrors.phone && <span className="error-text">{fieldErrors.phone[0]}</span>}
                    </div>

                    {/* ПОЛЕ ПАРОЛЬ */}
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