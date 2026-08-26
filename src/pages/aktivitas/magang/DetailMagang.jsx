import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./DetailMagang.css";
import DefaultOgImage from "../../../assets/logo_medayuagung_warna.webp";

function DetailMagang() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [magang, setMagang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageOrientations, setImageOrientations] = useState({});
  const apiUrl = import.meta.env.VITE_API_PENGELOAAN_KONTEN;

  useEffect(() => {
    const fetchDetailMagang = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!apiUrl) {
          throw new Error("URL API tidak dikonfigurasi");
        }

        if (!id) {
          navigate("/magang");
          return;
        }

        const response = await fetch(`${apiUrl}/API/magang/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Data magang tidak ditemukan");
          }
          throw new Error("Gagal mengambil data magang");
        }

        const data = await response.json();
        setMagang(data?.magang || null);
      } catch (err) {
        console.error("Error fetching detail magang:", err);
        setError(err.message || "Gagal memuat data magang. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailMagang();
  }, [id, apiUrl, navigate]);

  useEffect(() => {
    if (magang?.foto && magang.foto.length > 0) {
      const orientations = {};
      magang.foto.forEach((foto, index) => {
        const img = new Image();
        img.onload = () => {
          const isPortrait = img.height > img.width;
          orientations[index] = isPortrait ? 'portrait' : 'landscape';
          setImageOrientations({ ...orientations });
        };
        img.src = `${apiUrl}/images/magang/${foto}`;
      });
    }
  }, [magang, apiUrl]);

  const formatPeriode = (mulai, berakhir) => {
    if (!mulai || !berakhir) return "";
    
    const dateMulai = new Date(mulai);
    const dateBerakhir = new Date(berakhir);
    
    const options = { year: "numeric", month: "long", day: "numeric" };
    
    const mulaiStr = dateMulai.toLocaleDateString("id-ID", options);
    const berakhirStr = dateBerakhir.toLocaleDateString("id-ID", options);
    
    return `${mulaiStr} - ${berakhirStr}`;
  };

  const currentUrl = `${window.location.origin}${location.pathname}`;
  const getPlainText = (html) => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  };

  const pageTitle = magang
    ? `${magang.judul || "Program Magang"} - Perpustakaan Medayu Agung Surabaya`
    : "Detail Program Magang - Perpustakaan Medayu Agung Surabaya";

  const pageDescription = magang?.deskripsi_tugas
    ? (() => {
        const plain = getPlainText(magang.deskripsi_tugas);
        return plain.length > 160 ? `${plain.slice(0, 160).trim()}...` : plain;
      })()
    : "Detail program magang Perpustakaan Medayu Agung Surabaya. Informasi tugas, periode, dan dokumentasi kegiatan magang.";

  const ogImage =
    magang?.foto?.length > 0
      ? `${apiUrl}/images/magang/${magang.foto[0]}`
      : magang?.cover
        ? `${apiUrl}/images/magang/${magang.cover}`
        : DefaultOgImage;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content={`${magang?.judul || "program magang"}, magang perpustakaan medayu agung, magang perpustakaan surabaya, magang arsip, magang sejarah, preservasi dokumen`}
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={currentUrl} />
        <meta
          property="og:title"
          content={magang?.judul || "Program Magang Perpustakaan Medayu Agung Surabaya"}
        />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content={magang?.judul || "Program Magang Perpustakaan Medayu Agung Surabaya"}
        />
        <meta property="og:locale" content="id_ID" />
        <meta
          property="og:site_name"
          content="Perpustakaan Medayu Agung Surabaya"
        />
        {magang?.periode_mulai && (
          <meta
            property="article:published_time"
            content={new Date(magang.periode_mulai).toISOString()}
          />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={currentUrl} />
        <meta
          name="twitter:title"
          content={magang?.judul || "Program Magang Perpustakaan Medayu Agung Surabaya"}
        />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
        <meta
          name="twitter:image:alt"
          content={magang?.judul || "Program Magang Perpustakaan Medayu Agung Surabaya"}
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Perpustakaan Medayu Agung Surabaya" />
        <link rel="canonical" href={currentUrl} />
      </Helmet>

      <main className="detail-magang-main">
        <div className="detail-magang-header">
          <button className="magang-detail-back-button" onClick={() => navigate("/magang")}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Kembali</span>
          </button>
        </div>

      <section className="detail-magang-section">
        {loading && (
          <div className="detail-skeleton-container">
            <div className="detail-skeleton-header">
              <div className="detail-skeleton-title"></div>
              <div className="detail-skeleton-period"></div>
            </div>
            <div className="detail-skeleton-card">
              <div className="detail-skeleton-image"></div>
              <div className="detail-skeleton-content">
                <div className="detail-skeleton-text"></div>
                <div className="detail-skeleton-text"></div>
                <div className="detail-skeleton-text short"></div>
              </div>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="detail-error-container">
            <p className="error-message">
              {error || "Data magang tidak ditemukan"}
            </p>
            <button className="retry-button" onClick={() => navigate("/magang")}>
              Kembali ke Daftar Magang
            </button>
          </div>
        )}

        {!loading && !error && magang && (
          <>
            <div className="detail-header">
              <h1 className="detail-title">{magang.judul || "Tanpa Judul"}</h1>
              {magang.periode_mulai && magang.periode_berakhir && (
                <span className="detail-period">
                  {formatPeriode(magang.periode_mulai, magang.periode_berakhir)}
                </span>
              )}
            </div>

            <div className="detail-card">
              {magang.deskripsi_tugas && (
                <div className="magang-description">
                  <h2 className="magang-section-title">Deskripsi</h2>
                  <div 
                    className="magang-description-text"
                    dangerouslySetInnerHTML={{ 
                      __html: magang.deskripsi_tugas.replace(/\n/g, "<br />") 
                    }}
                  />
                </div>
              )}

              {magang.foto && magang.foto.length > 0 && (
                <div className="magang-photos-section">
                  <h2 className="magang-section-title">Foto Kegiatan</h2>
                  <div className="magang-photos-grid">
                    {magang.foto.map((foto, index) => {
                      const orientation = imageOrientations[index] || 'landscape';
                      return (
                        <div 
                          key={index} 
                          className={`magang-image-container ${orientation}`}
                        >
                          <img
                            src={`${apiUrl}/images/magang/${foto}`}
                            alt={`${magang.judul || "Gambar kegiatan"} ${index + 1}`}
                            loading={index === 0 ? "eager" : "lazy"}
                            onLoad={(e) => {
                              const img = e.target;
                              const isPortrait = img.naturalHeight > img.naturalWidth;
                              if (!imageOrientations[index]) {
                                setImageOrientations(prev => ({
                                  ...prev,
                                  [index]: isPortrait ? 'portrait' : 'landscape'
                                }));
                              }
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      <div style={{ height: "50px" }}></div>
      </main>
    </>
  );
}

export default DetailMagang;
