import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { ROUTER_PATH } from "../../router/Route";
import "./searchDropdown.scss";

interface SearchDropdownProps {
    query: string;
    onClose: () => void;
}

export const SearchDropdown = ({ query, onClose }: SearchDropdownProps) => {
    const [results, setResults] = useState<{ movies: any[], people: any[] }>({ movies: [], people: [] });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const movieClient = axios.create({
        baseURL: import.meta.env.VITE_BASE_URL,
        headers: {
            accept: "application/json",
            Authorization: "Bearer " + import.meta.env.VITE_API_TOKEN,
        },
        params: {
            api_key: import.meta.env.VITE_API_KEY,
            language: "vi-VN",
        },
    });

    useEffect(() => {
        console.log('🔍 SearchDropdown mounted, query:', query);
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults({ movies: [], people: [] });
                return;
            }

            setIsLoading(true);
            console.log('🔍 Fetching results for:', query);
            try {
                const [movieRes, personRes] = await Promise.all([
                    movieClient.get("/search/movie", {
                        params: {
                            query: query,
                            include_adult: false,
                            page: 1,
                        },
                    }),
                    movieClient.get("/search/person", {
                        params: {
                            query: query,
                            include_adult: false,
                            page: 1,
                        },
                    })
                ]);
                setResults({
                    movies: movieRes.data?.results?.slice(0, 6) || [],
                    people: personRes.data?.results?.slice(0, 4) || []
                });
                console.log('🔍 Search results - movies:', movieRes.data?.results?.length, 'people:', personRes.data?.results?.length);
            } catch (err) {
                console.error("Search error:", err);
                setResults({ movies: [], people: [] });
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const handleMovieClick = (movieId: number) => {
        navigate(ROUTER_PATH.MOVIE_DETAIL.replace(":movieId", movieId.toString()));
        onClose();
    };

    const handlePersonClick = (personId: number) => {
        navigate(`/search?person=${personId}`);
        onClose();
    };

    if (!query.trim()) return null;

    console.log('🔍 Rendering SearchDropdown, movies:', results.movies.length, 'people:', results.people.length, 'isLoading:', isLoading);

    return (
        <div className="search-dropdown">
            <div className="search-dropdown__overlay" onClick={onClose} />
            <div className="search-dropdown__content">
                {isLoading ? (
                    <div className="search-dropdown__loading">
                        <span>Đang tìm kiếm...</span>
                    </div>
                ) : (results.movies.length > 0 || results.people.length > 0) ? (
                    <>
                        <div className="search-dropdown__header">
                            Kết quả tìm kiếm cho "{query}"
                            <button
                                className="search-dropdown__view-all"
                                onClick={() => {
                                    navigate(`/search?query=${encodeURIComponent(query)}`);
                                    onClose();
                                }}
                            >
                                Xem tất cả →
                            </button>
                        </div>
                        <div className="search-dropdown__list">
                            {results.movies.length > 0 && (
                                <>
                                    <div className="search-dropdown__section-title">Phim</div>
                                    {results.movies.map((movie) => (
                                        <div
                                            key={`movie-${movie.id}`}
                                            className="search-dropdown__item"
                                            onClick={() => handleMovieClick(movie.id)}
                                        >
                                            <div className="search-dropdown__item-poster">
                                                {movie.poster_path ? (
                                                    <img
                                                        src={`${import.meta.env.VITE_BASE_IMAGE_URL}${movie.poster_path}`}
                                                        alt={movie.title}
                                                    />
                                                ) : (
                                                    <div className="search-dropdown__item-no-image">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                            <div className="search-dropdown__item-info">
                                                <h4>{movie.title || movie.original_title}</h4>
                                                <p className="year">
                                                    {movie.release_date?.split("-")[0] || "N/A"}
                                                </p>
                                                <p className="rating">
                                                    {movie.vote_average?.toFixed(1) + "/10" || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                            {results.people.length > 0 && (
                                <>
                                    <div className="search-dropdown__section-title">Đạo diễn/Diễn viên</div>
                                    {results.people.map((person) => (
                                        <div
                                            key={`person-${person.id}`}
                                            className="search-dropdown__item"
                                            onClick={() => handlePersonClick(person.id)}
                                        >
                                            <div className="search-dropdown__item-poster">
                                                {person.profile_path ? (
                                                    <img
                                                        src={`${import.meta.env.VITE_BASE_IMAGE_URL}${person.profile_path}`}
                                                        alt={person.name}
                                                    />
                                                ) : (
                                                    <div className="search-dropdown__item-no-image">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                            <div className="search-dropdown__item-info">
                                                <h4>{person.name}</h4>
                                                <p className="known-for">
                                                    {person.known_for_department || "N/A"}
                                                </p>
                                                <p className="popularity">
                                                    Độ phổ biến: {person.popularity?.toFixed(0) || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="search-dropdown__no-results">
                        Không tìm thấy kết quả cho "{query}"
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchDropdown;
