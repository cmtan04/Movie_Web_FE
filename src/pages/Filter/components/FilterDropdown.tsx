import { useRef } from "react";
import { FilterButtonGroup } from "../../../components/FilterButtonGroup/FilterButtonGroup";
import { MAJOR_COUNTRIES, MOVIE_TYPES, RATINGS, GENRES, VERSIONS, SORTS, getYears } from "../../../constants";

interface FilterDropdownProps {
    showFilter: boolean;
    setShowFilter: (show: boolean) => void;
    selectedCountry: string;
    setSelectedCountry: (country: string | string[]) => void;
    selectedType: string;
    setSelectedType: (type: string | string[]) => void;
    selectedRating: string;
    setSelectedRating: (rating: string | string[]) => void;
    selectedGenre: string[];
    setSelectedGenre: (genre: string | string[]) => void;
    selectedVersion: string;
    setSelectedVersion: (version: string | string[]) => void;
    selectedYear: string;
    setSelectedYear: (year: string | string[]) => void;
    selectedSort: string;
    setSelectedSort: (sort: string | string[]) => void;
    applyFilters: () => void;
}

export const FilterDropdown = ({
    showFilter,
    setShowFilter,
    selectedCountry,
    setSelectedCountry,
    selectedType,
    setSelectedType,
    selectedRating,
    setSelectedRating,
    selectedGenre,
    setSelectedGenre,
    selectedVersion,
    setSelectedVersion,
    selectedYear,
    setSelectedYear,
    selectedSort,
    setSelectedSort,
    applyFilters
}: FilterDropdownProps) => {
    const filterRef = useRef<HTMLDivElement>(null);

    if (!showFilter) return null;

    return (
        <div ref={filterRef} className="filter-dropdown">
            {/* Quốc gia */}
            <div className="filter-row">
                <span className="filter-label">Quốc gia:</span>
                <FilterButtonGroup options={MAJOR_COUNTRIES} selected={selectedCountry} onSelect={setSelectedCountry} />
            </div>
            {/* Loại phim */}
            <div className="filter-row">
                <span className="filter-label">Loại phim:</span>
                <FilterButtonGroup options={MOVIE_TYPES} selected={selectedType} onSelect={setSelectedType} />
            </div>
            {/* Xếp hạng */}
            <div className="filter-row">
                <span className="filter-label">Xếp hạng:</span>
                <FilterButtonGroup options={RATINGS} selected={selectedRating} onSelect={setSelectedRating} />
            </div>
            {/* Thể loại */}
            <div className="filter-row">
                <span className="filter-label">Thể loại:</span>
                <FilterButtonGroup options={[{ code: '', label: 'Tất cả' }, ...GENRES.map(g => ({ code: String(g.id), label: g.name }))]} selected={selectedGenre} onSelect={setSelectedGenre} isMultiple={true} />
            </div>
            {/* Phiên bản */}
            <div className="filter-row">
                <span className="filter-label">Phiên bản:</span>
                <FilterButtonGroup options={VERSIONS} selected={selectedVersion} onSelect={setSelectedVersion} />
            </div>
            {/* Năm sản xuất */}
            <div className="filter-row">
                <span className="filter-label">Năm sản xuất:</span>
                <FilterButtonGroup options={[{ code: '', label: 'Tất cả' }, ...getYears().map((y: number) => ({ code: y.toString(), label: y.toString() }))].slice(0, 13)} selected={selectedYear} onSelect={setSelectedYear} />
                <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    placeholder="Nhập năm"
                    className="filter-year-input"
                    value={selectedYear.length === 4 ? selectedYear : ''}
                    onChange={e => setSelectedYear(e.target.value)}
                />
            </div>
            {/* Sắp xếp */}
            <div className="filter-row">
                <span className="filter-label">Sắp xếp:</span>
                <FilterButtonGroup options={SORTS} selected={selectedSort} onSelect={setSelectedSort} />
            </div>
            {/* Nút hành động */}
            <div className="filter-action-row">
                <button
                    className="apply-btn"
                    onClick={() => {
                        setShowFilter(false);
                        applyFilters();
                    }}
                >Lọc kết quả ➔</button>
                <button className="apply-btn btn-close" onClick={() => setShowFilter(false)}>Đóng</button>
            </div>
        </div>
    );
};