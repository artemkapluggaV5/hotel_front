import {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

function Home() {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/rooms/')
            .then(response => {
                // Берем 6 номеров для красивой сетки
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
                    <div className="input-group">
                        <label>Заезд</label>
                        <input type="date"/>
                    </div>
                    <div className="input-group">
                        <label>Выезд</label>
                        <input type="date"/>
                    </div>
                    <div className="input-group">
                        <label>Гости</label>
                        <select>
                            <option>1 Взрослый</option>
                            <option>2 Взрослых</option>
                            <option>Семья (3-4)</option>
                        </select>
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