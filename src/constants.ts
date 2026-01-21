export const GENRES = [
    { id: 28, name: "Hành động" },
    { id: 12, name: "Phiêu lưu" },
    { id: 16, name: "Hoạt hình" },
    { id: 35, name: "Hài hước" },
    { id: 80, name: "Tội phạm" },
    { id: 99, name: "Tài liệu" },
    { id: 18, name: "Chính kịch" },
    { id: 10751, name: "Gia đình" },
    { id: 14, name: "Kỳ ảo" },
    { id: 36, name: "Lịch sử" },
    { id: 27, name: "Kinh dị" },
    { id: 10402, name: "Âm nhạc" },
    { id: 9648, name: "Bí ẩn" },
    { id: 10749, name: "Lãng mạn" },
    { id: 878, name: "Khoa học viễn tưởng" },
    { id: 10770, name: "Phim truyền hình" },
    { id: 53, name: "Giật gân" },
    { id: 10752, name: "Chiến tranh" },
    { id: 37, name: "Miền Tây" },
];

const getYears = () => {
    const current = new Date().getFullYear();
    return Array.from({ length: 40 }, (_, i) => current - i);
};

export { getYears };

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

export const YEARS = [{ code: '', label: 'Tất cả' }, ...getYears().map(y => ({ code: y.toString(), label: y.toString() }))];

export const SORTS = [
    { code: 'release_date.desc', label: 'Mới nhất' },
    { code: 'popularity.desc', label: 'Mới cập nhật' },
    { code: 'vote_average.desc', label: 'Điểm IMDb' },
    { code: 'vote_count.desc', label: 'Lượt xem' },
];