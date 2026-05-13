import './About.css';

function About() {
    return (
        <div className="about-page">

            <section className="about-hero">
                <div className="about-overlay">
                    <div className="container">
                        <div className="about-hero-content">
                            <p className="about-subtitle">OASIS BOUTIQUE HOTEL</p>
                            <h1>Роскошь, комфорт и атмосфера настоящего отдыха</h1>
                            <p>
                                Мы создаем пространство, где каждая деталь продумана для вашего идеального пребывания.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-story container">
                <div className="story-left">
                    <img
                        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400&auto=format&fit=crop"
                        alt="Hotel"
                    />
                </div>

                <div className="story-right">
                    <p className="section-mini">НАША ИСТОРИЯ</p>
                    <h2>Современный отель с душой</h2>

                    <p>
                        OASIS — это сочетание современного дизайна, первоклассного сервиса и домашнего уюта.
                        Мы верим, что идеальный отдых складывается из мелочей: мягкого света,
                        удобной кровати, тишины и внимательного персонала.
                    </p>

                    <p>
                        Наш отель расположен в самом сердце города, позволяя гостям наслаждаться
                        как деловыми поездками, так и расслабленным отдыхом.
                    </p>

                    <div className="about-stats">
                        <div>
                            <h3>50+</h3>
                            <span>Премиум номеров</span>
                        </div>

                        <div>
                            <h3>24/7</h3>
                            <span>Поддержка гостей</span>
                        </div>

                        <div>
                            <h3>4.9★</h3>
                            <span>Средний рейтинг</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="container">
                    <p className="section-mini center">ПОЧЕМУ ВЫБИРАЮТ НАС</p>
                    <h2 className="section-title center">Идеальное место для отдыха</h2>

                    <div className="features-grid">

                        <div className="feature-card">
                            <div className="feature-icon">🏨</div>
                            <h3>Современные номера</h3>
                            <p>
                                Просторные и стильные номера с панорамными окнами и премиальным интерьером.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🍽️</div>
                            <h3>Авторская кухня</h3>
                            <p>
                                Ресторан с блюдами европейской кухни и эксклюзивным меню от шеф-повара.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">💆</div>
                            <h3>Spa & Wellness</h3>
                            <p>
                                Полное восстановление и релакс в spa-зоне премиального уровня.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            <section className="about-gallery container">

                <div className="gallery-header">
                    <p className="section-mini center">GALLERY</p>
                    <h2 className="section-title center">
                        Атмосфера настоящего комфорта
                    </h2>
                </div>

                <div className="masonry-gallery">

                    <div className="gallery-item large">
                        <img
                            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop"
                            alt="Luxury Room"
                        />
                        <div className="gallery-overlay">
                            <h3>Luxury Suites</h3>
                            <p>Премиальные номера с панорамным видом</p>
                        </div>
                    </div>

                    <div className="gallery-item">
                        <img
                            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop"
                            alt="Interior"
                        />
                        <div className="gallery-overlay">
                            <h3>Minimal Interior</h3>
                        </div>
                    </div>

                    <div className="gallery-item">
                        <img
                            src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop"
                            alt="Hotel"
                        />
                        <div className="gallery-overlay">
                            <h3>Premium Lobby</h3>
                        </div>
                    </div>

                    <div className="gallery-item wide">
                        <img
                            src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1200&auto=format&fit=crop"
                            alt="Restaurant"
                        />
                        <div className="gallery-overlay">
                            <h3>Fine Dining</h3>
                            <p>Авторская кухня и лучшие напитки</p>
                        </div>
                    </div>

                </div>

            </section>

        </div>
    );
}

export default About;