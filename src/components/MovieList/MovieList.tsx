import Marquee from "react-fast-marquee";
import { useRef, useState, useMemo, memo } from "react";
import { useNavigate } from "react-router";
import "./MovieList.scss";
import { ROUTER_PATH } from "../../router/Route";

interface MovieCardProps {
  item: {
    id: number;
    poster_path: string;
    title: string;
    original_title: string;
  };
  onClick: () => void | Promise<void>;
}

const MovieCard = memo(({ item, onClick }: MovieCardProps) => {
  const movieTitle = item.title || item.original_title;
  return (
    <div className="movie-card" onClick={onClick}>
      <div className="movie-card__image-wrapper">
        <div className="movie-card__overlay" title={movieTitle} />
        <img
          src={`${import.meta.env.VITE_BASE_IMAGE_URL}${item.poster_path}`}
          alt={movieTitle}
          className="movie-card__image"
          title={movieTitle}
        />
      </div>
      <div className="movie-card__title">
        <p title={movieTitle}>{movieTitle}</p>
      </div>
    </div>
  );
});

interface MovieListProps {
  title: string;
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
  }>;
  isLoading: boolean;

}


export const MovieList = ({ title, movies, isLoading }: MovieListProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  const handleSlice = (dir: 'left' | 'right') => {
    if (!movies) return;

    const maxIndex = movies.length - itemsPerPage;

    setDirection(dir);
    if (dir === 'left') {
      setStartIndex(prev => Math.max(0, prev - itemsPerPage));
    } else {
      setStartIndex(prev => Math.min(maxIndex, prev + itemsPerPage));
    }
  };

  const canScrollLeft = startIndex > 0;
  const canScrollRight = startIndex + itemsPerPage < (movies?.length || 0);

  // Calculate translate based on card width (200px) + gap (16px)
  const cardWidth = 200;
  const gap = 16;
  const translateAmount = startIndex * (cardWidth + gap);



  // Loading
  if (isLoading) {
    return (
      <div className="movie-list__loading">
        <h2>{title}</h2>
        <p>Data is Loading ...</p>
      </div>
    )
  };

  // No data
  if (!movies || movies.length === 0) {
    return (
      <div className="movie-list__no-data">
        <h2>{title}</h2>
        <p>No Data</p>
      </div>
    )
  }

  // default render
  return (
    <div className="movie-list">
      <h2 className="movie-list__title">{title}</h2>
      <div className="movie-list__wrapper">
        <button
          className="movie-list__nav-btn movie-list__nav-btn--left"
          onClick={() => handleSlice('left')}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          &#10094;
        </button>
        <div className="movie-list__viewport">
          <div className="movie-list__content" ref={contentRef} data-direction={direction} style={{ transform: `translateX(-${translateAmount}px)` }}>
            {movies?.map((item) => (
              <MovieCard key={item.id} item={item} onClick={() => navigate(`${ROUTER_PATH.MOVIE_DETAIL.replace(":movieId", item.id.toString())}`)} />
            ))}
          </div>
        </div>
        <button
          className="movie-list__nav-btn movie-list__nav-btn--right"
          onClick={() => handleSlice('right')}
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default MovieList