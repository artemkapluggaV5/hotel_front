import { useEffect, useState } from 'react';
import api from '../api';
import './Account.css';
import { toast } from 'react-toastify';

function Account() {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [tab, setTab] = useState('all');
    const [loading, setLoading] = useState(true);

    const username = localStorage.getItem('username');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ email: '', phone: '' });

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [userRes, bookingsRes] = await Promise.all([
                api.get('me/'),
                api.get('bookings/')
            ]);
            setUser(userRes.data);
            setBookings(bookingsRes.data);
        } catch (err) {
            console.error("Ошибка загрузки данных:", err);
            if (err.response?.status === 401) {
                toast.error("Сессия истекла. Войдите заново.");
            }
        } finally {
            setLoading(false);
        }
    };

    const formatHumanDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('change-password/', passwordForm);

            localStorage.setItem('token', res.data.new_token);

            toast.success('Пароль успешно изменен');
            setIsPasswordModalOpen(false);
            setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Ошибка при смене пароля');
        }
    };

    const cancelBooking = async (id) => {
        if (!window.confirm('Вы уверены, что хотите отменить бронирование?')) return;
        try {
            await api.patch(`bookings/${id}/`, { status: 'canceled' });
            toast.success('Бронирование отменено');
            loadData();
        } catch (err) {
            toast.error('Не удалось отменить бронирование');
        }
    };

    const handlePayment = async (bookingId) => {
        try {
            toast.info('Перенаправление на ЮKassa...');
            const res = await api.post('pay/', { booking_id: bookingId });
            window.location.href = res.data.confirmation_url;
        } catch (err) {
            toast.error(err.response?.data?.error || 'Ошибка при создании платежа');
        }
    };

    // Функция проверки статуса (если юзер только что вернулся с ЮKassa)
    const checkPaymentStatus = async (bookingId) => {
        try {
            const res = await api.post('pay/check/', { booking_id: bookingId });
            if (res.data.status === 'success') {
                toast.success('🎉 Оплата успешно подтверждена!');
                loadData(); // Перезагружаем статусы (pending -> confirmed)
            } else if (res.data.status === 'canceled') {
                toast.error('Платеж был отменен.');
                loadData();
            } else {
                toast.info('Оплата еще обрабатывается банком. Проверьте чуть позже.');
            }
        } catch (err) {
            toast.error('Ошибка при проверке статуса. Попробуйте позже.');
        }
    };


    const openEditModal = () => {
        setEditForm({
            email: user?.email || '',
            phone: user?.phone || ''
        });
        setIsModalOpen(true);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await api.patch('me/', editForm);

            setUser(prevUser => ({
                ...prevUser,
                email: editForm.email,
                phone: editForm.phone
            }));

            setIsModalOpen(false);
            toast.success('Профиль обновлен!');

        } catch (err) {
            toast.error('Ошибка при обновлении профиля. Email или телефон уже заняты.');
        }
    };

    const filtered = bookings.filter(b => {
        if (tab === 'all') return true;
        return b.status === tab;
    }).sort((a, b) => {
        const statusWeight = {
            'confirmed': 1,
            'pending': 2,
            'canceled': 3
        };

        const weightA = statusWeight[a.status] || 99;
        const weightB = statusWeight[b.status] || 99;

        if (weightA !== weightB) {
            return weightA - weightB;
        }

        return b.id - a.id;
    });

    return (
        <div className="container account-page">
            <div className="account-grid">

                <aside className="profile-sidebar">
                    <button onClick={openEditModal} className="btn-edit-profile-top" title="Редактировать профиль">
                        ✏️
                    </button>

                    <div className="user-avatar">
                        {username ? username[0].toUpperCase() : 'U'}
                    </div>

                    <h2>{user?.username || username}</h2>
                    <p className="user-role">{user?.role === 'admin' ? 'Администратор' : 'Гость отеля'}</p>

                    <div className="user-details">
                        <div className="detail-item">
                            <label>Email</label>
                            <span>{user?.email || 'Загрузка...'}</span>
                        </div>
                        <div className="detail-item">
                            <label>Телефон</label>
                            <span>{user?.phone || 'Не указан'}</span>
                        </div>

                        <button
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="btn-cancel"
                            style={{ color: '#0EA5E9', borderColor: '#E2E8F0', marginTop: '20px', fontSize: '12px', width: '100%' }}
                        >
                            🔐 Сменить пароль
                        </button>
                    </div>
                </aside>

                <main className="account-content">
                    <h1 className="section-title">Ваши брони</h1>

                    <div className="tabs">
                        <button className={tab === 'all' ? 'active' : ''} onClick={() => setTab('all')}>Все</button>
                        <button className={tab === 'pending' ? 'active' : ''} onClick={() => setTab('pending')}>Ожидание</button>
                        <button className={tab === 'confirmed' ? 'active' : ''} onClick={() => setTab('confirmed')}>Подтверждено</button>
                        <button className={tab === 'canceled' ? 'active' : ''} onClick={() => setTab('canceled')}>Отменено</button>
                    </div>

                    {loading ? (
                        <div className="empty-state"><p>Загрузка данных...</p></div>
                    ) : filtered.length === 0 ? (
                        <div className="empty-state">
                            <p>У вас пока нет бронирований в этой категории</p>
                        </div>
                    ) : (
                        <div className="booking-list">
                            {filtered.map(b => (
                                <div className="booking-card-new" key={b.id}>
                                    <div className="b-header">
                                        <span className="b-number">Бронирование №{b.id}</span>
                                        <span className={`status-badge ${b.status}`}>{b.status}</span>
                                    </div>
                                    <div className="b-body">
                                        <div className="b-dates">
                                            <div>
                                                <label>Заезд</label>
                                                <p>{formatHumanDate(b.check_in_date)}</p>
                                            </div>
                                            <div className="date-arrow">→</div>
                                            <div>
                                                <label>Выезд</label>
                                                <p>{formatHumanDate(b.check_out_date)}</p>
                                            </div>
                                        </div>
                                        <div className="b-price"><label>К оплате</label><p>{b.total_price} ₽</p></div>
                                    </div>
                                    {b.status === 'pending' && (
                                        <button onClick={() => cancelBooking(b.id)} className="btn-cancel">Отменить бронь</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Редактирование профиля</h2>

                        <form onSubmit={handleUpdateProfile}>
                            <div className="modal-input-group">
                                <label>Новый Email</label>
                                <input
                                    type="email"
                                    required
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                />
                            </div>
                            <div className="modal-input-group">
                                <label>Новый Телефон</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                />
                            </div>

                            <div className="modal-buttons">
                                <button type="button" className="btn-modal-cancel" onClick={() => setIsModalOpen(false)}>Отмена</button>
                                <button type="submit" className="btn-modal-save">Сохранить</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isPasswordModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Смена пароля</h2>

                        <form onSubmit={handleChangePassword}>
                            <div className="modal-input-group">
                                <label>Текущий пароль</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordForm.current_password}
                                    onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                                />
                            </div>
                            <div className="modal-input-group">
                                <label>Новый пароль</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordForm.new_password}
                                    onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                                />
                            </div>
                            <div className="modal-input-group">
                                <label>Повторите новый пароль</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordForm.confirm_password}
                                    onChange={(e) => setPasswordForm({...passwordForm, confirm_password: e.target.value})}
                                />
                            </div>

                            <div className="modal-buttons">
                                <button type="button" className="btn-modal-cancel" onClick={() => setIsPasswordModalOpen(false)}>Отмена</button>
                                <button type="submit" className="btn-modal-save" style={{background: '#DC2626'}}>Обновить пароль</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Account;