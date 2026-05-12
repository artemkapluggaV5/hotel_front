import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; // ИСПОЛЬЗУЕМ НАШ API КЛИЕНТ

import './RoomDetails.css';

function RoomDetails() {

    const { id } = useParams();

    const [room, setRoom] = useState(null);

    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    const handleBooking = async () => {

        const token = localStorage.getItem('token');

        if (!token) {
            alert('Сначала войдите в аккаунт');
            navigate('/login');
            return;
        }

        if (!checkIn || !checkOut) {
            alert('Выберите даты');
            return;
        }

        try {

            setLoading(true);

            // ========================================================
            // 1. СОЗДАЕМ BOOKING (Через наш api, заголовки добавятся сами)
            // ========================================================

            const bookingResponse = await api.post('bookings/', {
                check_in_date: checkIn,
                check_out_date: checkOut
            });

            const bookingId = bookingResponse.data.id;

            // ========================================================
            // 2. СОЗДАЕМ PLACEMENT (Через наш api)
            // ========================================================

            await api.post('placements/', {
                booking: bookingId,
                room: room.id,
                check_in_date: checkIn,
                check_out_date: checkOut,
                guests_count: 2,
                status: 'waiting'
            });

            alert('Бронирование успешно создано!');
            navigate('/account'); // Уводим пользователя в личный кабинет

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
        // Загружаем данные номера через api
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

                                <label>
                                    Заезд
                                </label>

                                <input
                                    type="date"
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                />

                            </div>


                            <div className="booking-input">

                                <label>
                                    Выезд
                                </label>

                                <input
                                    type="date"
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                />

                            </div>


                            <div className="booking-input">

                                <label>
                                    Гости
                                </label>

                                <select>
                                    <option>1 Гость</option>
                                    <option>2 Гостя</option>
                                    <option>3 Гостя</option>
                                    <option>4 Гостя</option>
                                </select>

                            </div>


                            <button
                                className="reserve-btn"
                                onClick={handleBooking}
                                disabled={loading}
                            >

                                {loading
                                    ? 'Создание брони...'
                                    : 'Забронировать'}

                            </button>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default RoomDetails;