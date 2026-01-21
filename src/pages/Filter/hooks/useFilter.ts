import { useState, useEffect } from "react";
import axios from "axios";

const movieClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        accept: "application/json",
        Authorization: "Bearer " + import.meta.env.VITE_API_TOKEN,
    },
    params: {
        api_key: import.meta.env.VITE_API_KEY,
        language: 'vi-VN'
    }
});

export const useFilter = () => {
    // Các state cho filter dạng button group
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedVersion, setSelectedVersion] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSort, setSelectedSort] = useState('popularity.desc');

    // State phim, loading, phân trang, popup
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterTrigger, setFilterTrigger] = useState(0); // trigger fetch

    const fetchMovies = async () => {
        setLoading(true);
        try {
            let params: any = { page, "vote_count.gte": 1, "with_watch_monetization_types": "flatrate", "include_adult": false, "include_video": false, "language": "vi-VN", "region": "VN", "sort_by": selectedSort, "with_genres": selectedGenre, "primary_release_year": selectedYear, "with_origin_country": selectedCountry, "page_size": 24 };
            // Chỉ giữ lại các params có giá trị
            Object.keys(params).forEach(key => (params[key] === "" || params[key] == null) && delete params[key]);
            const res = await movieClient.get("/discover/movie", { params });
            setMovies((res.data.results || []).slice(0, 20));
            setTotalPages(res.data.total_pages || 1);
        } catch (err) {
            console.error("Lỗi fetch phim:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
        // eslint-disable-next-line
    }, [filterTrigger, page]);

    const applyFilters = () => {
        setPage(1);
        setFilterTrigger(f => f + 1);
    };

    return {
        // States
        selectedCountry, setSelectedCountry,
        selectedType, setSelectedType,
        selectedRating, setSelectedRating,
        selectedGenre, setSelectedGenre,
        selectedVersion, setSelectedVersion,
        selectedYear, setSelectedYear,
        selectedSort, setSelectedSort,
        movies, loading, page, setPage, totalPages,
        // Actions
        applyFilters
    };
};