import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { TopBar } from "../../components/TopBar/TopBar";
import { ChatField } from "../DashBoard/components/ChatField";
import chatbotIcon from "../../assets/chatbot.png";
import { movieClient } from "../DashBoard/DashBoard";
import "./MovieDetail.scss";

export const MovieDetail = () => {
    const [movie, setMovie] = useState<any>(null);
    const [credits, setCredits] = useState<any>(null);
    const [certifications, setCertifications] = useState<any>(null);
    const [show, setShow] = useState(false);
    const [ageLimit, setAgeLimit] = useState('Chưa có giới hạn độ tuổi');
    const [ageDescription, setAgeDescription] = useState('Chưa có thông tin');
    const [loading, setLoading] = useState(true);
    const [similarMovies, setSimilarMovies] = useState<any[]>([]);
    const [videos, setVideos] = useState<any[]>([]);
    const [showTrailerModal, setShowTrailerModal] = useState(false);
    const [externalIds, setExternalIds] = useState<any>(null);
    const [watchProviders, setWatchProviders] = useState<any>(null);
    const [directorMovies, setDirectorMovies] = useState<any[]>([]);

    const translateMeaning = (meaning: string) => {
        const translations: { [key: string]: string } = {
            'All ages admitted. There is no content that would be objectionable to most parents. This is one of only two ratings dating back to 1968 that still exists today.': 'Mọi lứa tuổi. Không có nội dung gây tranh cãi.',
            'Some material may not be suitable for children under 10. These films may contain some mild language, crude/suggestive humor, scary moments and/or violence. No drug content is present. There are a few exceptions to this rule. A few racial insults may also be heard.': 'Có thể không phù hợp cho trẻ dưới 10 tuổi. Chứa ngôn ngữ nhẹ, hài hước thô tục, cảnh kinh dị.',
            'Some material may be inappropriate for children under 13. Films given this rating may contain sexual content, brief or partial nudity, some strong language and innuendo, humor, mature themes, political themes, terror and/or intense action violence. However, bloodshed is rarely present. This is the minimum rating at which drug content is present.': 'Có thể không phù hợp cho trẻ dưới 13 tuổi. Chứa nội dung tình dục, ngôn ngữ mạnh.',
            'Under 17 requires accompanying parent or adult guardian 21 or older. The parent/guardian is required to stay with the child under 17 through the entire movie, even if the parent gives the child/teenager permission to see the film alone. These films may contain strong profanity, graphic sexuality, nudity, strong violence, horror, gore, and strong drug use. A movie rated R for profanity often has more severe or frequent language than the PG-13 rating would permit. An R-rated movie may have more blood, gore, drug use, nudity, or graphic sexuality than a PG-13 movie would admit.': 'Dưới 17 tuổi cần người lớn đi kèm. Chứa ngôn ngữ thô, tình dục đồ họa, bạo lực mạnh.',
            'These films contain excessive graphic violence, intense or explicit sex, depraved, abhorrent behavior, explicit drug abuse, strong language, explicit nudity, or any other elements which, at present, most parents would consider too strong and therefore off-limits for viewing by their children and teens. NC-17 does not necessarily mean obscene or pornographic in the oft-accepted or legal meaning of those words.': 'Chứa bạo lực đồ họa quá mức, tình dục rõ ràng. Không phù hợp cho trẻ em.',
            'Children 12 or older admitted, children between 6 and 11 only when accompanied by parent or a legal guardian.': 'Trẻ từ 12 tuổi trở lên. Trẻ 6-11 tuổi cần người lớn đi kèm.',
            'No youth admitted, only adults.': 'Chỉ dành cho người lớn.',
            'Children 16 or older admitted, nobody under this age admitted.': 'Trẻ từ 16 tuổi trở lên.',
            'No children younger than 6 years admitted.': 'Không dành cho trẻ dưới 6 tuổi.',
            'No age restriction.': 'Không giới hạn độ tuổi.',
            'Can be aired at any time.': 'Có thể phát sóng bất kỳ lúc nào.',
            'The broadcaster must take the decision about the air time by taking in consideration the impact on young children in the timeframe from 6:00am to 8:00pm.': 'Phát sóng cần cân nhắc tác động đến trẻ nhỏ từ 6h-20h.',
            'Can be aired only from 10:00pm Uhr to 6:00am.': 'Chỉ phát sóng từ 22h đến 6h.',
            'Can be aired only from 11:00pm Uhr to 6:00am.': 'Chỉ phát sóng từ 23h đến 6h.',
            'General admission.': 'Dành cho mọi đối tượng.',
            'Not recommended for audiences under 7.': 'Không khuyến nghị cho khán giả dưới 7 tuổi.',
            'Not recommended for audiences under 12.': 'Không khuyến nghị cho khán giả dưới 12 tuổi.',
            'Not recommended for audiences under 16.': 'Không khuyến nghị cho khán giả dưới 16 tuổi.',
            'Not recommended for audiences under 18.': 'Không khuyến nghị cho khán giả dưới 18 tuổi.',
            'Prohibited for audiences under 18.': 'Cấm khán giả dưới 18 tuổi.',
            'All ages admitted.': 'Mọi lứa tuổi được phép.',
            'Not recommended for children under 6.': 'Không khuyến nghị cho trẻ dưới 6 tuổi.',
            'Not recommended for children under 12.': 'Không khuyến nghị cho trẻ dưới 12 tuổi.',
            'Not recommended for children under 16.': 'Không khuyến nghị cho trẻ dưới 16 tuổi.',
            'Not recommended for children under 18.': 'Không khuyến nghị cho trẻ dưới 18 tuổi.',
            'Suitable for all ages.': 'Phù hợp cho mọi lứa tuổi.',
            'Not recommended for children under 7.': 'Không khuyến nghị cho trẻ dưới 7 tuổi.',
            'For ages 11 and up.': 'Dành cho từ 11 tuổi trở lên.',
            'For ages 15 and up.': 'Dành cho từ 15 tuổi trở lên.',
            'Adults only.': 'Chỉ dành cho người lớn.',
            'Exempt from classification.': 'Miễn phân loại.',
            'Suitable for general audiences.': 'Phù hợp cho khán giả chung.',
            'Parental guidance recommended for younger viewers.': 'Khuyến nghị giám sát của phụ huynh cho trẻ nhỏ.',
            'Suitable for mature audiences 16 years and over.': 'Phù hợp cho khán giả trưởng thành từ 16 tuổi.',
            'Restricted to 18 years and over. No rental or purchase by those under 18. Content not suitable for minors. Video contains frequent use of: sexual activity; brutal/graphic violence; intense horror; and/or other disturbing content.': 'Giới hạn cho 18 tuổi trở lên. Không phù hợp cho trẻ vị thành niên.',
            'Sole purpose of the film is the portrayal of sexually explicit activity and/or explicit violence.': 'Mục đích chính là miêu tả hoạt động tình dục rõ ràng hoặc bạo lực.',
            'Exempt. Contains material not subject to classification such as documentaries, nature, travel, music, arts and culture, sports and educational and instructional information.': 'Miễn. Chứa nội dung không cần phân loại như tài liệu, thiên nhiên, du lịch.',
            'Parental guidance. Moderate violence and moderate profanity is allowed, as is brief nudity and sexual references if important to the context.': 'Giám sát phụ huynh. Cho phép bạo lực vừa phải, chửi thề, khỏa thân ngắn.',
            'Programming intended for viewers ages 14 and older. May contain strong violence and strong profanity, and depictions of sexual activity as long as they are within the context of a story.': 'Dành cho khán giả từ 14 tuổi. Có thể chứa bạo lực mạnh, chửi thề.',
            'Programming intended for viewers ages 18 and older. May contain explicit violence and sexual activity. Programming with this rating cannot air before the watershed (9:00 p.m. to 6:00 a.m.).': 'Dành cho từ 18 tuổi. Chứa bạo lực và tình dục rõ ràng.',
            'NO RATING INFORMATION': 'Không có thông tin xếp hạng',
            // Thêm nhiều hơn nếu cần
        };
        return translations[meaning] || meaning;
    };

    const getAgeDescription = (certifications: any, iso: string, cert: string) => {
        if (!certifications || !certifications[iso]) {
            return 'Chưa có thông tin';
        }
        const certObj = certifications[iso].find((c: any) => c.certification === cert);
        if (!certObj) return 'Chưa có thông tin';
        return translateMeaning(certObj.meaning);
    };

    const { movieId } = useParams<{ movieId: string }>();
    const navigate = useNavigate();

    // Hàm gọi API có hỗ trợ Fallback đơn giản ngay trong component
    // Lưu ý: Tốt nhất nên cấu hình ở file movieClient (Axios Interceptor)
    const fetchWithFallback = async (url: string) => {
        try {
            return await movieClient.get(url);
        } catch (error) {
            console.warn(`Lỗi khi gọi ${url}, đang thử lại...`);
            // Thực hiện gọi lại hoặc đổi Key ở đây nếu cần
            return await movieClient.get(url);
        }
    };

    useEffect(() => {
        if (!movieId) return;

        const fetchAllData = async () => {
            setLoading(true);
            try {
                // Gọi song song các API để tối ưu tốc độ
                const [movieRes, creditsRes, releaseRes, certificationsRes, videosRes, externalRes, watchRes] = await Promise.all([
                    fetchWithFallback(`/movie/${movieId}`),
                    fetchWithFallback(`/movie/${movieId}/credits`),
                    fetchWithFallback(`/movie/${movieId}/release_dates`),
                    fetchWithFallback('/certification/movie/list'),
                    fetchWithFallback(`/movie/${movieId}/videos`),
                    fetchWithFallback(`/movie/${movieId}/external_ids`),
                    fetchWithFallback(`/movie/${movieId}/watch/providers`)
                ]);

                setMovie(movieRes.data);
                setCredits(creditsRes.data);
                setCertifications(certificationsRes.data.certifications);
                setVideos(videosRes.data.results);
                setExternalIds(externalRes.data);
                setWatchProviders(watchRes.data.results);

                // Fetch director movies
                const director = creditsRes.data.crew.find((c: any) => c.job === 'Director');
                if (director) {
                    try {
                        const directorMoviesRes = await fetchWithFallback(`/person/${director.id}/movie_credits`);
                        const directedMovies = directorMoviesRes.data.crew.filter((m: any) => m.job === 'Director').slice(0, 10);
                        setDirectorMovies(directedMovies);
                    } catch (error) {
                        console.error("Lỗi khi tải phim cùng đạo diễn:", error);
                        setDirectorMovies([]);
                    }
                }

                // Fetch similar movies by genres
                const genreIds = movieRes.data.genres?.map((g: any) => g.id).join(',');
                if (genreIds) {
                    try {
                        const similarRes = await fetchWithFallback(`/discover/movie?with_genres=${genreIds}&page=1&sort_by=popularity.desc&include_adult=false`);
                        setSimilarMovies(similarRes.data.results.filter((m: any) => m.id !== movieRes.data.id).slice(0, 10));
                    } catch (error) {
                        console.error("Lỗi khi tải phim cùng thể loại:", error);
                        setSimilarMovies([]);
                    }
                }

                let finalCert = '';
                let finalIso = '';
                // Logic lấy nhãn độ tuổi
                const vnData = releaseRes.data.results.find((r: any) => r.iso_3166_1 === 'VN');
                if (vnData && vnData.release_dates.some((d: any) => d.certification !== "")) {
                    const vnCert = vnData.release_dates.find((d: any) => d.certification !== "");
                    if (vnCert) {
                        finalCert = vnCert.certification;
                        finalIso = 'VN';
                    }
                }
                if (!finalCert) {
                    const usData = releaseRes.data.results.find((r: any) => r.iso_3166_1 === 'US');
                    if (usData && usData.release_dates.some((d: any) => d.certification !== "")) {
                        const usCert = usData.release_dates.find((d: any) => d.certification !== "");
                        if (usCert) {
                            finalCert = usCert.certification;
                            finalIso = 'US';
                        }
                    }
                }
                if (!finalCert) {
                    const originCountryCode = movieRes.data.production_countries[0]?.iso_3166_1;
                    const originData = releaseRes.data.results.find((r: any) => r.iso_3166_1 === originCountryCode);
                    if (originData && originData.release_dates.some((d: any) => d.certification !== "")) {
                        const originCert = originData.release_dates.find((d: any) => d.certification !== "");
                        if (originCert) {
                            finalCert = originCert.certification;
                            finalIso = originCountryCode;
                        }
                    }
                }

                if (finalCert) {
                    setAgeLimit(finalCert);
                    setAgeDescription(getAgeDescription(certificationsRes.data.certifications, finalIso, finalCert));
                }

            } catch (error) {
                console.error("Lỗi khi tải dữ liệu chi tiết phim:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [movieId]);

    if (loading) return <div className="loading-screen">Đang tải dữ liệu phim...</div>;
    if (!movie) return <div className="error-screen">Không tìm thấy thông tin phim.</div>;

    return (
        <div className="detail">
            <div className="detail__topbar">
                <TopBar onSearchSubmit={() => { }} />
            </div>

            <div
                className="detail__banner"
                style={{
                    backgroundImage: `url(${import.meta.env.VITE_BASE_IMAGE_URL}${movie.backdrop_path})`,
                }}
            >
                <div className="detail__overlay" />
            </div>

            <div className="detail__content">
                <div className="detail__poster-wrapper">
                    <div className="detail__poster-container">
                        <img
                            src={`${import.meta.env.VITE_BASE_IMAGE_URL}${movie.poster_path}`}
                            alt={movie.title}
                        />
                    </div>
                </div>

                <div className="detail__info">
                    <h1 className="detail__title">{movie.title}</h1>

                    <div className="detail__meta">
                        <span className="detail__meta-item">{movie.release_date?.split('-')[0]}</span>
                        <span className="detail__meta-divider">•</span>
                        <span className="detail__meta-item">{movie.vote_average?.toFixed(1)} ★</span>
                        {movie.runtime && (
                            <>
                                <span className="detail__meta-divider">•</span>
                                <span className="detail__meta-item">{movie.runtime} phút</span>
                            </>
                        )}
                        <span className="detail__meta-divider">•</span>
                        <span className={`detail__age-badge ${ageLimit === 'Chưa có giới hạn độ tuổi' ? 'detail__age-badge--unknown' : `detail__age-badge--${ageLimit.toLowerCase().replace(/[^a-z0-9]/g, '')}`}`} data-tooltip={ageDescription}>{ageLimit}</span>
                    </div>

                    {/* Trailer */}
                    {videos.length > 0 && (
                        <div className="detail__section">
                            <button
                                className="detail__trailer-button"
                                onClick={() => setShowTrailerModal(true)}
                            >
                                Xem trailer
                            </button>
                        </div>
                    )}

                    {/* Watch Button */}
                    <div className="detail__section">
                        <button
                            className="detail__watch-button"
                            onClick={() => {
                                const link = watchProviders?.VN?.link || watchProviders?.US?.link || `https://www.themoviedb.org/movie/${movieId}/watch`;
                                window.open(link, '_blank');
                            }}
                        >
                            Xem phim
                        </button>
                    </div>

                    {/* Thể loại */}
                    {movie.genres?.length > 0 && (
                        <div className="detail__section">
                            <h3 className="detail__section-title">Thể loại</h3>
                            <div className="detail__genres">
                                {movie.genres.map((genre: any) => (
                                    <span
                                        key={genre.id}
                                        className="detail__genre-tag"
                                        onClick={() => navigate(`/filter?genre=${genre.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Đạo diễn */}
                    {credits?.crew && (
                        <div className="detail__section">
                            <h3 className="detail__section-title">Đạo diễn</h3>
                            <div className="detail__people">
                                {credits.crew
                                    .filter((person: any) => person.job === "Director")
                                    .slice(0, 2)
                                    .map((director: any) => (
                                        <span key={director.id} className="detail__person">
                                            {director.name}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Diễn viên */}
                    {credits?.cast?.length > 0 && (
                        <div className="detail__section">
                            <h3 className="detail__section-title">Diễn viên chính</h3>
                            <div className="detail__people">
                                {credits.cast.slice(0, 5).map((actor: any) => (
                                    <span
                                        key={actor.id}
                                        className="detail__person"
                                        onClick={() => navigate(`/search?person=${actor.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {actor.name} {actor.character && <small>({actor.character})</small>}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="detail__section">
                        <div className="detail__overview">
                            <h3 className="detail__section-title">Mô tả nội dung</h3>
                            <p>{movie.overview || "Nội dung đang được cập nhật..."}</p>
                        </div>
                    </div>

                    {/* Phim cùng thể loại */}
                    {similarMovies.length > 0 && (
                        <div className="detail__section">
                            <h3 className="detail__section-title">Phim cùng thể loại</h3>
                            <div className="detail__similar-movies">
                                {similarMovies.map((similarMovie) => (
                                    <div
                                        key={similarMovie.id}
                                        className="detail__similar-movie"
                                        onClick={() => navigate(`/movie-detail/${similarMovie.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            src={similarMovie.poster_path ? `${import.meta.env.VITE_BASE_IMAGE_URL}${similarMovie.poster_path}` : ''}
                                            alt={similarMovie.title}
                                            className="detail__similar-movie-poster"
                                        />
                                        <div className="detail__similar-movie-info">
                                            <h4 className="detail__similar-movie-title">{similarMovie.title}</h4>
                                            <p className="detail__similar-movie-year">{similarMovie.release_date?.split('-')[0]}</p>
                                            <p className="detail__similar-movie-rating">★ {similarMovie.vote_average?.toFixed(1)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Phim cùng đạo diễn */}
                    {directorMovies.length > 0 && (
                        <div className="detail__section">
                            <h3 className="detail__section-title">Phim cùng đạo diễn</h3>
                            <div className="detail__similar-movies">
                                {directorMovies.map((movie: any) => (
                                    <div
                                        key={movie.id}
                                        className="detail__similar-movie"
                                        onClick={() => navigate(`/movie-detail/${movie.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            src={`${import.meta.env.VITE_BASE_IMAGE_URL}${movie.poster_path}`}
                                            alt={movie.title}
                                            className="detail__similar-movie-poster"
                                        />
                                        <div className="detail__similar-movie-info">
                                            <h4 className="detail__similar-movie-title">{movie.title}</h4>
                                            <p className="detail__similar-movie-year">{movie.release_date?.split('-')[0]}</p>
                                            <p className="detail__similar-movie-rating">★ {movie.vote_average?.toFixed(1)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Trailer Modal */}
            {showTrailerModal && videos.length > 0 && (
                <div className="detail__trailer-modal" onClick={() => setShowTrailerModal(false)}>
                    <div className="detail__trailer-modal-content" onClick={(e) => e.stopPropagation()}>
                        {(() => {
                            const trailer = videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
                            if (trailer) {
                                return (
                                    <iframe
                                        width="900"
                                        height="506"
                                        src={`https://www.youtube.com/embed/${trailer.key}`}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                );
                            }
                            return <p>Không có trailer khả dụng.</p>;
                        })()}
                    </div>
                </div>
            )}

            {/* Chatbot */}
            {show ? (
                <div className="chat_panel">
                    <ChatField onClose={() => setShow(false)} />
                </div>
            ) : (
                <img
                    onClick={() => setShow(true)}
                    src={chatbotIcon}
                    alt="chatbot icon"
                    className="detail__chatbot"
                />
            )}
        </div>
    );
};