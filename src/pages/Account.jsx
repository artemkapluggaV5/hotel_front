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
    const [editForm, setEditForm] = useState({ email: '', phone: '', telegram_id: '' });


    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    const [voucherBooking, setVoucherBooking] = useState(null);

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

            const fetchedBookings = bookingsRes.data;
            setBookings(fetchedBookings);

            const pendingBookings = fetchedBookings.filter(b => b.status === 'pending');
            let statusChanged = false;

            for (let b of pendingBookings) {
                try {
                    const checkRes = await api.post('pay/check/', { booking_id: b.id });
                    if (checkRes.data.status === 'success') {
                        statusChanged = true;
                        toast.success(`Бронь №${b.id} успешно оплачена!`, {
                            toastId: `pay_success_${b.id}`
                        });
                    }
                } catch (e) {
                    console.error("Фоновая проверка не удалась", e);
                }
            }

            if (statusChanged) {
                const freshBookingsRes = await api.get('bookings/');
                setBookings(freshBookingsRes.data);
            }

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
            localStorage.setItem('token', res.data.new_token); // Обновляем токен у себя

            toast.success('Пароль успешно изменен! Все остальные сессии завершены.');
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
            toast.info('Перенаправление в банк...');
            const res = await api.post('pay/', { booking_id: bookingId });
            window.location.href = res.data.confirmation_url;
        } catch (err) {
            toast.error(err.response?.data?.error || 'Ошибка при создании платежа');
        }
    };

    const openEditModal = () => {
        setEditForm({
            email: user?.email || '',
            phone: user?.phone || '',
            telegram_id: user?.telegram_id || '' // <--- ДОБАВИЛИ ЭТО
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
                phone: editForm.phone,
                telegram_id: editForm.telegram_id
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
            'pending': 1,
            'confirmed': 2,
            'canceled': 3
        };

        const weightA = statusWeight[a.status] || 99;
        const weightB = statusWeight[b.status] || 99;

        if (weightA !== weightB) {
            return weightA - weightB;
        }

        return b.id - a.id;
    });

    const [userBookings, setUserBookings] = useState([]);

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

                                        {b.rooms && b.rooms.map((r, i) => (
                                            <div key={i} style={{ marginBottom: '15px', fontSize: '15px', color: '#1E293B' }}>
                                                🏨 <b>Номер {r.room_number}</b> — <span style={{ color: '#64748B' }}>{r.category_name}</span>
                                            </div>
                                        ))}

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
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                            <button onClick={() => handlePayment(b.id)} className="btn-reserve" style={{ flex: 1, padding: '12px', borderRadius: '10px' }}>
                                                Оплатить онлайн
                                            </button>
                                            <button onClick={() => cancelBooking(b.id)} className="btn-cancel" style={{ width: 'auto', padding: '12px 25px', marginTop: 0 }}>
                                                Отменить
                                            </button>
                                        </div>
                                    )}

                                    {b.status === 'confirmed' && (
                                        <div style={{ marginTop: '20px' }}>
                                            <button
                                                onClick={() => setVoucherBooking(b)}
                                                className="btn-reserve"
                                                style={{ width: '100%', background: '#0F172A', padding: '12px', borderRadius: '10px' }}
                                            >
                                                📄 Открыть ваучер
                                            </button>
                                            <p style={{ fontSize: '11px', color: '#94A3B8', textAlign: 'center', marginTop: '10px' }}>
                                                Для отмены оплаченной брони свяжитесь с поддержкой
                                            </p>
                                        </div>
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
                            <div className="modal-input-group">
                                <label>Telegram ID (Узнать в @getmyid_bot)</label>
                                <input
                                    type="text"
                                    placeholder="Например: 123456789"
                                    value={editForm.telegram_id}
                                    onChange={(e) => setEditForm({...editForm, telegram_id: e.target.value})}
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

            {voucherBooking && (
                <div className="modal-overlay">
                    <div className="modal-content printable-voucher" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', padding: '0', overflow: 'hidden' }}>
                        <div style={{ background: '#0F172A', color: 'white', padding: '30px', textAlign: 'center' }}>
                            <h2 style={{ color: 'white', margin: 0, letterSpacing: '2px' }}>OASIS HOTEL</h2>
                            <p style={{ color: '#0EA5E9', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '3px', marginTop: '5px' }}>Электронный ваучер</p>
                        </div>
                        <div style={{ padding: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E2E8F0', paddingBottom: '15px', marginBottom: '15px' }}>
                                <span style={{ color: '#64748B', fontSize: '14px' }}>Бронирование №</span>
                                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{voucherBooking.id}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E2E8F0', paddingBottom: '15px', marginBottom: '15px' }}>
                                <span style={{ color: '#64748B', fontSize: '14px' }}>Гость</span>
                                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{user?.full_name || user?.username}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E2E8F0', paddingBottom: '15px', marginBottom: '15px' }}>
                                <span style={{ color: '#64748B', fontSize: '14px' }}>Номер комнаты</span>
                                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#0EA5E9' }}>
                                    {voucherBooking.rooms?.map(r => `№${r.room_number} (${r.category_name})`).join(', ') || 'Не назначен'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E2E8F0', paddingBottom: '15px', marginBottom: '15px' }}>
                                <div style={{ textAlign: 'left' }}>
                                    <span style={{ display: 'block', color: '#64748B', fontSize: '12px', textTransform: 'uppercase' }}>Заезд</span>
                                    <span style={{ fontWeight: 'bold' }}>{formatHumanDate(voucherBooking.check_in_date)}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ display: 'block', color: '#64748B', fontSize: '12px', textTransform: 'uppercase' }}>Выезд</span>
                                    <span style={{ fontWeight: 'bold' }}>{formatHumanDate(voucherBooking.check_out_date)}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', background: '#F8FAFC', padding: '15px', borderRadius: '10px' }}>
                                <span style={{ color: '#64748B', fontSize: '14px' }}>Статус оплаты</span>
                                <span style={{ fontWeight: '800', color: '#10B981', fontSize: '18px' }}>ОПЛАЧЕНО</span>
                            </div>
                            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                                <button className="btn-modal-cancel" onClick={() => setVoucherBooking(null)}>Закрыть</button>
                                <button className="btn-modal-save" style={{ background: '#0F172A' }} onClick={() => window.print()}>🖨️ Распечатать</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Account;