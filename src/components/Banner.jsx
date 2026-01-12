import rating from '../assets/rating.png';
import ratingHalf from '../assets/rating-half.png'
import playButton from '../assets/play-button.png'

const Banner = ({ movie }) => {
    if (!movie) {
        return <div>Loading...</div>; // Hoặc một placeholder khác
    }
    return (
        <div className="w-full aspect-video object-cover bg-center bg-no-repeat bg-cover relative ">
            {/* // style={{
            //     backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0)), url(${import.meta.env.VITE_BASE_IMAGE_URL + movie.backdrop_path})`
            // }}> */}
            <img src={import.meta.env.VITE_BASE_IMAGE_URL + movie.backdrop_path} alt="" className="w-full block object-cover bg-linear-to-r from-black to-white" />
            <div className="absolute inset-0 bg-black opacity-30 z-5" />
            <div className="absolute inset-0 flex items-center space-x-7.5 p-10 z-10">
                <div className="details flex flex-col space-y-5 items-baseline w-[40%]">
                    <p className="text-white bg-linear-to-r from-red-600 to-white py-2 px-3 cursor-pointer">
                        TV Show</p>
                    <div className="flex flex-col space-y-4">
                        <h2 className="text-white text-3xl font-bold">{movie.title}</h2>
                    </div>
                    <div className="rating flex items-center space-x-3">
                        <img src={rating} alt="rating" className="w-8 h-8 " />
                        <img src={rating} alt="rating" className="w-8 h-8" />
                        <img src={rating} alt="rating" className="w-8 h-8" />
                        <img src={rating} alt="rating" className="w-8 h-8" />
                        <img src={ratingHalf} alt="rating" className="w-8 h-8" />
                    </div>
                    <p className="text-white w-[75%]">{movie.overview}</p>
                    <div className="flex items-center space-x-4">
                        <button className=" p-3 text-white bg-black font-bold text-sm cursor-pointer" >Chi tiết</button>
                        <button className=" p-3 text-white bg-red-600 font-bold text-sm cursor-pointer"  >Xem phim</button>
                    </div>
                </div>

                {/* <div className="w-[50%] flex justify-center items-center  " >
                    <div className="w-[40%] relative group cursor-pointer ">
                        <img src={import.meta.env.VITE_BASE_IMAGE_URL + movie.poster_path} alt="" className="w-full h-auto object-fit" />
                        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                            <img src={playButton} alt="Play" className="w-8 h-8" />
                        </div>
                    </div>
                </div> */}
            </div>

        </div>
    )
}

export default Banner