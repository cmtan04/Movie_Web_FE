import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { TopBar } from "../../components/TopBar/TopBar";
import "../../components/TopBar/topbar.scss";
import axios from "axios";
import { ROUTER_PATH } from "../../router/Route";
import "./Search.scss";
import { ChatField } from "../DashBoard/components/ChatField";
import chatbotIcon from "../../assets/chatbot.png";
import { movieClient } from "../DashBoard/DashBoard";

interface SearchResult {
    movies: any[];
    people: any[];
    tv: any[];
    personMovies?: any[];
}

export const Search = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [results, setResults] = useState<SearchResult>({ movies: [], people: [], tv: [], personMovies: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'movies' | 'tv' | 'people'>('movies');
    const [show, setShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const moviesPerPage = 20;

    // Calculate movies for current page
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = results.movies.slice(indexOfFirstMovie, indexOfLastMovie);
    const totalPages = Math.ceil(results.movies.length / moviesPerPage);

    const query = searchParams.get('query') || '';
    const personId = searchParams.get('person');

    const [personName, setPersonName] = useState<string>('');
    const [foundPersonId, setFoundPersonId] = useState<number | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (personId) {
                // Fetch person details and movies
                setIsLoading(true);
                try {
                    const [personRes, creditsRes] = await Promise.all([
                        movieClient.get(`/person/${personId}`),
                        movieClient.get(`/person/${personId}/movie_credits`)
                    ]);
                    setPersonName(personRes.data.name);
                    const movies = creditsRes.data.cast.concat(creditsRes.data.crew).filter((item: any, index: number, self: any[]) =>
                        self.findIndex(m => m.id === item.id) === index
                    );
                    setResults({
                        movies: movies,
                        people: [],
                        tv: []
                    });
                } catch (err) {
                    console.error("Person search error:", err);
                    setResults({ movies: [], people: [], tv: [], personMovies: [] });
                    setPersonName('');
                } finally {
                    setIsLoading(false);
                }
                return;
            }

            if (!query.trim()) {
                setResults({ movies: [], people: [], tv: [], personMovies: [] });
                setPersonName('');
                return;
            }

            setIsLoading(true);
            try {
                const multiRes = await movieClient.get("/search/multi", {
                    params: {
                        query: query,
                        include_adult: false,
                        language: 'vi-VN',
                        page: 1,
                    },
                });

                const allResults = multiRes.data?.results || [];
                console.log('Multi-search results:', allResults);
                const movies = allResults.filter((r: any) => r.media_type === 'movie');
                const people = allResults.filter((r: any) => r.media_type === 'person');
                const tv = allResults.filter((r: any) => r.media_type === 'tv');

                let allMovies = [...movies];
                let personMovies: any[] = [];

                // If we found people results, fetch movies for the first person
                if (people.length > 0) {
                    try {
                        const firstPerson = people[0];
                        setFoundPersonId(firstPerson.id);
                        const creditsRes = await movieClient.get(`/person/${firstPerson.id}/movie_credits`);
                        personMovies = creditsRes.data.cast.concat(creditsRes.data.crew).filter((item: any, index: number, self: any[]) =>
                            self.findIndex(m => m.id === item.id) === index
                        );
                        // Add person movies to the movies list, avoiding duplicates
                        allMovies = [...movies, ...personMovies].filter((item, index, self) =>
                            self.findIndex(m => m.id === item.id) === index
                        );
                        setPersonName(firstPerson.name);
                    } catch (err) {
                        console.error("Error fetching person movies:", err);
                        setPersonName('');
                        setFoundPersonId(null);
                    }
                } else {
                    setPersonName('');
                    setFoundPersonId(null);
                }

                setResults({
                    movies: allMovies,
                    people,
                    tv,
                    personMovies
                });
            } catch (err) {
                console.error("Search error:", err);
                setResults({ movies: [], people: [], tv: [], personMovies: [] });
                setPersonName('');
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [query, personId]);

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [query, personId]);

    const handleMovieClick = (movieId: number) => {
        navigate(ROUTER_PATH.MOVIE_DETAIL.replace(":movieId", movieId.toString()));
    };

    const handlePersonClick = (personId: number) => {
        navigate(`/search?person=${personId}`);
    };

    const handleTVClick = (tvId: number) => {
        navigate(ROUTER_PATH.TV_DETAIL.replace(":tvId", tvId.toString()));
    };

    return (
        <div className="search-page">
            <TopBar onSearchSubmit={() => { }} />

            <div className="search-container">
                <div className="search-header">
                    <h1>
                        {personId
                            ? `Phim có sự tham gia của ${personName}`
                            : `Kết quả tìm kiếm cho "${query}"`
                        }
                    </h1>
                    {!personId && (
                        <div className="search-stats">
                            <span>{results.movies.length} phim</span>
                            <span>{results.tv.length} TV</span>
                            <span>{results.people.length} người</span>
                        </div>
                    )}
                </div>

                {!personId && (
                    <div className="search-tabs">
                        <button
                            className={`search-tab ${activeTab === 'movies' ? 'active' : ''}`}
                            onClick={() => setActiveTab('movies')}
                        >
                            Phim Lẻ ({results.movies.length})
                        </button>
                        <button
                            className={`search-tab ${activeTab === 'tv' ? 'active' : ''}`}
                            onClick={() => setActiveTab('tv')}
                        >
                            Phim Bộ ({results.tv.length})
                        </button>
                        <button
                            className={`search-tab ${activeTab === 'people' ? 'active' : ''}`}
                            onClick={() => setActiveTab('people')}
                        >
                            Đạo diễn/Diễn viên ({results.people.length})
                        </button>
                    </div>
                )}

                <div className="search-results">
                    {isLoading ? (
                        <div className="search-loading">
                            <span>Đang tìm kiếm...</span>
                        </div>
                    ) : personId || activeTab === 'movies' ? (
                        <div>
                            <div className="search-grid">
                                {currentMovies.map((movie) => (
                                    <div
                                        key={movie.id}
                                        className="search-item"
                                        onClick={() => handleMovieClick(movie.id)}
                                    >
                                        <div className="search-item-poster">
                                            {movie.poster_path ? (
                                                <img
                                                    src={`${import.meta.env.VITE_BASE_IMAGE_URL}${movie.poster_path}`}
                                                    alt={movie.title || movie.name}
                                                />
                                            ) : (
                                                <div className="search-item-no-image">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        <div className="search-item-info">
                                            <h3>{movie.title || movie.name}</h3>
                                            <p className="search-item-year">
                                                {movie.release_date || movie.first_air_date ?
                                                    (movie.release_date || movie.first_air_date).split("-")[0] :
                                                    "N/A"}
                                            </p>
                                            <p className="search-item-rating">
                                                ★ {movie.vote_average?.toFixed(1) || "N/A"}
                                            </p>
                                            <p className="search-item-type">
                                                {movie.media_type === 'tv' ? 'Phim bộ' : 'Phim lẻ'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="pagination-btn"
                                    >
                                        ‹ Trước
                                    </button>
                                    <span className="pagination-info">
                                        Trang {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="pagination-btn"
                                    >
                                        Sau ›
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : activeTab === 'tv' ? (
                        <div className="search-grid">
                            {results.tv.map((tv) => (
                                <div
                                    key={tv.id}
                                    className="search-item"
                                    onClick={() => handleTVClick(tv.id)}
                                >
                                    <div className="search-item-poster">
                                        {tv.poster_path ? (
                                            <img
                                                src={`${import.meta.env.VITE_BASE_IMAGE_URL}${tv.poster_path}`}
                                                alt={tv.name}
                                            />
                                        ) : (
                                            <div className="search-item-no-image">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="search-item-info">
                                        <h3>{tv.name}</h3>
                                        <p className="search-item-year">
                                            {tv.first_air_date ? tv.first_air_date.split("-")[0] : "N/A"}
                                        </p>
                                        <p className="search-item-rating">
                                            ★ {tv.vote_average?.toFixed(1) || "N/A"}
                                        </p>
                                        <p className="search-item-type">
                                            Phim bộ
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="search-grid">
                            {results.people.map((person) => (
                                <div
                                    key={person.id}
                                    className="search-item"
                                    onClick={() => handlePersonClick(person.id)}
                                >
                                    <div className="search-item-poster">
                                        {person.profile_path ? (
                                            <img
                                                src={`${import.meta.env.VITE_BASE_IMAGE_URL}${person.profile_path}`}
                                                alt={person.name}
                                            />
                                        ) : (
                                            <div className="search-item-no-image">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="search-item-info">
                                        <h3>{person.name}</h3>
                                        <p className="search-item-department">
                                            {person.known_for_department || "N/A"}
                                        </p>
                                        <p className="search-item-popularity">
                                            Độ phổ biến: {person.popularity?.toFixed(0) || "N/A"}
                                        </p>
                                        <p className="search-item-known-for">
                                            Nổi tiếng với: {person.known_for?.[0]?.title || person.known_for?.[0]?.name || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && !personId && query.trim() !== "" && ((activeTab === 'movies' && results.movies.length === 0) ||
                        (activeTab === 'tv' && results.tv.length === 0) ||
                        (activeTab === 'people' && results.people.length === 0)) && (
                            <div className="search-no-results">
                                Không tìm thấy kết quả cho "{query}" trong mục này
                            </div>
                        )}
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
};  