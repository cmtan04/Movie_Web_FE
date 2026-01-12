import React, { useState, useEffect, useRef } from 'react';

const Header = ({ genres, countries }) => {
    const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState('Thể loại');
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('Quốc gia');

    const genreRef = useRef(null);
    const countryRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (genreRef.current && !genreRef.current.contains(event.target)) {
                setIsGenreDropdownOpen(false);
            }
            if (countryRef.current && !countryRef.current.contains(event.target)) {
                setIsCountryDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const getDisplayName = (name) => {
        if (name.includes('Hồng Kông')) {
            return 'Hồng Kông';
        }
        return name;
    };

    const chunkArray = (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };

    const toggleGenreDropdown = () => {
        setIsGenreDropdownOpen(!isGenreDropdownOpen);
        setIsCountryDropdownOpen(false);
    };

    const selectGenre = (genre) => {
        setSelectedGenre(genre.name);
        setIsGenreDropdownOpen(false);
    };

    const toggleCountryDropdown = () => {
        setIsCountryDropdownOpen(!isCountryDropdownOpen);
        setIsGenreDropdownOpen(false);
    };

    const selectCountry = (country) => {
        setSelectedCountry(getDisplayName(country.native_name || country.english_name));
        setIsCountryDropdownOpen(false);
    };

    const genreChunks = genres ? chunkArray(genres, 8) : [];
    const countryChunks = countries ? chunkArray(countries, 5) : [];

    return (
        <header className='p-4 bg-black backdrop-blur-sm flex flex-col md:flex-row items-center justify-between w-full gap-4 sticky top-0 z-50'>
            {/* Logo và Nav */}
            <div className='flex items-center space-x-4'>
                <h1 className='text-[24px] md:text-[30px] uppercase font-bold text-red-700'>movie</h1>
                <nav className="flex items-center space-x-2 md:space-x-4">
                    <a href="#" className="text-white text-sm md:text-base">Home</a>
                    <a href="#" className="text-white text-sm md:text-base">About</a>
                    <a href="#" className="text-white text-sm md:text-base">Contact</a>
                </nav>
            </div>
            <div className='flex items-center space-x-4'>
                <nav className="flex items-center space-x-2 md:space-x-4">
                    <a href="#" className="text-white text-sm md:text-base">Phim lẻ</a>
                    <a href="#" className="text-white text-sm md:text-base">Phim bộ</a>
                    {/* Dropdown Thể loại */}
                    <div className="relative" ref={genreRef}>
                        <button
                            onClick={toggleGenreDropdown}
                            className="text-white text-sm md:text-base bg-transparent px-2 py-1 rounded flex items-center cursor-pointer"
                        >
                            {selectedGenre}
                            <span className="ml-1 text-[1rem]">▼</span>
                        </button>
                        {isGenreDropdownOpen && (
                            <div className="absolute top-full left-0 bg-black/50 text-white mt-2 rounded shadow-lg z-20 flex space-x-1 p-1">
                                {genreChunks.map((chunk, chunkIndex) => (
                                    <ul key={chunkIndex} className="list-none m-0 p-0 flex-1">
                                        {chunk.map((genre, index) => (
                                            <li
                                                key={index}
                                                onClick={() => selectGenre(genre)}
                                                className="px-2 py-1 hover:bg-gray-200 cursor-pointer whitespace-nowrap"
                                            >
                                                {genre.name}
                                            </li>
                                        ))}
                                    </ul>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Dropdown Quốc gia */}
                    <div className="relative" ref={countryRef}>
                        <button
                            onClick={toggleCountryDropdown}
                            className="text-white text-sm md:text-base bg-transparent px-2 py-1 rounded flex items-center cursor-pointer"
                        >
                            {selectedCountry}
                            <span className="ml-1 text-[1rem]">▼</span>
                        </button>
                        {isCountryDropdownOpen && (
                            <div className="absolute top-full left-0 bg-black/50 text-white mt-2 rounded shadow-lg z-20 flex space-x-1 p-1">
                                {countryChunks.map((chunk, chunkIndex) => (
                                    <ul key={chunkIndex} className="list-none m-0 p-0 flex-1">
                                        {chunk.map((country, index) => (
                                            <li
                                                key={index}
                                                onClick={() => selectCountry(country)}
                                                className="px-2 py-1 hover:bg-gray-200 cursor-pointer whitespace-nowrap"
                                            >
                                                {getDisplayName(country.native_name || country.english_name)}
                                            </li>
                                        ))}
                                    </ul>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>
            </div>
            {/* Search Box - Tự động thu nhỏ trên mobile */}
            <div className="flex items-center w-full md:w-auto space-x-2">
                <input
                    type="text"
                    placeholder="Tìm phim theo tên"
                    className="p-2 md:p-3 text-black bg-white grow md:flex-initial w-full md:w-64 outline-none"
                />
                <button className="bg-red-500 p-2 text-white cursor-pointer whitespace-nowrap">
                    Search
                </button>
            </div>
        </header>
    )
}

export default Header