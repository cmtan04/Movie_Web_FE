import "./App.css";
import Header from "./components/Header";
import Banner from "./components/Banner";
import MovieList from "./components/MovieList";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [hotMovie, setHotMovie] = useState([]);
  const [popularMovie, setPopularMovie] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bannerMovie, setBannerMovie] = useState();
  const [genres, setGenres] = useState();
  const [countries, setCountries] = useState();
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
  })
  const fetchMovie = async (url) => {
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
  const setMovie = async () => {
    try {
      const [hotData, popularData] = await Promise.all([
        fetchMovie("/movie/popular"),
        fetchMovie("/movie/top_rated")
      ]);
      if (hotData && popularData) {
        setHotMovie(hotData);
        setPopularMovie(popularData);
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * hotData.length);
        }
        while (hotData[randomIndex].overview == "");
        setBannerMovie(hotData[randomIndex]);
        console.log(hotData[randomIndex]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const setData = async () => {
    const MAJOR_CINEMAS = ['VN', 'US', 'KR', 'JP', 'HK', 'CN', 'TH', 'GB', 'FR', 'IN'];
    try {
      const [genresRes, countriesRes] = await Promise.all([
        movieClient.get("/genre/movie/list"),
        movieClient.get("/configuration/countries")
      ])
      if (genresRes.data && countriesRes.data) {
        const genres = genresRes.data.genres;
        const filtered = countriesRes.data.filter(c => MAJOR_CINEMAS.includes(c.iso_3166_1));
        setGenres(genres);
        setCountries(filtered);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setMovie();
    setData();
  }, []);
  return (
    <div className="bg-black">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
      </Switch>

      <Header
        genres={genres}
        countries={countries}
      />
      <Banner
        movie={bannerMovie}
      />
      <MovieList
        title={"Phim Hot"}
        movies={hotMovie}
        isLoading={isLoading}
      />
      <MovieList
        title={"Phim Đề Cử"}
        movies={popularMovie}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;
