import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
    return (
        <div className="notfound-page">
            <div className="notfound-content">
                <h1 className="notfound-code">404</h1>
                <div className="notfound-divider"></div>
                <h2>Упс! Вы заблудились в наших коридорах</h2>
                <p>
                    Страница, которую вы ищете, не существует или была перенесена.
                    Наш швейцар уже ищет её, а пока вы можете вернуться в холл.
                </p>
                <Link to="/" className="btn-reserve" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '20px' }}>
                    Вернуться на главную
                </Link>
            </div>
        </div>
    );
}

export default NotFound;