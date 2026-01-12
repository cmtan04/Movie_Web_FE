import Marquee from "react-fast-marquee";
const MovieList = ({ title, movies, isLoading }) => {
  const scrollContainer = document.querySelector(".scroll-container");



  // Loading
  if (isLoading) {
    return (
      <>
        <div className="bg-black text-white p-10 my-4">
          <h2 className="uppercase text-xl mb-4">{title}</h2>
          <p className="text-white flex justify-center items-center p-4">Data is Loading ...</p>
        </div >
      </>
    )
  };

  // No data
  if (!movies || movies.length === 0) {
    return (
      <>
        <div className="bg-black text-white p-10 my-4">
          <h2 className="uppercase text-xl mb-4">{title}</h2>
          <p className="text-white flex justify-center items-center p-4">No Data</p>
        </div >
      </>
    )
  }

  // default render
  return (
    <div className="bg-black text-white p-10 mt-4">
      <h2 className="uppercase text-xl mb-4">{title}</h2>
      <div className="h-auto flex items-center space-x-4 overflow-x-auto overflow-y-hidden scrollbar-hide">
        {movies.map((item) => (
          <div key={item.id} className="w-50 h-auto flex-none relative group cursor-pointer">
            <div className="group-hover:scale-105 transition duration-300 ease-in-out w-full h-full">
              <div className="absolute top-0 left-0 w-full h-full bg-black/30 group-hover:bg-black/10" />
              <img
                src={`${import.meta.env.VITE_BASE_IMAGE_URL}${item.poster_path}`}
                alt={item.title}
                className="object-fit w-full h-full"
              />
              <div className="absolute bottom-4 w-full px-2 text-center">
                <Marquee speed={20} gradient={false}>
                  <p className="pr-4">{item.title || item.original_title}</p>
                </Marquee>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList