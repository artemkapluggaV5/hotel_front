import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="main-footer">
            <div className="container footer-grid">

                <div className="footer-brand">
                    <h2>OASIS</h2>
                    <p className="footer-subtitle">Boutique Hotel</p>
                    <p className="footer-desc">
                        Премиальный отдых в самом сердце города. Идеальное место для тех, кто ценит комфорт, роскошь и безупречный сервис.
                    </p>
                    <div className="social-icons">
                        <i className="pi pi-instagram"></i>
                        <i className="pi pi-facebook"></i>
                        <i className="pi pi-twitter"></i>
                        <i className="pi pi-telegram"></i>
                    </div>
                </div>

                <div className="footer-links">
                    <h3 className="footer-title">Навигация</h3>
                    <ul>
                        <li><Link to="/">Каталог номеров</Link></li>
                        <li><Link to="/gallery">Галерея отеля</Link></li>
                        <li><Link to="/about">О нас</Link></li>
                        <li><Link to="/register">Регистрация</Link></li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h3 className="footer-title">Контакты</h3>
                    <ul>
                        <li>
                            <i className="pi pi-map-marker"></i>
                            <span>г. Москва, ул. Премиальная, 1</span>
                        </li>
                        <li>
                            <i className="pi pi-phone"></i>
                            <span>8 (800) 123-45-67</span>
                        </li>
                        <li>
                            <i className="pi pi-envelope"></i>
                            <span>booking@oasis-hotel.ru</span>
                        </li>
                    </ul>
                </div>

            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p>© {new Date().getFullYear()} OASIS Boutique Hotel. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;