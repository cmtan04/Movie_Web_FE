export const GENRES = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
];

export const getYears = () => {
    const current = new Date().getFullYear();
    return Array.from({ length: 40 }, (_, i) => current - i);
};

export const MAJOR_COUNTRIES = [
    { code: "", label: "Tất cả" },
    { code: "US", label: "Mỹ" },
    { code: "KR", label: "Hàn Quốc" },
    { code: "JP", label: "Nhật Bản" },
    { code: "CN", label: "Trung Quốc" },
    { code: "GB", label: "Anh" },
    { code: "FR", label: "Pháp" },
    { code: "IN", label: "Ấn Độ" },
    { code: "VN", label: "Việt Nam" },
    { code: "TH", label: "Thái Lan" },
    { code: "HK", label: "Hong Kong" },
    { code: "CA", label: "Canada" },
    { code: "DE", label: "Đức" },
    { code: "AU", label: "Úc" },
    { code: "TW", label: "Đài Loan" },
];

export const MOVIE_TYPES = [
    { code: '', label: 'Tất cả' },
    { code: 'movie', label: 'Phim lẻ' },
    { code: 'tv', label: 'Phim bộ' },
];

export const RATINGS = [
    { code: '', label: 'Tất cả' },
    { code: 'P', label: 'P (Mọi lứa tuổi)' },
    { code: 'K', label: 'K (Dưới 13 tuổi)' },
    { code: 'T13', label: 'T13 (13+)' },
    { code: 'T16', label: 'T16 (16+)' },
    { code: 'T18', label: 'T18 (18+)' },
];

export const VERSIONS = [
    { code: '', label: 'Tất cả' },
    { code: 'sub', label: 'Phụ đề' },
    { code: 'dub', label: 'Lồng tiếng' },
    { code: 'thuyet-minh-bac', label: 'Thuyết minh giọng Bắc' },
    { code: 'thuyet-minh-nam', label: 'Thuyết minh giọng Nam' },
];

export const SORTS = [
    { code: 'release_date.desc', label: 'Mới nhất' },
    { code: 'popularity.desc', label: 'Mới cập nhật' },
    { code: 'vote_average.desc', label: 'Điểm IMDb' },
    { code: 'vote_count.desc', label: 'Lượt xem' },
];