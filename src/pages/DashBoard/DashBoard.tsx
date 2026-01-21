import { useNavigate } from "react-router";
import { TopBar } from "../../components/TopBar/TopBar";
import MovieList from "../../components/MovieList/MovieList";
import "./dashboard.scss";
import { useEffect, useState } from "react";
import { ChatField } from "./components/ChatField";
import { Banner } from "../../components/Banner/Banner";
import axios from "axios";
import chatbotIcon from "../../assets/chatbot.png";

export const movieClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    accept: "application/json",
    Authorization: "Bearer " + import.meta.env.VITE_API_TOKEN,
  },
  params: {
    api_key: import.meta.env.VITE_API_KEY,
    language: 'vi-VN'
  }
})

export const DashBoard = () => {
  const navigate = useNavigate();
  const [hotMovie, setHotMovie] = useState([]);
  const [popularMovie, setPopularMovie] = useState([]);
  const [upcomingMovie, setUpcomingMovie] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bannerMovie, setBannerMovie] = useState();
  const [genres, setGenres] = useState();
  const [countries, setCountries] = useState();
  const [show, setShow] = useState(false);



  const fetchMovie = async (url: string) => {
    setIsLoading(true);
    try {
      const res = await movieClient.get(url);
      const data = res.data.results;
      return data;

    } catch (err) {
      console.error("Lỗi fetch:", err);
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleSearchSubmit = async (query: string) => {
    // Search is now handled entirely by SearchDropdown in TopBar
    // This function kept for TopBar compatibility
  };

  const handleSetMovie = async () => {
    try {
      const [hotData, popularData, bannerData, upcomingData] = await Promise.all([
        fetchMovie("/movie/popular"),
        fetchMovie("/movie/top_rated"),
        fetchMovie("/movie/now_playing"),
        fetchMovie("/movie/upcoming")
      ]);
      if (hotData && popularData && bannerData && upcomingData) {
        setHotMovie(hotData);
        setPopularMovie(popularData);
        setBannerMovie(bannerData);
        setUpcomingMovie(upcomingData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetData = async () => {
    const MAJOR_CINEMAS = ['VN', 'US', 'KR', 'JP', 'HK', 'CN', 'TH', 'GB', 'FR', 'IN'];
    try {
      const [genresRes, countriesRes] = await Promise.all([
        movieClient.get("/genre/movie/list"),
        movieClient.get("/configuration/countries")
      ])
      if (genresRes.data && countriesRes.data) {
        const genres = genresRes.data.genres;
        const filtered = countriesRes.data.filter((c: any) => MAJOR_CINEMAS.includes(c.iso_3166_1));
        setGenres(genres);
        setCountries(filtered);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleSetMovie();
    handleSetData();
  }, []);
  const onDetailClick = (id: number) => {
    // navigate()
  };
  return (
    <div className="dash__board">
      <div className="dash__board-row-1">
        <TopBar onSearchSubmit={handleSearchSubmit} />
      </div>
      <div className="dash__board-banner">
        <Banner
          movies={bannerMovie}
        />
      </div>
      <MovieList title="Phim HOT" movies={hotMovie} isLoading={isLoading} />
      <div>
        {/* Sửa class css mỗi loại film 1 màu header */}
        <MovieList title="Phim HAY" movies={popularMovie} isLoading={isLoading} />
      </div>
      <MovieList title="Phim Sắp Chiếu" movies={upcomingMovie} isLoading={isLoading} />

      {show ? (
        <div className="chat_panel">
          <ChatField onClose={() => setShow(false)} />
        </div>
      ) : (
        <img
          onClick={() => setShow(true)}
          src={chatbotIcon}
          alt="chatbot"
          className="dash__board-chat"
        />

      )}
    </div>
  );
};
