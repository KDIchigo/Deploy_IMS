import { Outlet } from "react-router-dom";
import { Footer } from "src/components/Footer/Footer";
import { Header } from "src/components/Header/Header";

export const Layout = () => {
  return (
    <>
      {/* <Header /> */}
      <Outlet />
      {/* <Footer /> */}
    </>
  );
};
