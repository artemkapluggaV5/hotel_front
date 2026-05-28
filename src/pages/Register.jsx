import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Register() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [verificationCode, setVerificationCode] = useState('');

    const [formData, setFormData] = useState({
        username: '', email: '', phone: '', full_name: '', password: ''
    });

    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: null });
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});

        try {
            await api.post('register/', formData);
            toast.success('Код отправлен на вашу почту!');
            setStep(2);
        } catch (err) {
            if (err.response?.status === 400) {
                setFieldErrors(err.response.data);
            } else {
                toast.error('Произошла ошибка при регистрации.');
            }
        }
    };

    // ШАГ 2: Отправка введенного кода
    const handleVerifySubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('verify/', {
                email: formData.email,
                code: verificationCode
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', formData.username);
            localStorage.setItem('role', 'guest');

            toast.success('Регистрация успешно завершена!');
            navigate('/');
            window.location.reload();

        } catch (err) {
            toast.error(err.response?.data?.error || 'Неверный код подтверждения!');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                {step === 1 && (
                    <>
                        <h2 className="auth-title">Создать аккаунт</h2>
                        <form onSubmit={handleRegisterSubmit} noValidate>

                            <div className="form-group">
                                <label>ФИО</label>
                                <input type="text" name="full_name" className={`form-input ${fieldErrors.full_name ? 'error-border' : ''}`} required onChange={handleChange} />
                                {fieldErrors.full_name && <span className="error-text">{fieldErrors.full_name[0]}</span>}
                            </div>

                            <div className="form-group">
                                <label>Логин</label>
                                <input type="text" name="username" className={`form-input ${fieldErrors.username ? 'error-border' : ''}`} required onChange={handleChange} />
                                {fieldErrors.username && <span className="error-text">{fieldErrors.username[0]}</span>}
                            </div>

                            <div className="form-group">
                                <label>Email (Реальный)</label>
                                <input type="email" name="email" className={`form-input ${fieldErrors.email ? 'error-border' : ''}`} required onChange={handleChange} />
                                {fieldErrors.email && <span className="error-text">{fieldErrors.email[0]}</span>}
                            </div>

                            <div className="form-group">
                                <label>Телефон</label>
                                <input type="text" name="phone" className={`form-input ${fieldErrors.phone ? 'error-border' : ''}`} placeholder="+79991234567" required onChange={handleChange} />
                                {fieldErrors.phone && <span className="error-text">{fieldErrors.phone[0]}</span>}
                            </div>

                            <div className="form-group">
                                <label>Пароль</label>
                                <input type="password" name="password" className={`form-input ${fieldErrors.password ? 'error-border' : ''}`} required onChange={handleChange} />
                                {fieldErrors.password && <span className="error-text">{fieldErrors.password[0]}</span>}
                            </div>

                            <button type="submit" className="btn-auth">Продолжить</button>
                        </form>
                        <div className="auth-footer">Уже есть аккаунт? <Link to="/login" className="auth-link">Войти</Link></div>
                    </>
                )}

                {/* --- ЭКРАН 2: ВВОД КОДА --- */}
                {step === 2 && (
                    <>
                        <h2 className="auth-title">Подтверждение</h2>
                        <p style={{textAlign: 'center', marginBottom: '20px', color: '#64748B'}}>
                            Мы отправили 6-значный код на <b>{formData.email}</b>. Введите его ниже.
                        </p>

                        <form onSubmit={handleVerifySubmit}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Например: 123456"
                                    maxLength="6"
                                    style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '5px' }}
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-auth">Подтвердить</button>
                            <button type="button" onClick={() => setStep(1)} className="btn-auth" style={{background: '#F1F5F9', color: '#64748B', marginTop: '10px'}}>
                                Назад
                            </button>
                        </form>
                    </>
                )}

            </div>
        </div>
    );
}

export default Register;