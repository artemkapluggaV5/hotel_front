import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify'; // ДОБАВЛЕНО: импорт toast
import './Account.css';

function Dashboard() {
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [maintenanceRooms, setMaintenanceRooms] = useState([]);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role === 'guest' || !role) {
            toast.error('У вас нет доступа к этой странице!');
            navigate('/');
            return;
        }
        loadPlacements();
    }, [navigate]);

    const loadPlacements = async () => {
        try {
            setLoading(true);
            const [placementsRes, statsRes, roomsRes] = await Promise.all([
                api.get('placements/?all=true'),
                api.get('stats/'),
                api.get('rooms/')
            ]);
            setPlacements(placementsRes.data);
            setStats(statsRes.data);
            setMaintenanceRooms(roomsRes.data.filter(r => r.status === 'maintenance'));
        } catch (err) {
            console.error("Ошибка:", err);
        } finally {
            setLoading(false);
        }
    };

    // Красивые даты на русском
    const formatHumanDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    const handleCheckIn = async (id) => {
        if (!window.confirm('Оформить заселение гостя?')) return;
        try {
            await api.patch(`placements/${id}/`, { status: 'active' });
            loadPlacements();
            toast.success('Гость успешно заселён!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Ошибка при заселении.');
        }
    };

    const handleCheckOut = async (id) => {
        if (!window.confirm('Оформить выезд?')) return;
        try {
            await api.patch(`placements/${id}/`, { status: 'finished' });
            loadPlacements();
            toast.success('Гость выселен. Номер отправлен на уборку.');
        } catch (err) {
            toast.error('Ошибка при выселении.');
        }
    };

    const handleFinishCleaning = async (roomId) => {
        try {
            await api.post(`rooms/${roomId}/finish_cleaning/`);
            toast.success('Уборка завершена!');
            loadPlacements();
        } catch (err) {
            toast.error('Ошибка при обновлении статуса');
        }
    };

    return (
        <div className="container account-page">
            <h1 className="section-title">Панель управления гостиницей</h1>

            {stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                    <div className="room-card" style={{ textAlign: 'center', padding: '20px' }}>
                        <label style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8' }}>ВСЕГО НОМЕРОВ</label>
                        <p style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>{stats.total_rooms}</p>
                    </div>
                    <div className="room-card" style={{ textAlign: 'center', padding: '20px' }}>
                        <label style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8' }}>СЕЙЧАС ЗАНЯТО</label>
                        <p style={{ fontSize: '24px', fontWeight: '800', color: '#0EA5E9' }}>{stats.occupied_rooms}</p>
                    </div>
                    <div className="room-card" style={{ textAlign: 'center', padding: '20px' }}>
                        <label style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8' }}>НА УБОРКЕ</label>
                        <p style={{ fontSize: '24px', fontWeight: '800', color: '#F59E0B' }}>{stats.maintenance_rooms}</p>
                    </div>
                    <div className="room-card" style={{ textAlign: 'center', padding: '20px' }}>
                        <label style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8' }}>ВЫРУЧКА</label>
                        <p style={{ fontSize: '24px', fontWeight: '800', color: '#10B981' }}>{stats.total_revenue} ₽</p>
                    </div>
                </div>
            )}

            <p style={{marginBottom: '30px', color: '#64748B'}}>Управление заселениями и статусом номерного фонда</p>

            {loading ? (
                <p>Загрузка базы...</p>
            ) : (
                <>
                    {placements.length === 0 ? (
                        <p>В системе нет записей о бронированиях.</p>
                    ) : (
                        <div className="booking-list">
                            {placements.map(p => (
                                <div className="booking-card-new" key={p.id}>
                                    <div className="b-header">
                                        <span className="b-number">Бронь #{p.booking} | Номер ID: {p.room}</span>
                                        <span className={`status-badge ${p.status}`}>{p.status}</span>
                                    </div>
                                    <div className="b-body" style={{marginBottom: '20px'}}>
                                        <div className="b-dates">
                                            <div><label>Дата заезда</label><p>{formatHumanDate(p.check_in_date)}</p></div>
                                            <div className="date-arrow">→</div>
                                            <div><label>Дата выезда</label><p>{formatHumanDate(p.check_out_date)}</p></div>
                                        </div>
                                        <div className="b-price"><label>Гостей</label><p>{p.guests_count} чел.</p></div>
                                    </div>
                                    <div style={{display: 'flex', gap: '15px'}}>
                                        {p.status === 'waiting' && <button onClick={() => handleCheckIn(p.id)} className="btn-reserve" style={{width: 'auto', padding: '10px 20px', borderRadius: '8px'}}>Заселить</button>}
                                        {p.status === 'active' && <button onClick={() => handleCheckOut(p.id)} className="btn-login" style={{background: '#DC2626', width: 'auto', padding: '10px 20px', borderRadius: '8px'}}>Выселить</button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <h2 className="section-title" style={{ marginTop: '60px' }}>Служба клининга</h2>
                    {maintenanceRooms.length === 0 ? (
                        <p style={{ color: '#64748B' }}>Сейчас нет номеров, требующих уборки.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '50px' }}>
                            {maintenanceRooms.map(room => (
                                <div key={room.id} className="room-card" style={{ borderLeft: '5px solid #F59E0B', padding: '20px' }}>
                                    <h3 style={{ fontSize: '18px' }}>Номер {room.room_number}</h3>
                                    <p style={{ fontSize: '13px', margin: '10px 0' }}>Статус: <b>На уборке</b></p>
                                    <button
                                        onClick={() => handleFinishCleaning(room.id)}
                                        className="btn-reserve"
                                        style={{ background: '#10B981', padding: '10px', fontSize: '13px', width: '100%', borderRadius: '8px' }}
                                    >
                                        Завершить уборку
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Dashboard;