import { memo, useRef, useState } from "react";
import './FilterButton.scss';
import { A } from "react-router/dist/development/instrumentation-DvHY1sgY";
const FilterButtonGroup = memo(function FilterButtonGroup({ options, selected, onSelect }: { options: any[], selected: string, onSelect: (code: string) => void }) {
    return (
        <>
            {options.map(opt => (
                <button
                    key={opt.code ?? opt.id}
                    className={selected === (opt.code ?? String(opt.id)) ? 'filter-btn-active' : 'filter-btn-option'}
                    onClick={e => {
                        onSelect(opt.code ?? String(opt.id));
                        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
                    }}
                    type="button"
                >{opt.label ?? opt.name}</button>
            ))}
        </>
    );
});



export const FilterButton = () => {
    const [showFilter, setShowFilter] = useState(false);
    return (
        <div className="filter">
            <button className="filter__btn" onClick={() => setShowFilter(v => !v)}>
                <span>🔍</span> Bộ lọc
            </button>
            {showFilter && (
                <div className="filter__container">
                    <div className="filter__country">
                        <span>Quốc gia</span>
                        {GENRES.map(item => (
                            <button key={item.id}>{item.name}</button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
const GENRES = [
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

const SORT_OPTIONS = [
    { value: "popularity.desc", label: "Phổ biến giảm dần" },
    { value: "popularity.asc", label: "Phổ biến tăng dần" },
    { value: "release_date.desc", label: "Năm mới nhất" },
    { value: "release_date.asc", label: "Năm cũ nhất" },
    { value: "vote_average.desc", label: "Điểm cao nhất" },
    { value: "vote_average.asc", label: "Điểm thấp nhất" },
];
const getYears = () => {
    const current = new Date().getFullYear();
    return Array.from({ length: 40 }, (_, i) => current - i);
};

// Các state cho filter dạng button group
const [selectedCountry, setSelectedCountry] = useState('');
const [selectedType, setSelectedType] = useState('');
const [selectedRating, setSelectedRating] = useState('');
const [selectedGenre, setSelectedGenre] = useState('');
const [selectedVersion, setSelectedVersion] = useState('');
const [selectedYear, setSelectedYear] = useState('');
const [selectedSort, setSelectedSort] = useState('popularity.desc');
// Dữ liệu cho các nhóm filter
const MAJOR_COUNTRIES = [
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
const MOVIE_TYPES = [
    { code: '', label: 'Tất cả' },
    { code: 'movie', label: 'Phim lẻ' },
    { code: 'tv', label: 'Phim bộ' },
];
const RATINGS = [
    { code: '', label: 'Tất cả' },
    { code: 'P', label: 'P (Mọi lứa tuổi)' },
    { code: 'K', label: 'K (Dưới 13 tuổi)' },
    { code: 'T13', label: 'T13 (13+)' },
    { code: 'T16', label: 'T16 (16+)' },
    { code: 'T18', label: 'T18 (18+)' },
];
const VERSIONS = [
    { code: '', label: 'Tất cả' },
    { code: 'sub', label: 'Phụ đề' },
    { code: 'dub', label: 'Lồng tiếng' },
    { code: 'thuyet-minh-bac', label: 'Thuyết minh giọng Bắc' },
    { code: 'thuyet-minh-nam', label: 'Thuyết minh giọng Nam' },
];
const YEARS = [{ code: '', label: 'Tất cả' }, ...getYears().map(y => ({ code: y.toString(), label: y.toString() }))];
const SORTS = [
    { code: 'release_date.desc', label: 'Mới nhất' },
    { code: 'popularity.desc', label: 'Mới cập nhật' },
    { code: 'vote_average.desc', label: 'Điểm IMDb' },
    { code: 'vote_count.desc', label: 'Lượt xem' },
];
