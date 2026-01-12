import { Route, Routes } from "react-router-dom";
import { ROUTER_PATH } from "./Route";
import { SuspenseWrapper } from "../providers";
import { SignIn } from "../pages/Auth/SignIn/SignIn";
import { SignUp } from "../pages/Auth/SignUp/SignUp";
import { DashBoard } from "../pages/DashBoard/DashBoard";

export const WebRouter = () => (
  <Routes>
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
  </Routes>
);
