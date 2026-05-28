import { useState, useEffect } from 'react';
import api from '../api'; // Обязательно используем наш умный api!
import { Link } from 'react-router-dom';

import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { addLocale } from 'primereact/api';

function Home() {
    const [rooms, setRooms] = useState([]);
    const [categories, setCategories] = useState([]);

    // Состояния фильтров
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);

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

    const priceOptions = [
        { name: 'Любая цена', code: null },
        { name: 'До 3 000 ₽', code: 3000 },
        { name: 'До 6 000 ₽', code: 6000 },
        { name: 'До 10 000 ₽', code: 10000 },
        { name: 'До 20 000 ₽', code: 20000 },
    ];

    useEffect(() => {
        api.get('rooms/')
            .then(res => setRooms(res.data.slice(0, 6)))
            .catch(err => console.error("Ошибка загрузки номеров:", err));

        api.get('categories/')
            .then(res => setCategories(res.data))
            .catch(err => console.error("Ошибка загрузки категорий:", err));
    }, []);

    const handleSearch = async () => {
        try {
            let queryParams = {};

            if (checkIn && checkOut) {
                const formatDjangoDate = (dateObj) => {
                    const d = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000));
                    return d.toISOString().split('T')[0];
                };
                queryParams.check_in = formatDjangoDate(checkIn);
                queryParams.check_out = formatDjangoDate(checkOut);
            } else if (checkIn || checkOut) {
                toast.warning("Пожалуйста, выберите обе даты (заезд и выезд) или очистите их.");
                return;
            }

            if (selectedCategory) {
                queryParams.category = selectedCategory.id;
            }

            if (maxPrice && maxPrice.code) {
                queryParams.max_price = maxPrice.code;
            }

            const response = await api.get('rooms/', { params: queryParams });

            setRooms(response.data);

        } catch (error) {
            console.error("Ошибка при поиске:", error);
            toast.error("Не удалось выполнить поиск.");
        }
    };

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

                <div className="booking-widget" style={{ paddingRight: '15px' }}>

                    <div className="input-group">
                        <label>Заезд</label>
                        <Calendar value={checkIn} onChange={(e) => setCheckIn(e.value)} minDate={today} placeholder="Выберите дату" dateFormat="dd.mm.yy" locale="ru" showIcon />
                    </div>

                    <div className="input-group">
                        <label>Выезд</label>
                        <Calendar value={checkOut} onChange={(e) => setCheckOut(e.value)} minDate={checkIn || today} placeholder="Выберите дату" dateFormat="dd.mm.yy" locale="ru" showIcon />
                    </div>

                    <div className="input-group">
                        <label>Категория</label>
                        <Dropdown
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.value)}
                            options={categories}
                            optionLabel="name"
                            placeholder="Любая"
                            showClear
                        />
                    </div>

                    <div className="input-group">
                        <label>Цена до</label>
                        <Dropdown
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.value)}
                            options={priceOptions}
                            optionLabel="name"
                            placeholder="Не важно"
                        />
                    </div>

                    <button className="btn-reserve" onClick={handleSearch}>Искать номера</button>
                </div>
            </div>

            <div className="container">
                <h2 className="section-title">Результаты поиска</h2>

                {rooms.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#64748B', fontSize: '18px' }}>
                        По вашему запросу свободных номеров не найдено 😔
                    </div>
                ) : (
                    <div className="rooms-grid">
                        {rooms.map((room, index) => {
                            const amenitiesArray = room.amenities ? room.amenities.split(',').map(item => item.trim()) : [];
                            return (
                                <div key={room.id} className="room-card">
                                    <div className="room-image-wrapper">
                                        {/* Если в базе есть реальная картинка, показываем её, иначе фейковую */}
                                        <img src={room.image ? room.image : fakeImages[index % fakeImages.length]} alt="Номер"/>
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

                                        <Link to={`/rooms/${room.id}`} className="btn-card" style={{textAlign: 'center', textDecoration: 'none'}}>
                                            Забронировать
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;