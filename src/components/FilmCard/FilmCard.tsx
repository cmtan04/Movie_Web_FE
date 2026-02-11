import { formatMinutesToTime } from "../../../../common/constext/format";
import "./filmCard.scss";

interface FilmCardProps {
  title: string;
  imageUrl: string;
  description: string;
  time: number;
}
export const FilmCard = (props: FilmCardProps) => {
  return (
    <div className="film__card">
      <div className="film__card-head">
        <img src={props.imageUrl} alt="" />
        <span className="film__card-time">
          {formatMinutesToTime(props.time)}
        </span>
      </div>
      <div className="film__card-body">
        <h1>{props.title}</h1>
        <p>{props.description}</p>
      </div>
    </div>
  );
};
