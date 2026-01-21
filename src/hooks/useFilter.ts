import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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

interface FilterProps {
    type?: string;
    Country?: string;

}

export const useFilter = () => {
    const [searchParams] = useSearchParams();

    // Filter states
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [selectedGenre, setSelectedGenre] = useState<string[]>([]);
    const [selectedVersion, setSelectedVersion] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSort, setSelectedSort] = useState('release_date.desc');
    const [selectedPerson, setSelectedPerson] = useState('');

    // Set initial state from URL params
    useEffect(() => {
        setSelectedType(searchParams.get('type') || '');
        setSelectedGenre(searchParams.get('genre')?.split(',').filter(Boolean) || []);
        setSelectedCountry(searchParams.get('country') || '');
        setSelectedYear(searchParams.get('year') || '');
        setSelectedRating(searchParams.get('rating') || '');
        setSelectedVersion(searchParams.get('version') || '');
        setSelectedSort(searchParams.get('sort') || 'release_date.desc');
        setSelectedPerson(searchParams.get('person') || '');
        // Trigger fetch after setting states
        setTimeout(() => setFilterTrigger(f => f + 1), 0);
    }, [searchParams]);

    // Movie data states
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterTrigger, setFilterTrigger] = useState(0);

    const fetchMovies = async () => {
        setLoading(true);
        try {
            let params: any = {
                page,
                "vote_count.gte": 1,
                "include_adult": false,
                "include_video": false,
                "language": "vi-VN",
                "sort_by": selectedSort,
                "with_genres": selectedGenre.join(','),
                "with_cast": selectedPerson,
                "page_size": 20
            };

            if (selectedType === 'tv') {
                if (selectedYear) params["first_air_date_year"] = selectedYear;
                if (selectedCountry) params["with_origin_country"] = selectedCountry;
                // TV có vote_count thấp hơn và language en-US
                params["vote_count.gte"] = 0;
                params["language"] = "en-US";
            } else {
                params["with_watch_monetization_types"] = "flatrate";
                params["region"] = "VN";
                if (selectedYear) params["primary_release_year"] = selectedYear;
                if (selectedCountry) params["with_origin_country"] = selectedCountry;
            }

            // Remove empty params
            Object.keys(params).forEach(key => (params[key] === "" || params[key] == null) && delete params[key]);
            const endpoint = selectedType === 'tv' ? '/discover/tv' : '/discover/movie';
            console.log('API call:', endpoint, params); // Debug
            const res = await movieClient.get(endpoint, { params });
            console.log('Response:', res.data.results?.length || 0, 'items'); // Debug
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
        setFilterTrigger(f => f + 1);
    };

    // Wrapped setters for compatibility
    const wrappedSetSelectedCountry = (value: string | string[]) => {
        setSelectedCountry(typeof value === 'string' ? value : value[0] || '');
    };
    const wrappedSetSelectedType = (value: string | string[]) => {
        setSelectedType(typeof value === 'string' ? value : value[0] || '');
    };
    const wrappedSetSelectedRating = (value: string | string[]) => {
        setSelectedRating(typeof value === 'string' ? value : value[0] || '');
    };
    const wrappedSetSelectedGenre = (value: string | string[]) => {
        setSelectedGenre(Array.isArray(value) ? value : [value]);
    };
    const wrappedSetSelectedVersion = (value: string | string[]) => {
        setSelectedVersion(typeof value === 'string' ? value : value[0] || '');
    };
    const wrappedSetSelectedYear = (value: string | string[]) => {
        setSelectedYear(typeof value === 'string' ? value : value[0] || '');
    };
    const wrappedSetSelectedSort = (value: string | string[]) => {
        setSelectedSort(typeof value === 'string' ? value : value[0] || '');
    };

    return {
        // Filter states
        selectedCountry, setSelectedCountry: wrappedSetSelectedCountry,
        selectedType, setSelectedType: wrappedSetSelectedType,
        selectedRating, setSelectedRating: wrappedSetSelectedRating,
        selectedGenre, setSelectedGenre: wrappedSetSelectedGenre,
        selectedVersion, setSelectedVersion: wrappedSetSelectedVersion,
        selectedYear, setSelectedYear: wrappedSetSelectedYear,
        selectedSort, setSelectedSort: wrappedSetSelectedSort,
        selectedPerson, setSelectedPerson,
        // Movie data
        movies,
        loading,
        page,
        setPage,
        totalPages,
        // Actions
        applyFilters
    };
};