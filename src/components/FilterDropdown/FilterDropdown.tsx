import { forwardRef } from "react";
import { FilterButtonGroup } from "../FilterButtonGroup/FilterButtonGroup";
import { GENRES, MAJOR_COUNTRIES, MOVIE_TYPES, RATINGS, VERSIONS, YEARS, SORTS } from "../../constants";

interface FilterDropdownProps {
    selectedCountry: string;
    setSelectedCountry: (value: string | string[]) => void;
    selectedType: string;
    setSelectedType: (value: string | string[]) => void;
    selectedRating: string;
    setSelectedRating: (value: string | string[]) => void;
    selectedGenre: string[];
    setSelectedGenre: (value: string | string[]) => void;
    selectedVersion: string;
    setSelectedVersion: (value: string | string[]) => void;
    selectedYear: string;
    setSelectedYear: (value: string | string[]) => void;
    selectedSort: string;
    setSelectedSort: (value: string | string[]) => void;
    onApplyFilters: () => void;
    onClose: () => void;
}

export const FilterDropdown = forwardRef<HTMLDivElement, FilterDropdownProps>(
    function FilterDropdown({
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
        onApplyFilters,
        onClose
    }, ref) {
        return (
            <div ref={ref} className="filter-dropdown">
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
                    <FilterButtonGroup options={YEARS.slice(0, 12)} selected={selectedYear} onSelect={setSelectedYear} />
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
                    <FilterButtonGroup options={SORTS} selected={selectedSort} onSelect={setSelectedSort} isMultiple={false} />
                </div>
                {/* Nút hành động */}
                <div className="filter-action-row">
                    <button className="apply-btn" onClick={onApplyFilters}>
                        Lọc kết quả ➔
                    </button>
                    <button className="apply-btn btn-close" onClick={onClose}>
                        Đóng
                    </button>
                </div>
            </div>
        );
    }
);