import "./Filter.scss";
import { useRef } from "react";
import { TopBar } from "../../components/TopBar/TopBar";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { FilterButtonGroup } from "../../components/FilterButtonGroup/FilterButtonGroup";
import { FilterDropdown } from "../../components/FilterDropdown/FilterDropdown";
import { useFilter } from "../../hooks/useFilter";
import { GENRES, MAJOR_COUNTRIES, MOVIE_TYPES, RATINGS, VERSIONS, YEARS, SORTS } from "../../constants";
import { ChatField } from "../DashBoard/components/ChatField";
import chatbotIcon from "../../assets/chatbot.png";

export const Filter = () => {
    const [showFilter, setShowFilter] = useState(false);
    const [show, setShow] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const {
        selectedCountry, setSelectedCountry,
        selectedType, setSelectedType,
        selectedRating, setSelectedRating,
        selectedGenre, setSelectedGenre,
        selectedVersion, setSelectedVersion,
        selectedYear, setSelectedYear,
        selectedSort, setSelectedSort,
        movies,
        loading,
        page,
        setPage,
        totalPages,
        applyFilters
    } = useFilter();

    const handleApplyFilters = () => {
        setShowFilter(false);
        setPage(1);
        applyFilters();
        // Update URL with current filter params
        const params = new URLSearchParams();
        if (selectedType) params.set('type', selectedType);
        if (selectedGenre.length > 0) params.set('genre', selectedGenre.join(','));
        if (selectedCountry) params.set('country', selectedCountry);
        if (selectedYear) params.set('year', selectedYear);
        if (selectedRating) params.set('rating', selectedRating);
        if (selectedVersion) params.set('version', selectedVersion);
        if (selectedSort !== 'release_date.desc') params.set('sort', selectedSort);
        navigate(`/filter?${params.toString()}`, { replace: true });
    };

    return (
        <div className="filter-container">
            <TopBar onSearchSubmit={() => { }} />
            <div className="filter-bar">
                <button className={`filter-btn ${showFilter ? 'filter-btn-open' : ''}`} onClick={() => setShowFilter(v => !v)}>
                    <span>🔍</span> Bộ lọc
                </button>
                {showFilter && (
                    <FilterDropdown
                        ref={filterRef}
                        selectedCountry={selectedCountry}
                        setSelectedCountry={setSelectedCountry}
                        selectedType={selectedType}
                        setSelectedType={setSelectedType}
                        selectedRating={selectedRating}
                        setSelectedRating={setSelectedRating}
                        selectedGenre={selectedGenre}
                        setSelectedGenre={setSelectedGenre}
                        selectedVersion={selectedVersion}
                        setSelectedVersion={setSelectedVersion}
                        selectedYear={selectedYear}
                        setSelectedYear={setSelectedYear}
                        selectedSort={selectedSort}
                        setSelectedSort={setSelectedSort}
                        onApplyFilters={handleApplyFilters}
                        onClose={() => setShowFilter(false)}
                    />
                )}
            </div>
            <div className="film-container">
                {loading ? (
                    <div className="grid-movie-list grid-movie-list-5x4">
                        <p>Đang tải phim...</p>
                    </div>
                ) : movies.length > 0 ? (
                    <div className="grid-movie-list grid-movie-list-5x4">
                        {movies.slice(0, 20).map(movie => (
                            <div
                                key={movie.id}
                                className="grid-movie-item"
                                onClick={() => navigate(selectedType === 'tv' ? `/tv-detail/${movie.id}` : `/movie-detail/${movie.id}`)}
                            >
                                <img
                                    src={movie.poster_path ? `${import.meta.env.VITE_BASE_IMAGE_URL}${movie.poster_path}` : ''}
                                    alt={movie.title || movie.name}
                                />
                                <div className="grid-movie-info">
                                    <div className="grid-movie-title" title={movie.title || movie.name}>
                                        {movie.title || movie.name}
                                    </div>
                                    <div className="grid-movie-date">{movie.release_date || movie.first_air_date}</div>
                                    <div className="grid-movie-vote">★ {movie.vote_average}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-data-message">Không có dữ liệu phù hợp với bộ lọc.</div>
                )}
                {/* Pagination */}
                <div className="filter-pagination">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Trang trước</button>
                    <span>Trang {page} / {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Trang sau</button>
                </div>
            </div>

            {/* Chatbot */}
            {show ? (
                <div className="chat_panel">
                    <ChatField onClose={() => setShow(false)} />
                </div>
            ) : (
                <img
                    onClick={() => setShow(true)}
                    src={chatbotIcon}
                    alt="chatbot icon"
                    className="detail__chatbot"
                />
            )}
        </div>
    );
}