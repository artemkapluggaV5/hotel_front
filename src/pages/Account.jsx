import { useEffect, useState } from 'react';
import axios from 'axios';
import './Account.css';

function Account() {
    const [bookings, setBookings] = useState([]);
    const [tab, setTab] = useState('all');
    const [loading, setLoading] = useState(true);

    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                'http://127.0.0.1:8000/api/bookings/',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setBookings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        try {
            await axios.patch(
                `http://127.0.0.1:8000/api/bookings/${id}/`,
                { status: 'canceled' },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            loadBookings();
        } catch (err) {
            alert('Ошибка отмены брони');
            console.error(err);
        }
    };

    const filtered = bookings.filter(b => {
        if (tab === 'all') return true;
        return b.status === tab;
    });

    const statusClass = (status) => {
        if (status === 'pending') return 'status pending';
        if (status === 'confirmed') return 'status confirmed';
        if (status === 'canceled') return 'status canceled';
        if (status === 'active') return 'status active';
        return 'status';
    };

    return (
        <div className="account-page container">

            <div className="account-header">
                <h1>👋 Привет, {username}</h1>
                <p>Ваш личный кабинет</p>
            </div>

            <div className="tabs">
                <button onClick={() => setTab('all')}>Все</button>
                <button onClick={() => setTab('pending')}>Ожидание</button>
                <button onClick={() => setTab('confirmed')}>Подтверждено</button>
                <button onClick={() => setTab('canceled')}>Отменённые</button>
            </div>

            {loading ? (
                <p>Загрузка...</p>
            ) : filtered.length === 0 ? (
                <div className="empty">
                    У вас пока нет бронирований
                </div>
            ) : (
                <div className="booking-list">

                    {filtered.map(b => (
                        <div className="booking-card" key={b.id}>

                            <div className="booking-top">
                                <h3>Бронь #{b.id}</h3>

                                <span className={statusClass(b.status)}>
                                    {b.status}
                                </span>
                            </div>

                            <div className="booking-info">
                                <p>📅 Заезд: {b.check_in_date}</p>
                                <p>📅 Выезд: {b.check_out_date}</p>
                            </div>

                            <div className="booking-bottom">
                                <strong>{b.total_price} ₽</strong>

                                {b.status === 'pending' && (
                                    <button
                                        onClick={() => cancelBooking(b.id)}
                                        className="cancel-btn"
                                    >
                                        Отменить
                                    </button>
                                )}
                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default Account;