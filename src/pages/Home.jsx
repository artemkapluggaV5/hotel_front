import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';

function Home() {
    const [rooms, setRooms] = useState([]);

    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [guests, setGuests] = useState(null);
    const guestOptions = [
        { name: '1 Взрослый', code: '1' },
        { name: '2 Взрослых', code: '2' },
        { name: 'Семья (3-4)', code: 'family' }
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

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/rooms/')
            .then(response => {
                setRooms(response.data.slice(0, 6));
            })
            .catch(error => console.error("Ошибка API:", error));
    }, []);

    const fakeImages = [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1582719478250-c89404bb8a0e?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1598928506311-c55dd580e55b?q=80&w=800&auto=format&fit=crop"
    ];

    return (
        <div>
            <div className="hero-section">
                <div className="hero-content">
                    <h2>Найдите свой идеальный отдых</h2>
                    <p>Премиальные номера по лучшим ценам в самом сердце города</p>
                </div>

                <div className="booking-widget">

                    {/* КАЛЕНДАРЬ ЗАЕЗДА */}
                    <div className="input-group">
                        <label>Заезд</label>
                        <Calendar
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.value)}
                            minDate={today}
                            placeholder="Выберите дату"
                            dateFormat="dd.mm.yy"
                            locale="ru"
                            showIcon
                        />
                    </div>

                    {/* КАЛЕНДАРЬ ВЫЕЗДА */}
                    <div className="input-group">
                        <label>Выезд</label>
                        <Calendar
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.value)}
                            minDate={checkIn || today}
                            placeholder="Выберите дату"
                            dateFormat="dd.mm.yy"
                            locale="ru"
                            showIcon
                        />
                    </div>

                    <div className="input-group">
                        <label>Гости</label>
                        <Dropdown
                            value={guests}
                            onChange={(e) => setGuests(e.value)}
                            options={guestOptions}
                            optionLabel="name"
                            placeholder="Сколько людей?"
                        />
                    </div>
                    <button className="btn-reserve">Искать номера</button>
                </div>
            </div>

            <div className="container">
                <h2 className="section-title">Популярные направления</h2>

                <div className="rooms-grid">
                    {rooms.map((room, index) => {
                        const amenitiesArray = room.amenities ? room.amenities.split(',').map(item => item.trim()) : [];

                        return (
                            <div key={room.id} className="room-card">
                                <div className="room-image-wrapper">
                                    <img src={fakeImages[index % fakeImages.length]} alt="Номер"/>
                                    <div className="price-tag">{room.price} ₽ / ночь</div>
                                </div>

                                <div className="room-content">
                                    <h3>Номер {room.room_number}</h3>
                                    <p className="room-desc">
                                        {room.description ? room.description.substring(0, 90) + '...' : 'Превосходный номер с шикарным видом. Идеально подойдет для комфортного отдыха.'}
                                    </p>

                                    <ul className="amenities-list">
                                        {amenitiesArray.slice(0, 3).map((amenity, i) => (
                                            <li key={i}>{amenity}</li>
                                        ))}
                                    </ul>

                                    <Link
                                        to={`/rooms/${room.id}`}
                                        className="btn-card"
                                    >
                                        Забронировать
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
export default Home;