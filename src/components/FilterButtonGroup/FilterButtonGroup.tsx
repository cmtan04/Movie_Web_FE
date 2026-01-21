import { memo } from "react";

interface FilterButtonGroupProps {
    options: Array<{ code?: string; id?: number; label?: string; name?: string }>;
    selected: string | string[];
    onSelect: (codes: string | string[]) => void;
    isMultiple?: boolean;
}

export const FilterButtonGroup = memo(function FilterButtonGroup({
    options,
    selected,
    onSelect,
    isMultiple = false
}: FilterButtonGroupProps) {
    const selectedArray = Array.isArray(selected) ? selected : selected ? [selected] : [];
    return (
        <>
            {options.map(opt => {
                const code = opt.code ?? String(opt.id);
                let isSelected: boolean;
                if (isMultiple) {
                    if (code === '') {
                        isSelected = selectedArray.length === 0;
                    } else {
                        isSelected = selectedArray.includes(code);
                    }
                } else {
                    isSelected = selected === code;
                }
                return (
                    <button
                        key={code}
                        className={isSelected ? 'filter-btn-active' : 'filter-btn-option'}
                        onClick={e => {
                            if (isMultiple) {
                                let newSelected: string[];
                                if (code === '') {
                                    // "Tất cả" - deselect all
                                    newSelected = [];
                                } else {
                                    if (isSelected) {
                                        newSelected = selectedArray.filter(s => s !== code);
                                    } else {
                                        newSelected = [...selectedArray, code];
                                    }
                                }
                                onSelect(newSelected);
                            } else {
                                onSelect(isSelected ? '' : code);
                            }
                            if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
                        }}
                        type="button"
                    >
                        {opt.label ?? opt.name}
                    </button>
                );
            })}
        </>
    );
});