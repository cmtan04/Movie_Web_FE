import { TopBar } from "../../components/TopBar/TopBar";
import "./dashboard.scss";

export const DashBoard = () => {
  return (
    <div className="dash__board">
      <div className="dash__board-row-1">
        <TopBar onSearchSubmit={() => {}} />
      </div>
    </div>
  );
};
