import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./DetailPengumuman.css";

function DetailPengumuman() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [pengumuman, setPengumuman] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_PENGELOAAN_KONTEN;

  useEffect(() => {
    const fetchDetailPengumuman = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!apiUrl) {
          throw new Error("URL API tidak dikonfigurasi");
        }

        if (!id) {
          navigate("/pengumuman");
          return;
        }

        const response = await fetch(`${apiUrl}/API/pengumuman/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Pengumuman tidak ditemukan");
          }
          throw new Error("Gagal mengambil data pengumuman");
        }

        const data = await response.json();
        setPengumuman(data?.pengumuman || null);
      } catch (err) {
        console.error("Error fetching detail pengumuman:", err);
        setError(err.message || "Gagal memuat data pengumuman. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailPengumuman();
  }, [id, apiUrl, navigate]);

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "";
    
    const date = new Date(tanggal);
    const dateOptions = { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    };
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit"
    };
    
    const tanggalFormatted = date.toLocaleDateString("id-ID", dateOptions);
    const waktuFormatted = date.toLocaleTimeString("id-ID", timeOptions);
    
    return `${tanggalFormatted}, ${waktuFormatted}`;
  };

  const pageTitle = pengumuman 
    ? `${pengumuman.judul || "Pengumuman"} - Perpustakaan Medayu Agung Surabaya`
    : "Pengumuman - Perpustakaan Medayu Agung Surabaya";
  
  const getPlainText = (html) => {
    if (!html) return "";
    const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    return text.trim();
  };
  
  const pageDescription = pengumuman?.isi
    ? (() => {
        const plainText = getPlainText(pengumuman.isi);
        return plainText.length > 160 ? plainText.substring(0, 160).trim() + '...' : plainText;
      })()
    : "Baca pengumuman lengkap dari Perpustakaan Medayu Agung Surabaya. Informasi terbaru tentang kegiatan, acara, dan berita penting dari perpustakaan.";
  
  const ogImage = pengumuman?.foto
    ? `${apiUrl}/images/pengumuman/${pengumuman.foto}`
    : `${window.location.origin}/src/assets/logo_medayuagung_warna.webp`;
  
  const currentUrl = `${window.location.origin}${location.pathname}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={pageDescription}
        />
        <meta
          name="keywords"
          content={`${pengumuman?.judul || "pengumuman"}, perpustakaan medayu agung, perpustakaan surabaya, berita perpustakaan, informasi perpustakaan`}
        />
        
        <meta property="og:type" content="article" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={pengumuman?.judul || "Pengumuman Perpustakaan Medayu Agung Surabaya"} />
        <meta
          property="og:description"
          content={pageDescription}
        />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={pengumuman?.judul || "Pengumuman Perpustakaan Medayu Agung Surabaya"} />
        <meta property="og:locale" content="id_ID" />
        <meta property="og:site_name" content="Perpustakaan Medayu Agung Surabaya" />
        {pengumuman?.dibuat_pada && (
          <meta property="article:published_time" content={new Date(pengumuman.dibuat_pada).toISOString()} />
        )}
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={currentUrl} />
        <meta name="twitter:title" content={pengumuman?.judul || "Pengumuman Perpustakaan Medayu Agung Surabaya"} />
        <meta
          name="twitter:description"
          content={pageDescription}
        />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={pengumuman?.judul || "Pengumuman Perpustakaan Medayu Agung Surabaya"} />
        
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Perpustakaan Medayu Agung Surabaya" />
        <link rel="canonical" href={currentUrl} />
      </Helmet>
      
      <main className="detail-pengumuman-main">
      <div className="detail-pengumuman-header">
        <button className="pengumuman-detail-back-button" onClick={() => navigate("/pengumuman")}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Kembali</span>
        </button>
      </div>

      <section className="detail-pengumuman-section">
        {loading && (
          <div className="detail-skeleton-container">
            <div className="detail-skeleton-header">
              <div className="detail-skeleton-title"></div>
              <div className="detail-skeleton-date"></div>
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
              {error || "Pengumuman tidak ditemukan"}
            </p>
            <button className="retry-button" onClick={() => navigate("/pengumuman")}>
              Kembali ke Daftar Pengumuman
            </button>
          </div>
        )}

        {!loading && !error && pengumuman && (
          <>
            <div className="detail-header">
              <h1 className="detail-title">{pengumuman.judul || "Tanpa Judul"}</h1>
              {pengumuman.dibuat_pada && (
                <span className="detail-date">
                  Dibuat: {formatTanggal(pengumuman.dibuat_pada)}
                </span>
              )}
            </div>

            <div className="detail-card-announcement">
              {pengumuman.foto && (
                <div className="announcement-image-container">
                  <img
                    src={`${apiUrl}/images/pengumuman/${pengumuman.foto}`}
                    alt={pengumuman.judul || "Gambar pengumuman"}
                    loading="lazy"
                  />
                </div>
              )}

              {pengumuman.isi && (
                <div className="announcement-description">
                  <div 
                    className="announcement-content-text"
                    dangerouslySetInnerHTML={{ 
                      __html: pengumuman.isi.replace(/\n/g, "<br />") 
                    }}
                  />
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

export default DetailPengumuman;
