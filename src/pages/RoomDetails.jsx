import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { addLocale } from 'primereact/api';
import { toast } from 'react-toastify';

import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

import './RoomDetails.css';

function RoomDetails() {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [guests, setGuests] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 1. ПРАВИЛЬНО ОБЪЯВИЛИ СОСТОЯНИЕ (На самом верху компонента)
    const [userBookings, setUserBookings] = useState([]);

    const today = new Date();

    const guestOptions = [
        { name: '1 Гость', code: 1 },
        { name: '2 Гостя', code: 2 },
        { name: '3 Гостя', code: 3 },
        { name: '4 Гостя', code: 4 }
    ];

    addLocale('ru', {
        firstDayOfWeek: 1,
        dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
        dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'суб'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        today: 'Сегодня',
        clear: 'Очистить'
    });

    const handleBooking = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            toast.warning('Сначала войдите в аккаунт');
            navigate('/login');
            return;
        }

        if (!checkIn || !checkOut || !guests) {
            toast.warning('Пожалуйста, выберите даты и количество гостей.');
            return;
        }

        try {
            setLoading(true);

            const formatDjangoDate = (dateObj) => {
                const d = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000));
                return d.toISOString().split('T')[0];
            };

            const strCheckIn = formatDjangoDate(checkIn);
            const strCheckOut = formatDjangoDate(checkOut);

            // 1. Создаем Бронь
            const bookingResponse = await api.post('bookings/', {
                check_in_date: strCheckIn,
                check_out_date: strCheckOut
            });
            const bookingId = bookingResponse.data.id;

            // 2. Создаем Размещение
            await api.post('placements/', {
                booking: bookingId,
                room: room.id,
                check_in_date: strCheckIn,
                check_out_date: strCheckOut,
                guests_count: guests.code,
                status: 'waiting'
            });

            // 3. Создаем платеж в ЮKassa
            toast.info('Создаем защищенный платеж...');
            const payResponse = await api.post('pay/', { booking_id: bookingId });

            if (payResponse.data.confirmation_url) {
                window.location.href = payResponse.data.confirmation_url; // Редирект в банк
            } else {
                toast.success('Бронь создана, перейдите в личный кабинет для оплаты.');
                navigate('/account');
            }

        } catch (error) {
            console.error("ПОЛНАЯ ОШИБКА:", error.response?.data);
            if (error.response?.status === 403) {
                toast.error('Доступ запрещен: Бэкенд не разрешает гостям создавать размещения.');
            } else if (error.response?.data?.non_field_errors) {
                // Если сработала защита от спама на бэкенде
                toast.error(error.response.data.non_field_errors[0]);
            } else if (error.response?.data?.room) {
                toast.error('Этот номер уже забронирован на эти даты.');
            } else {
                toast.error('Ошибка бронирования.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Получаем информацию о комнате
        api.get(`rooms/${id}/`)
            .then(response => setRoom(response.data))
            .catch(error => console.error(error));

        // Получаем бронирования пользователя, чтобы проверить статус
        const token = localStorage.getItem('token');
        if (token) {
            api.get('bookings/')
                .then(res => setUserBookings(res.data))
                .catch(err => console.error(err));
        }
    }, [id]);

    if (!room) return <div className="room-loading">Загрузка номера...</div>;

    const amenitiesArray = room.amenities ? room.amenities.split(',').map(item => item.trim()) : [];

    const galleryImages = [
        room.image ? room.image : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89404bb8a0e?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1600&auto=format&fit=crop',
    ];

    // Проверяем, есть ли у этого юзера неоплаченная бронь НА ЭТОТ номер
    const hasPendingForThisRoom = userBookings.some(b =>
        b.status === 'pending' && b.rooms?.some(r => r.room_id === Number(id))
    );

    return (
        <div className="room-details-page">

            <section className="room-hero">
                <div className="container">

                    <LightGallery
                        speed={500}
                        plugins={[lgThumbnail, lgZoom]}
                        selector=".lg-item"
                    >
                        <div className="room-gallery">
                            <a href={galleryImages[0]} className="main-image lg-item">
                                <img src={galleryImages[0]} alt="Room Main" />
                            </a>
                            <div className="side-images">
                                {galleryImages.slice(1).map((img, index) => (
                                    <a href={img} key={index} className="lg-item">
                                        <img src={img} alt="Room Side" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </LightGallery>

                </div>
            </section>

            <section className="room-content-section container">
                <div className="room-info">
                    <div className="room-top">
                        <div>
                            <p className="room-category">НОМЕР</p>
                            <h1>Номер {room.room_number}</h1>
                        </div>
                        <div className="room-rating">⭐ {room.rating || '4.9'}</div>
                    </div>

                    <p className="room-description">{room.description}</p>

                    <div className="room-features">
                        <div className="feature-box">🛏️ Большая кровать</div>
                        <div className="feature-box">📶 Free Wi-Fi</div>
                        <div className="feature-box">🍽️ Завтрак</div>
                    </div>

                    <div className="details-block">
                        <h2>Удобства</h2>
                        <div className="amenities-grid">
                            {amenitiesArray.map((item, index) => (
                                <div key={index} className="amenity-item">✓ {item}</div>
                            ))}
                        </div>
                    </div>

                    <div className="details-block">
                        <h2>Правила проживания</h2>
                        <p className="rules-text">{room.rules}</p>
                    </div>
                </div>

                <div className="booking-sidebar">
                    <div className="booking-card">
                        <div className="booking-price">
                            <span>{room.price} ₽</span><p>за ночь</p>
                        </div>

                        <div className="booking-form">
                            <div className="booking-input">
                                <label>Заезд</label>
                                <Calendar value={checkIn} onChange={(e) => setCheckIn(e.value)} minDate={today} placeholder="Выберите дату" dateFormat="dd.mm.yy" locale="ru" showIcon style={{ width: '100%' }} />
                            </div>
                            <div className="booking-input">
                                <label>Выезд</label>
                                <Calendar value={checkOut} onChange={(e) => setCheckOut(e.value)} minDate={checkIn || today} placeholder="Выберите дату" dateFormat="dd.mm.yy" locale="ru" showIcon style={{ width: '100%' }} />
                            </div>
                            <div className="booking-input">
                                <label>Гости</label>
                                <Dropdown value={guests} onChange={(e) => setGuests(e.value)} options={guestOptions} optionLabel="name" placeholder="Сколько гостей?" style={{ width: '100%' }} />
                            </div>

                            {/* ИНТЕГРИРОВАЛИ УМНУЮ КНОПКУ */}
                            {hasPendingForThisRoom ? (
                                <button
                                    className="reserve-btn"
                                    onClick={() => navigate('/account')}
                                    style={{ background: '#F59E0B', color: '#1E293B', fontWeight: 'bold' }}
                                >
                                    ⚠️ Ожидает оплаты в ЛК
                                </button>
                            ) : (
                                <button className="reserve-btn" onClick={handleBooking} disabled={loading}>
                                    {loading ? 'Создание брони...' : 'Забронировать'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default RoomDetails;