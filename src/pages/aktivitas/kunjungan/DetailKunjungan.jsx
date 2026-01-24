import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./DetailKunjungan.css";
import DefaultOgImage from "../../../assets/logo_medayuagung_warna.webp";

function DetailKunjungan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [kunjungan, setKunjungan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageOrientations, setImageOrientations] = useState({});
  const apiUrl = import.meta.env.VITE_API_PENGELOAAN_KONTEN;

  useEffect(() => {
    const fetchDetailKunjungan = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!apiUrl) {
          throw new Error("URL API tidak dikonfigurasi");
        }

        if (!id) {
          navigate("/kunjungan");
          return;
        }

        const response = await fetch(`${apiUrl}/API/kunjungan/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Data kunjungan tidak ditemukan");
          }
          throw new Error("Gagal mengambil data kunjungan");
        }

        const data = await response.json();
        setKunjungan(data?.kunjungan || null);
      } catch (err) {
        console.error("Error fetching detail kunjungan:", err);
        setError(err.message || "Gagal memuat data kunjungan. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailKunjungan();
  }, [id, apiUrl, navigate]);

  useEffect(() => {
    if (kunjungan?.foto && kunjungan.foto.length > 0) {
      const orientations = {};
      kunjungan.foto.forEach((foto, index) => {
        const img = new Image();
        img.onload = () => {
          const isPortrait = img.height > img.width;
          orientations[index] = isPortrait ? 'portrait' : 'landscape';
          setImageOrientations({ ...orientations });
        };
        img.src = `${apiUrl}/images/kunjungan/${foto}`;
      });
    }
  }, [kunjungan, apiUrl]);

  const formatWaktu = (waktu) => {
    if (!waktu) return "";
    
    const date = new Date(waktu);
    const options = { year: "numeric", month: "long", day: "numeric" };
    
    return date.toLocaleDateString("id-ID", options);
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

  const pageTitle = kunjungan
    ? `${kunjungan.judul || "Kunjungan"} - Perpustakaan Medayu Agung Surabaya`
    : "Detail Kunjungan - Perpustakaan Medayu Agung Surabaya";

  const pageDescription = kunjungan?.deskripsi
    ? (() => {
        const plain = getPlainText(kunjungan.deskripsi);
        return plain.length > 160 ? `${plain.slice(0, 160).trim()}...` : plain;
      })()
    : "Detail kunjungan ke Perpustakaan Medayu Agung Surabaya. Informasi kegiatan kunjungan, tanggal, dan dokumentasi foto.";

  const ogImage =
    kunjungan?.foto?.length > 0
      ? `${apiUrl}/images/kunjungan/${kunjungan.foto[0]}`
      : kunjungan?.cover
        ? `${apiUrl}/images/kunjungan/${kunjungan.cover}`
        : DefaultOgImage;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content={`${kunjungan?.judul || "kunjungan"}, kunjungan perpustakaan medayu agung, kunjungan perpustakaan surabaya, kunjungan instansi, kunjungan universitas, dokumentasi kunjungan`}
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={currentUrl} />
        <meta
          property="og:title"
          content={kunjungan?.judul || "Kunjungan Perpustakaan Medayu Agung Surabaya"}
        />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content={kunjungan?.judul || "Kunjungan Perpustakaan Medayu Agung Surabaya"}
        />
        <meta property="og:locale" content="id_ID" />
        <meta
          property="og:site_name"
          content="Perpustakaan Medayu Agung Surabaya"
        />
        {kunjungan?.waktu_kunjungan && (
          <meta
            property="article:published_time"
            content={new Date(kunjungan.waktu_kunjungan).toISOString()}
          />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={currentUrl} />
        <meta
          name="twitter:title"
          content={kunjungan?.judul || "Kunjungan Perpustakaan Medayu Agung Surabaya"}
        />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
        <meta
          name="twitter:image:alt"
          content={kunjungan?.judul || "Kunjungan Perpustakaan Medayu Agung Surabaya"}
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Perpustakaan Medayu Agung Surabaya" />
        <link rel="canonical" href={currentUrl} />
      </Helmet>

      <main className="detail-kunjungan-main">
        <div className="detail-kunjungan-header">
          <button className="kunjungan-detail-back-button" onClick={() => navigate("/kunjungan")}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Kembali</span>
          </button>
        </div>

      <section className="detail-kunjungan-section">
        {loading && (
          <div className="detail-skeleton-container">
            <div className="detail-skeleton-header">
              <div className="detail-skeleton-title"></div>
              <div className="detail-skeleton-waktu"></div>
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
              {error || "Data kunjungan tidak ditemukan"}
            </p>
            <button className="retry-button" onClick={() => navigate("/kunjungan")}>
              Kembali ke Daftar Kunjungan
            </button>
          </div>
        )}

        {!loading && !error && kunjungan && (
          <>
            <div className="detail-header">
              <h1 className="detail-title">{kunjungan.judul || "Tanpa Judul"}</h1>
              {kunjungan.waktu_kunjungan && (
                <span className="detail-waktu">
                  {formatWaktu(kunjungan.waktu_kunjungan)}
                </span>
              )}
            </div>

            <div className="detail-card">
              {kunjungan.deskripsi && (
                <div className="kunjungan-description">
                  <h2 className="kunjungan-section-title">Deskripsi</h2>
                  <div 
                    className="kunjungan-description-text"
                    dangerouslySetInnerHTML={{ 
                      __html: kunjungan.deskripsi.replace(/\n/g, "<br />") 
                    }}
                  />
                </div>
              )}

              {kunjungan.foto && kunjungan.foto.length > 0 && (
                <div className="kunjungan-photos-section">
                  <h2 className="kunjungan-section-title">Foto Kunjungan</h2>
                  <div className="kunjungan-photos-grid">
                    {kunjungan.foto.map((foto, index) => {
                      const orientation = imageOrientations[index] || 'landscape';
                      return (
                        <div 
                          key={index} 
                          className={`kunjungan-image-container ${orientation}`}
                        >
                          <img
                            src={`${apiUrl}/images/kunjungan/${foto}`}
                            alt={`${kunjungan.judul || "Gambar kunjungan"} ${index + 1}`}
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

export default DetailKunjungan;
