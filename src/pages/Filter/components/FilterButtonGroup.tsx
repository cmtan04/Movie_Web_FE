import { memo } from "react";

export const FilterButtonGroup = memo(function FilterButtonGroup({ options, selected, onSelect }: { options: any[], selected: string, onSelect: (code: string) => void }) {
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