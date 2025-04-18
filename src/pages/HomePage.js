import HomePageSlider from "../components/HomePageSlider";
import Navbar from "../components/Navbar";
import SaleProducts from "../components/SaleProducts";

export default function HomePage() {
    return(
        <div>
            <Navbar />
            <HomePageSlider />
            <SaleProducts />    
        </div>
    )
}