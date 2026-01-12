import { useNavigate } from "react-router";
import { TopBar } from "../../components/TopBar/TopBar";
import { FilmCard } from "./components/FilmCard/FilmCard";
import "./dashboard.scss";
import { useState } from "react";
import { ChatField } from "./components/ChatField";

const hotFilms = [
  {
    id: 1,
    title: "The Dark Knight",
    imageUrl: "https://example.com/image1.jpg",
    description: "Khi mối đe dọa được gọi là Joker xuất hiện từ quá khứ...",
    time: 152,
  },
  {
    id: 2,
    title: "Inception",
    imageUrl: "https://example.com/image2.jpg",
    description:
      "Một tên trộm lấy cắp bí mật doanh nghiệp thông qua giấc mơ...",
    time: 148,
  },
  {
    id: 3,
    title: "Interstellar",
    imageUrl: "https://example.com/image3.jpg",
    description: "Một nhóm khám phá du hành qua lỗ sâu trong không gian...",
    time: 169,
  },
  {
    id: 4,
    title: "Parasite",
    imageUrl: "https://example.com/image4.jpg",
    description: "Tham vọng không biết ranh giới giữa các tầng lớp...",
    time: 132,
  },
  {
    id: 5,
    title: "Avengers: Endgame",
    imageUrl: "https://example.com/image5.jpg",
    description: "Sau những sự kiện tàn khốc, các Avengers tập hợp lần cuối...",
    time: 181,
  },
];
export const DashBoard = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const onDetailClick = (id: number) => {
    // navigate()
  };
  return (
    <div className="dash__board">
      <div className="dash__board-row-1">
        <TopBar onSearchSubmit={() => {}} />
      </div>

      <div className="dash__board-row">
        <div className="header">
          <h1>Phim HOT</h1>
        </div>
        <div className="body">
          {hotFilms.map((film) => (
            <div
              key={film.id}
              className="carousel-item"
              onClick={() => {
                onDetailClick(2);
              }}
            >
              <FilmCard
                title={film.title}
                imageUrl={film.imageUrl}
                description={film.description}
                time={film.time}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="dash__board-row">
        <div className="header">
          {/* Sửa class css mỗi loại film 1 màu header */}
          <h1>Phim HAY</h1>
        </div>
        <div className="body">
          {hotFilms.map((film) => (
            <div
              key={film.id}
              className="carousel-item"
              onClick={() => {
                onDetailClick(2);
              }}
            >
              {/* Khi connect api thì gán trường id vào onclick để navigate sang detail  */}
              <FilmCard
                title={film.title}
                imageUrl={film.imageUrl}
                description={film.description}
                time={film.time}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="dash__board-row">
        <div className="header">
          <h1>Phim mới</h1>
        </div>
        <div className="body">
          {hotFilms.map((film) => (
            <div
              key={film.id}
              className="carousel-item"
              onClick={() => {
                onDetailClick(2);
              }}
            >
              <FilmCard
                title={film.title}
                imageUrl={film.imageUrl}
                description={film.description}
                time={film.time}
              />
            </div>
          ))}
        </div>
      </div>

      {show ? (
        <div className="chat_panel">
          <ChatField onClose={() => setShow(false)} />
        </div>
      ) : (
        <img
          onClick={() => setShow(true)}
          src="https://example.com/image5.jpg"
          alt=""
          className="dash__board-chat"
        />
      )}
    </div>
  );
};
