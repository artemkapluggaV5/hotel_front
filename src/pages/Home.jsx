import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/rooms/')
            .then(response => {
                setRooms(response.data);
            })
            .catch(error => console.error("Ошибка API:", error));
    }, []);

    return (
        <div>
            <h1 className="page-title">Свободные номера</h1>

            <div className="rooms-grid">
                {rooms.length === 0 ? <p>Загрузка данных с сервера...</p> : null}

                {rooms.map(room => (
                    <div key={room.id} className="room-card">
                        <h3 className="room-title">Комната № {room.room_number}</h3>

                        <div className="room-price">
                            {room.price} ₽ <span style={{fontSize: '14px', color: '#888', fontWeight: 'normal'}}>/ сутки</span>
                        </div>

                        <div className="room-info">
                            <span><b>Статус:</b></span>
                            <span>{room.status === 'available' ? 'Свободен' : 'Занят'}</span>
                        </div>

                        <div className="room-info">
                            <span><b>Рейтинг:</b></span>
                            <span>⭐ {room.rating}</span>
                        </div>

                        <button className="btn-book">Забронировать</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;