import './Gallery.css';

// === ИМПОРТЫ LIGHTGALLERY ===
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

function Gallery() {

    const images = [
        {
            src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600&auto=format&fit=crop',
            title: 'Luxury Lobby'
        },
        {
            src: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop',
            title: 'Premium Suite'
        },
        {
            src: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop',
            title: 'Minimal Interior'
        },
        {
            src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1600&auto=format&fit=crop',
            title: 'Luxury Restaurant'
        },
        {
            src: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1600&auto=format&fit=crop',
            title: 'Fine Dining'
        },
        {
            src: 'https://images.unsplash.com/photo-1582719478250-c89404bb8a0e?q=80&w=1600&auto=format&fit=crop',
            title: 'Ocean View Room'
        },
        {
            src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1600&auto=format&fit=crop',
            title: 'Modern Bedroom'
        },
        {
            src: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1600&auto=format&fit=crop',
            title: 'Spa & Wellness'
        }
    ];

    return (
        <div className="gallery-page">

            <section className="gallery-hero">
                <div className="gallery-hero-overlay">
                    <div className="container">
                        <div className="gallery-hero-content">
                            <p className="gallery-subtitle">
                                OASIS EXPERIENCE
                            </p>
                            <h1>
                                Галерея нашего отеля
                            </h1>
                            <p>
                                Окунитесь в атмосферу роскоши,
                                комфорта и современного дизайна.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="gallery-section container">
                <LightGallery
                    speed={500}
                    plugins={[lgThumbnail, lgZoom]}
                    selector=".lg-item"
                    elementClassNames="gallery-masonry"
                >
                    {images.map((image, index) => (
                        <a
                            href={image.src}
                            key={index}
                            className={`gallery-card lg-item ${index % 5 === 0 ? 'large' : ''}`}
                        >
                            <img
                                src={image.src}
                                alt={image.title}
                            />

                            <div className="gallery-card-overlay">
                                <h3>
                                    {image.title}
                                </h3>
                            </div>
                        </a>
                    ))}
                </LightGallery>

            </section>

        </div>
    );
}

export default Gallery;