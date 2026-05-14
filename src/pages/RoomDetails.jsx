import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { addLocale } from 'primereact/api';

import './RoomDetails.css';

function RoomDetails() {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);

    const [guests, setGuests] = useState(null);
    const guestOptions = [
        { name: '1 Гость', code: 1 },
        { name: '2 Гостя', code: 2 },
        { name: '3 Гостя', code: 3 },
        { name: '4 Гостя', code: 4 }
    ];

    const today = new Date();

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
            alert('Сначала войдите в аккаунт');
            navigate('/login');
            return;
        }

        if (!checkIn || !checkOut || !guests) {
            alert('Пожалуйста, выберите даты заезда, выезда и количество гостей.');
            return;
        }

        try {
            setLoading(true);

            // КОНВЕРТИРУЕМ ДАТЫ ДЛЯ DJANGO (из объекта Date в строку YYYY-MM-DD)
            // Добавляем getTimezoneOffset, чтобы дата не сместилась из-за часового пояса
            const formatDjangoDate = (dateObj) => {
                const d = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000));
                return d.toISOString().split('T')[0];
            };

            const strCheckIn = formatDjangoDate(checkIn);
            const strCheckOut = formatDjangoDate(checkOut);

            // 1. СОЗДАЕМ BOOKING
            const bookingResponse = await api.post('bookings/', {
                check_in_date: strCheckIn,     // Используем строки!
                check_out_date: strCheckOut
            });

            const bookingId = bookingResponse.data.id;

            // 2. СОЗДАЕМ PLACEMENT
            await api.post('placements/', {
                booking: bookingId,
                room: room.id,
                check_in_date: strCheckIn,     // Используем строки!
                check_out_date: strCheckOut,
                guests_count: guests.code,     // Берем цифру из объекта Dropdown
                status: 'waiting'
            });

            alert('Бронирование успешно создано!');
            navigate('/account');

        } catch (error) {

            console.error(error);

            if (error.response?.data?.room) {
                alert('Этот номер уже забронирован на выбранные даты.');
            } else if (error.response?.status === 401) {
                alert('Ошибка авторизации. Перезайдите в аккаунт.');
            } else {
                alert('Ошибка бронирования. Проверьте правильность дат.');
            }

            console.log('STATUS:', error.response?.status);
            console.log('DATA:', error.response?.data);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        api.get(`rooms/${id}/`)
            .then(response => {
                setRoom(response.data);
            })
            .catch(error => {
                console.error(error);
            });

    }, [id]);


    if (!room) {
        return (
            <div className="room-loading">
                Загрузка номера...
            </div>
        );
    }


    const amenitiesArray = room.amenities
        ? room.amenities.split(',').map(item => item.trim())
        : [];


    const gallery = [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89404bb8a0e?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1600&auto=format&fit=crop',
    ];

    return (

        <div className="room-details-page">


            <section className="room-hero">

                <div className="container">

                    <div className="room-gallery">

                        <div className="main-image">
                            <img
                                src={gallery[0]}
                                alt="Room"
                            />
                        </div>

                        <div className="side-images">

                            {gallery.slice(1).map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt="Room"
                                />
                            ))}

                        </div>

                    </div>

                </div>

            </section>


            <section className="room-content-section container">


                <div className="room-info">

                    <div className="room-top">

                        <div>

                            <p className="room-category">
                                PREMIUM ROOM
                            </p>

                            <h1>
                                Номер {room.room_number}
                            </h1>

                        </div>

                        <div className="room-rating">
                            ⭐ {room.rating || '4.9'}
                        </div>

                    </div>

                    <p className="room-description">

                        {room.description ||
                            'Современный премиальный номер с дизайнерским интерьером и максимальным комфортом для гостей.'}

                    </p>


                    <div className="room-features">

                        <div className="feature-box">
                            🛏️ King Size Bed
                        </div>

                        <div className="feature-box">
                            📶 Free Wi-Fi
                        </div>

                        <div className="feature-box">
                            🍽️ Breakfast
                        </div>

                        <div className="feature-box">
                            🏊 Spa Access
                        </div>

                    </div>


                    <div className="details-block">

                        <h2>
                            Удобства
                        </h2>

                        <div className="amenities-grid">

                            {amenitiesArray.map((item, index) => (
                                <div
                                    key={index}
                                    className="amenity-item"
                                >
                                    ✓ {item}
                                </div>
                            ))}

                        </div>

                    </div>


                    <div className="details-block">

                        <h2>
                            Правила проживания
                        </h2>

                        <p className="rules-text">
                            {room.rules}
                        </p>

                    </div>

                </div>


                <div className="booking-sidebar">

                    <div className="booking-card">

                        <div className="booking-price">
                            <span>{room.price} ₽</span>
                            <p>за ночь</p>
                        </div>

                        <div className="booking-form">

                            <div className="booking-input">
                                <label>Заезд</label>
                                <Calendar
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.value)}
                                    minDate={today}
                                    placeholder="Выберите дату"
                                    dateFormat="dd.mm.yy"
                                    locale="ru"
                                    showIcon
                                    style={{ width: '100%' }} // Растягиваем на всю ширину блока
                                />
                            </div>

                            <div className="booking-input">
                                <label>Выезд</label>
                                <Calendar
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.value)}
                                    minDate={checkIn || today}
                                    placeholder="Выберите дату"
                                    dateFormat="dd.mm.yy"
                                    locale="ru"
                                    showIcon
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div className="booking-input">
                                <label>Гости</label>
                                <Dropdown
                                    value={guests}
                                    onChange={(e) => setGuests(e.value)}
                                    options={guestOptions}
                                    optionLabel="name"
                                    placeholder="Сколько гостей?"
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <button className="reserve-btn" onClick={handleBooking} disabled={loading}>
                                {loading ? 'Создание брони...' : 'Забронировать'}
                            </button>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default RoomDetails;