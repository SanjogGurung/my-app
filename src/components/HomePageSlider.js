import { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchWallpapers } from "../redux/slices/wallpapersSlice";

export default function HomePageSlider() {
    // const [wallpapers, setWallpapers] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);

    const wallpapers = useSelector((state) => state.wallpapers.wallpapers);
    const loading = useSelector((state) => state.wallpapers.loading);
    const error = useSelector((state) => state.wallpapers.error);
    const dispatch = useDispatch();

    useEffect(()=> {
      dispatch(fetchWallpapers());
    }, [dispatch]);

    // useEffect(() => {
    //     async function fetchWallpapers() {
    //       try {
    //         const response = await fetch('http://localhost:8082/wallpaper/wallpapers'); // Replace with your API endpoint
    //         if (!response.ok) {
    //           throw new Error('Failed to fetch wallpapers.');
    //         }
    //         const data = await response.json();
    //         setWallpapers(data);
    //         setLoading(false);
    //       } catch (err) {
    //         setError(err);
    //         setLoading(false);
    //       }
    //     }
    
    //     fetchWallpapers();
    //   }, []);
    
      if (loading) {
        return <p>Loading wallpapers...</p>;
      }
    
      if (error) {
        return <p>Error: {error.message}</p>;
      }

    const responsive = {
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 1,
          slidesToSlide: 1 // optional, default to 1.
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 1,
          slidesToSlide: 1 // optional, default to 1.
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1,
          slidesToSlide: 1 // optional, default to 1.
        }
      };
      
    return (
        <Carousel responsive={responsive}>
            {wallpapers.map((wallpaper)=>(
                <img
                src = {`http://localhost:8082/wallpaper/${wallpaper.id}/image`} 
                alt={wallpaper.title}
                style={{ width: '100%', height:'600px',margin: '10px', objectFit: 'fill' }} // Adjust styling as needed
                />
            ) )}
        </Carousel>
    )
}