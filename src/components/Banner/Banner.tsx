import rating from './../../assets/rating.png';
import ratingHalf from './../../assets/rating-half.png'
import playButton from './../../assets/play-button.png'
import './Banner.scss';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTER_PATH } from '../../router/Route';

interface BannerProps {
    movies?: Array<{
        adult: false,
        backdrop_path: string,
        genre_ids: [number],
        id: number,
        original_language: string,
        original_title: string,
        overview: string,
        popularity: number,
        poster_path: string,
        release_date: string,
        title: string,
        video: false,
        vote_average: number,
        vote_count: number
    }>
};

export const Banner = ({ movies }: BannerProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const navigate = useNavigate();

    //Tự động chuyển phim sau 8 giây
    const startAutoSlide = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex(prev => (prev + 1) % (movies?.length || 1));
                setIsTransitioning(false);
            }, 800);
        }, 8000);
    };

    useEffect(() => {
        if (!movies || movies.length === 0) return;

        startAutoSlide();

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [movies]);

    const handleNavigate = (direction: 'left' | 'right') => {
        if (isTransitioning) return;

        // Clear existing interval
        if (intervalRef.current) clearInterval(intervalRef.current);

        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex(prev => {
                if (direction === 'left') {
                    return prev === 0 ? movies!.length - 1 : prev - 1;
                } else {
                    return (prev + 1) % movies!.length;
                }
            });
            setIsTransitioning(false);
            // Restart auto-slide timer
            startAutoSlide();
        }, 800);
    };

    if (!movies || movies.length === 0) {
        return <div>Loading...</div>;
    }

    const currentMovie = movies[currentIndex];

    return (
        <div className={`banner ${isTransitioning ? 'banner--transitioning' : ''}`}>
            <img src={import.meta.env.VITE_BASE_IMAGE_URL + currentMovie.backdrop_path} alt="" className="banner__image" />
            <div className="banner__overlay" />

            <button className="banner__nav-btn banner__nav-btn--left" onClick={() => handleNavigate('left')} disabled={isTransitioning}>
                ❮
            </button>
            <button className="banner__nav-btn banner__nav-btn--right" onClick={() => handleNavigate('right')} disabled={isTransitioning}>
                ❯
            </button>

            <div className="banner__content">
                <div className="banner__poster-wrapper">
                    <div className="banner__poster-container">
                        <img src={import.meta.env.VITE_BASE_IMAGE_URL + currentMovie.poster_path} alt={currentMovie.title} />
                        <div className="banner__play-button">
                            <img src={playButton} alt="Play" />
                            <span className="banner__play-text">Play Trailer</span>
                        </div>
                    </div>
                </div>

                <div className="banner__details">

                    <div>
                        <h2 className="banner__title">{currentMovie.title}</h2>
                    </div>
                    <div className="banner__actions">
                        <button onClick={() => navigate(ROUTER_PATH.MOVIE_DETAIL.replace(':movieId', currentMovie.id.toString()))}>Chi tiết</button>
                    </div>
                </div>



            </div>
        </div>
    )
}
