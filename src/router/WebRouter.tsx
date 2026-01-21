import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { ROUTER_PATH } from "./Route";
import { SuspenseWrapper } from "../providers";
import { SignIn } from "../pages/Auth/SignIn/SignIn";
import { SignUp } from "../pages/Auth/SignUp/SignUp";
import { DashBoard } from "../pages/DashBoard/DashBoard";
import { MovieDetail } from "../pages/MovieDatail/MovieDetail";
import { TVDetail } from "../pages/TVDetail/TVDetail";
import { Filter } from "../pages/Filter/Filter";
import { Search } from "../pages/Search/Search";

export const WebRouter = () => (
  <Routes>
    {/* Redirect root to /dash-board */}
    <Route path="/" element={<Navigate to="/dash-board" replace />} />
    {/* Login */}
    <Route
      path={ROUTER_PATH.SIGN_IN}
      element={<SuspenseWrapper component={<SignIn />} />}
    ></Route>
    <Route
      path={ROUTER_PATH.SIGN_UP}
      element={<SuspenseWrapper component={<SignUp />} />}
    ></Route>
    <Route
      path={ROUTER_PATH.DASH_BOARD}
      element={<SuspenseWrapper component={<DashBoard />} />}
    ></Route>
    <Route
      path={ROUTER_PATH.MOVIE_DETAIL}
      element={<SuspenseWrapper component={<MovieDetail />} />}
    ></Route>
    <Route
      path={ROUTER_PATH.TV_DETAIL}
      element={<SuspenseWrapper component={<TVDetail />} />}
    ></Route>
    <Route
      path={ROUTER_PATH.FILTER}
      element={<SuspenseWrapper component={<Filter />} />}
    ></Route>
    <Route
      path={ROUTER_PATH.SEARCH}
      element={<SuspenseWrapper component={<Search />} />}
    ></Route>
  </Routes>
);
