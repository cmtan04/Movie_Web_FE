import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { TopBar } from "../../components/TopBar/TopBar";
import { ChatField } from "../DashBoard/components/ChatField";
import chatbotIcon from "../../assets/chatbot.png";
import { movieClient } from "../DashBoard/DashBoard";
import "./TVDetail.scss";
import { useNavigate } from "react-router-dom";

export const TVDetail = () => {
    const [tv, setTv] = useState<any>(null);
    const [credits, setCredits] = useState<any>(null);
    const [certifications, setCertifications] = useState<any>(null);
    const [show, setShow] = useState(false);
    const [ageLimit, setAgeLimit] = useState('Chưa có giới hạn độ tuổi');
    const [ageDescription, setAgeDescription] = useState('Chưa có thông tin');
    const [loading, setLoading] = useState(true);
    const [similarTVs, setSimilarTVs] = useState<any[]>([]);
    const [videos, setVideos] = useState<any[]>([]);
    const [showTrailerModal, setShowTrailerModal] = useState(false);
    const [externalIds, setExternalIds] = useState<any>(null);
    const [watchProviders, setWatchProviders] = useState<any>(null);
    const [directorMovies, setDirectorMovies] = useState<any[]>([]);

    const translateMeaning = (meaning: string) => {
        const translations: { [key: string]: string } = {
            'This program is designed to be appropriate for all children.': 'Phù hợp cho tất cả trẻ em.',
            'This program is designed for children age 7 and above.': 'Phù hợp cho trẻ từ 7 tuổi.',
            'Most parents would find this program suitable for all ages.': 'Phù hợp cho mọi lứa tuổi.',
            'This program contains material that parents may find unsuitable for younger children.': 'Có thể không phù hợp cho trẻ nhỏ.',
            'This program contains some material that many parents would find unsuitable for children under 14 years of age.': 'Có thể không phù hợp cho trẻ dưới 14 tuổi.',
            'This program is specifically designed to be viewed by adults and therefore may be unsuitable for children under 17.': 'Dành cho người lớn, không phù hợp cho trẻ dưới 17 tuổi.',
            'Shows which are exempt from ratings (such as news and sports programming) will not display an on-screen rating at all.': 'Miễn phân loại (như tin tức, thể thao).',
            'Programming suitable for children ages of 2–7 years. No profanity or sexual content of any level allowed. Contains little violence.': 'Phù hợp cho trẻ 2-7 tuổi. Không chửi thề, tình dục. Bạo lực ít.',
            'Suitable for children ages 8+. Low level violence and fantasy horror is allowed. No foul language is allowed, but occasional ': 'Phù hợp từ 8 tuổi. Bạo lực nhẹ, kinh dị giả tưởng.',
            'Suitable for general audiences. Programming suitable for the entire family with mild violence, and mild profanity and/or censored language.': 'Phù hợp cho gia đình. Bạo lực nhẹ, chửi thề nhẹ.',
            'Parental guidance. Moderate violence and moderate profanity is allowed, as is brief nudity and sexual references if important to the context.': 'Giám sát phụ huynh. Bạo lực vừa, chửi thề, khỏa thân ngắn.',
            'Programming intended for viewers ages 14 and older. May contain strong violence and strong profanity, and depictions of sexual activity as long as they are within the context of a story.': 'Từ 14 tuổi. Bạo lực mạnh, chửi thề, tình dục trong ngữ cảnh.',
            'Programming intended for viewers ages 18 and older. May contain explicit violence and sexual activity. Programming with this rating cannot air before the watershed (9:00 p.m. to 6:00 a.m.).': 'Từ 18 tuổi. Bạo lực và tình dục rõ ràng.',
            'For general exhibition; all ages are permitted to watch programming with this rating.': 'Mọi lứa tuổi được phép xem.',
            'Parental guidance recommended for young viewers; PG-rated content may air at any time on digital-only channels, otherwise, it should only be broadcast between 8:30 a.m. and 4:00 p.m. and between 7:00 p.m. and 6:00 a.m.': 'Khuyến nghị giám sát phụ huynh. Phát sóng giới hạn.',
            'Recommended for mature audiences; M-rated content may only be broadcast between 8:30 p.m. and 5:00 a.m. on any day, and additionally between 12:00 p.m. and 3:00 p.m. on schooldays.': 'Dành cho khán giả trưởng thành. Phát sóng tối.',
            'Not suitable for children and teens under 15; MA15+-rated programming may only be broadcast between 9:00 p.m. and 5:00 a.m. on any given day. Consumer advice is mandatory.': 'Không phù hợp dưới 15 tuổi. Phát sóng tối.',
            'Not for children under 18; this is limited to Adult ': 'Không dành cho trẻ dưới 18 tuổi.',
            'Can be aired at any time.': 'Có thể phát sóng bất kỳ lúc nào.',
            'The broadcaster must take the decision about the air time by taking in consideration the impact on young children in the timeframe from 6:00am to 8:00pm.': 'Phát sóng cần cân nhắc tác động đến trẻ nhỏ.',
            'Can be aired only from 10:00pm Uhr to 6:00am.': 'Chỉ từ 22h đến 6h.',
            'Can be aired only from 11:00pm Uhr to 6:00am.': 'Chỉ từ 23h đến 6h.',
            'All ages admitted.': 'Mọi lứa tuổi.',
            'Not recommended for children under 6.': 'Không khuyến nghị dưới 6 tuổi.',
            'Not recommended for children under 12.': 'Không khuyến nghị dưới 12 tuổi.',
            'Not recommended for children under 16.': 'Không khuyến nghị dưới 16 tuổi.',
            'Not recommended for children under 18.': 'Không khuyến nghị dưới 18 tuổi.',
            'Suitable for all ages.': 'Phù hợp mọi lứa tuổi.',
            'Not recommended for children under 7.': 'Không khuyến nghị dưới 7 tuổi.',
            'For ages 11 and up.': 'Từ 11 tuổi.',
            'For ages 15 and up.': 'Từ 15 tuổi.',
            'Adults only.': 'Chỉ người lớn.',
            'Exempt from classification.': 'Miễn phân loại.',
            'Suitable for general audiences.': 'Phù hợp khán giả chung.',
            'Parental guidance recommended for younger viewers.': 'Khuyến nghị giám sát phụ huynh.',
            'Suitable for mature audiences 16 years and over.': 'Phù hợp từ 16 tuổi.',
            'Restricted to 18 years and over. No rental or purchase by those under 18. Content not suitable for minors.': 'Giới hạn 18+. Không phù hợp trẻ vị thành niên.',
            'Sole purpose of the film is the portrayal of sexually explicit activity and/or explicit violence.': 'Miêu tả tình dục hoặc bạo lực rõ ràng.',
            'Exempt. Contains material not subject to classification such as documentaries, nature, travel, music, arts and culture, sports and educational and instructional information.': 'Miễn. Tài liệu, thiên nhiên, du lịch.',
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

    const { tvId } = useParams<{ tvId: string }>();
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
        if (!tvId) return;

        const fetchAllData = async () => {
            setLoading(true);
            try {
                // Gọi song song các API để tối ưu tốc độ
                const [tvRes, creditsRes, ratingsRes, certificationsRes, videosRes, externalRes, watchRes] = await Promise.all([
                    fetchWithFallback(`/tv/${tvId}`),
                    fetchWithFallback(`/tv/${tvId}/credits`),
                    fetchWithFallback(`/tv/${tvId}/content_ratings`),
                    fetchWithFallback('/certification/tv/list'),
                    fetchWithFallback(`/tv/${tvId}/videos`),
                    fetchWithFallback(`/tv/${tvId}/external_ids`),
                    fetchWithFallback(`/tv/${tvId}/watch/providers`)
                ]);

                setTv(tvRes.data);
                setCredits(creditsRes.data);
                setCertifications(certificationsRes.data.certifications);
                setVideos(videosRes.data.results);
                setExternalIds(externalRes.data);
                setWatchProviders(watchRes.data.results);

                // Fetch creator movies (or director)
                const creator = creditsRes.data.crew.find((c: any) => c.job === 'Creator' || c.job === 'Executive Producer' || c.job === 'Director');
                if (creator) {
                    try {
                        const creatorMoviesRes = await fetchWithFallback(`/person/${creator.id}/tv_credits`);
                        const createdShows = creatorMoviesRes.data.crew.filter((s: any) => s.job === 'Creator' || s.job === 'Executive Producer' || s.job === 'Director').slice(0, 10);
                        setDirectorMovies(createdShows);
                    } catch (error) {
                        console.error("Lỗi khi tải phim cùng người tạo:", error);
                        setDirectorMovies([]);
                    }
                }

                // Fetch similar TV shows by genres
                const genreIds = tvRes.data.genres?.map((g: any) => g.id).join(',');
                if (genreIds) {
                    try {
                        const similarRes = await fetchWithFallback(`/discover/tv?with_genres=${genreIds}&page=1&sort_by=popularity.desc&include_adult=false`);
                        setSimilarTVs(similarRes.data.results.filter((t: any) => t.id !== tvRes.data.id).slice(0, 10));
                    } catch (error) {
                        console.error("Lỗi khi tải TV cùng thể loại:", error);
                        setSimilarTVs([]);
                    }
                }

                let finalCert = '';
                let finalIso = '';
                // Logic lấy nhãn độ tuổi
                const usRating = ratingsRes.data.results.find((r: any) => r.iso_3166_1 === 'US');
                if (usRating && usRating.rating) {
                    finalCert = usRating.rating;
                    finalIso = 'US';
                }

                if (finalCert) {
                    setAgeLimit(finalCert);
                    setAgeDescription(getAgeDescription(certificationsRes.data.certifications, finalIso, finalCert));
                }

            } catch (error) {
                console.error("Lỗi khi tải dữ liệu chi tiết TV:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [tvId]);

    if (loading) return <div className="loading-screen">Đang tải dữ liệu TV...</div>;
    if (!tv) return <div className="error-screen">Không tìm thấy thông tin TV.</div>;

    return (
        <div className="detail">
            <div className="detail__topbar">
                <TopBar onSearchSubmit={() => { }} />
            </div>

            <div
                className="detail__banner"
                style={{
                    backgroundImage: `url(${import.meta.env.VITE_BASE_IMAGE_URL}${tv.backdrop_path})`,
                }}
            >
                <div className="detail__overlay" />
            </div>

            <div className="detail__content">
                <div className="detail__poster-wrapper">
                    <div className="detail__poster-container">
                        <img
                            src={`${import.meta.env.VITE_BASE_IMAGE_URL}${tv.poster_path}`}
                            alt={tv.name}
                        />
                    </div>
                </div>

                <div className="detail__info">
                    <h1 className="detail__title">{tv.name}</h1>

                    <div className="detail__meta">
                        <span className="detail__meta-item">{tv.first_air_date?.split('-')[0]}</span>
                        <span className="detail__meta-divider">•</span>
                        <span className="detail__meta-item">{tv.vote_average?.toFixed(1)} ★</span>
                        {tv.number_of_seasons && (
                            <>
                                <span className="detail__meta-divider">•</span>
                                <span className="detail__meta-item">{tv.number_of_seasons} mùa</span>
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
                                const link = watchProviders?.VN?.link || watchProviders?.US?.link || `https://www.themoviedb.org/tv/${tvId}/watch`;
                                window.open(link, '_blank');
                            }}
                        >
                            Xem phim
                        </button>
                    </div>

                    {/* Thể loại */}
                    {tv.genres?.length > 0 && (
                        <div className="detail__section">
                            <h3 className="detail__section-title">Thể loại</h3>
                            <div className="detail__genres">
                                {tv.genres.map((genre: any) => (
                                    <span
                                        key={genre.id}
                                        className="detail__genre-tag"
                                        onClick={() => navigate(`/filter?type=tv&genre=${genre.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Đạo diễn / Creator */}
                    {credits?.crew && (
                        <div className="detail__section">
                            <h3 className="detail__section-title">Người tạo</h3>
                            <div className="detail__people">
                                {credits.crew
                                    .filter((person: any) => person.job === "Creator" || person.job === "Executive Producer")
                                    .slice(0, 2)
                                    .map((creator: any) => (
                                        <span key={creator.id} className="detail__person">
                                            {creator.name}
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
                            <p>{tv.overview || "Nội dung đang được cập nhật..."}</p>
                        </div>
                    </div>


                    {/* TV cùng thể loại */}
                    {similarTVs.length > 0 && (
                        <div className="detail__section">
                            <h3 className="detail__section-title">Phim cùng thể loại</h3>
                            <div className="detail__similar-movies">
                                {similarTVs.map((similarTV) => (
                                    <div
                                        key={similarTV.id}
                                        className="detail__similar-movie"
                                        onClick={() => navigate(`/tv-detail/${similarTV.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            src={similarTV.poster_path ? `${import.meta.env.VITE_BASE_IMAGE_URL}${similarTV.poster_path}` : ''}
                                            alt={similarTV.name}
                                            className="detail__similar-movie-poster"
                                        />
                                        <div className="detail__similar-movie-info">
                                            <h4 className="detail__similar-movie-title">{similarTV.name}</h4>
                                            <p className="detail__similar-movie-year">{similarTV.first_air_date?.split('-')[0]}</p>
                                            <p className="detail__similar-movie-rating">★ {similarTV.vote_average?.toFixed(1)}</p>
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
                                {directorMovies.map((show: any) => (
                                    <div
                                        key={show.id}
                                        className="detail__similar-movie"
                                        onClick={() => navigate(`/tv-detail/${show.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            src={`${import.meta.env.VITE_BASE_IMAGE_URL}${show.poster_path}`}
                                            alt={show.name}
                                            className="detail__similar-movie-poster"
                                        />
                                        <div className="detail__similar-movie-info">
                                            <h4 className="detail__similar-movie-title">{show.name}</h4>
                                            <p className="detail__similar-movie-year">{show.first_air_date?.split('-')[0]}</p>
                                            <p className="detail__similar-movie-rating">★ {show.vote_average?.toFixed(1)}</p>
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