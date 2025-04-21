import HomePageSlider from "../components/HomePageSlider";
import Navbar from "../components/Navbar";
import SaleProducts from "../components/SaleProducts";
import UserProfile from "./UserProfile";
import { useLocation, Routes, Route, Outlet, BrowserRouter } from "react-router-dom";


export default function HomePage() {
    return(
        <div>
            <HomePageSlider />
            <SaleProducts /> 
        </div>
    )
}