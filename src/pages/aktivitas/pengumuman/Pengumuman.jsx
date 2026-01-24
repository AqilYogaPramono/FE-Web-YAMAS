import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./Pengumuman.css";

function Pengumuman() {
  const [pengumuman, setPengumuman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_PENGELOAAN_KONTEN;

  useEffect(() => {
    const fetchPengumuman = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!apiUrl) {
          throw new Error("URL API tidak dikonfigurasi");
        }

        const response = await fetch(`${apiUrl}/API/pengumuman?page=${currentPage}`);
        
        if (!response.ok) {
          throw new Error("Gagal mengambil data pengumuman");
        }

        const data = await response.json();
        setPengumuman(data?.pengumuman || []);
        if (data?.pagination) {
          setTotalPages(data.pagination.totalHalaman);
        }
      } catch (err) {
        console.error("Error fetching pengumuman:", err);
        setError("Gagal memuat data pengumuman. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    if (!hasSearched) {
      fetchPengumuman();
    }
  }, [apiUrl, hasSearched, currentPage]);

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

  const handleCardClick = (id) => {
    navigate(`/detail-pengumuman/${id}`);
  };

  const handleClearSearch = async () => {
    setSearchKeyword("");
    setHasSearched(false);
    setCurrentPage(1);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/API/pengumuman?page=1`);
      
      if (!response.ok) {
        throw new Error("Gagal mengambil data pengumuman");
      }

      const data = await response.json();
      setPengumuman(data?.pengumuman || []);
      if (data?.pagination) {
        setTotalPages(data.pagination.totalHalaman);
      }
    } catch (err) {
      console.error("Error fetching pengumuman:", err);
      setError("Gagal memuat data pengumuman. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const keyword = searchKeyword.trim();
    if (!keyword) return;

    setSearchLoading(true);
    setHasSearched(true);
    setCurrentPage(1);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/API/pengumuman/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword }),
      });

      if (response.ok) {
        const data = await response.json();
        setPengumuman(data?.pengumuman || []);
        setTotalPages(1);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setPengumuman([]);
        setError(errorData.message || "Gagal melakukan pencarian");
      }
    } catch (err) {
      console.error("Error searching pengumuman:", err);
      setPengumuman([]);
      setError("Terjadi kesalahan saat melakukan pencarian");
    } finally {
      setSearchLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const ogImage = pengumuman.length > 0 && pengumuman[0]?.foto
    ? `${apiUrl}/images/pengumuman/${pengumuman[0].foto}`
    : `${window.location.origin}/src/assets/logo_medayuagung_warna.webp`;
  
  const currentUrl = `${window.location.origin}${location.pathname}`;

  return (
    <>
      <Helmet>
        <title>Pengumuman Perpustakaan Medayu Agung Surabaya</title>
        <meta
          name="description"
          content="Halaman pengumuman resmi Perpustakaan Medayu Agung Surabaya. Dapatkan informasi terbaru tentang kegiatan, acara, dan berita penting dari perpustakaan."
        />
        <meta
          name="keywords"
          content="pengumuman perpustakaan medayu agung, pengumuman perpustakaan surabaya, berita perpustakaan, informasi perpustakaan, kegiatan perpustakaan, acara perpustakaan"
        />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content="Pengumuman Perpustakaan Medayu Agung Surabaya" />
        <meta
          property="og:description"
          content="Halaman pengumuman resmi Perpustakaan Medayu Agung Surabaya. Dapatkan informasi terbaru tentang kegiatan, acara, dan berita penting dari perpustakaan."
        />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Pengumuman Perpustakaan Medayu Agung Surabaya" />
        <meta property="og:locale" content="id_ID" />
        <meta property="og:site_name" content="Perpustakaan Medayu Agung Surabaya" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={currentUrl} />
        <meta name="twitter:title" content="Pengumuman Perpustakaan Medayu Agung Surabaya" />
        <meta
          name="twitter:description"
          content="Halaman pengumuman resmi Perpustakaan Medayu Agung Surabaya. Dapatkan informasi terbaru tentang kegiatan, acara, dan berita penting dari perpustakaan."
        />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content="Pengumuman Perpustakaan Medayu Agung Surabaya" />
        
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Perpustakaan Medayu Agung Surabaya" />
        <link rel="canonical" href={currentUrl} />
      </Helmet>
      
      <main className="pengumuman-main">
        <div className="pengumuman-header">
          <h1 className="pengumuman-title">Pengumuman</h1>
        </div>

      <section className="pengumuman-section">
        <div className="pengumuman-container">
          <div className="pengumuman-search-card">
            <form className="pengumuman-search-form" onSubmit={handleSearch}>
              <div className="pengumuman-search-wrapper">
                <span className="material-symbols-rounded search-icon">search</span>
                <input
                  type="text"
                  placeholder="Cari pengumuman..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                {searchKeyword && (
                  <span
                    className="material-symbols-rounded clear-search"
                    onClick={handleClearSearch}
                  >
                    close
                  </span>
                )}
                <button type="submit" disabled={searchLoading}>
                  {searchLoading ? "Mencari..." : "Cari"}
                </button>
              </div>
            </form>
          </div>

          {loading && (
            <div className="pengumuman-state">
              <div className="pengumuman-skeleton-list">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="pengumuman-skeleton-card">
                    <div className="pengumuman-skeleton-content">
                      <div className="pengumuman-skeleton-title"></div>
                      <div className="pengumuman-skeleton-date"></div>
                      <div className="pengumuman-skeleton-text"></div>
                      <div className="pengumuman-skeleton-text"></div>
                    </div>
                    <div className="pengumuman-skeleton-thumbnail"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && !loading && !searchLoading && (
            <div className="pengumuman-state pengumuman-state-error">
              <p>{error}</p>
              {hasSearched ? (
                <button 
                  className="retry-button" 
                  onClick={handleClearSearch}
                >
                  Hapus Pencarian
                </button>
              ) : (
                <button 
                  className="retry-button" 
                  onClick={() => window.location.reload()}
                >
                  Coba Lagi
                </button>
              )}
            </div>
          )}

          {!loading && !error && !searchLoading && (
            <>
              {pengumuman.length === 0 ? (
                <div className="pengumuman-state">
                  <p>{hasSearched ? "Pengumuman yang Anda cari tidak ditemukan." : "Belum ada pengumuman tersedia."}</p>
                </div>
              ) : (
                <div className="announcement-card-list">
                  {pengumuman.map((item) => (
                    <div
                      key={item.id}
                      className={`announcement-card ${item.foto ? "with-image" : "no-image"}`}
                      onClick={() => handleCardClick(item.id)}
                    >
                      <div className="announcement-content">
                        <div className="announcement-header">
                          <h2 className="announcement-title">{item.judul || "Tanpa Judul"}</h2>
                          {item.dibuat_pada && (
                            <span className="announcement-date">
                              Dibuat: {formatTanggal(item.dibuat_pada)}
                            </span>
                          )}
                        </div>
                        {item.isi && (
                          <p className="announcement-excerpt">
                            {item.isi}...
                          </p>
                        )}
                      </div>
                      {item.foto && (
                        <div className="announcement-thumbnail">
                          <img
                            src={`${apiUrl}/images/pengumuman/${item.foto}`}
                            alt={item.judul}
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {searchLoading && (
            <div className="pengumuman-state">
              <div className="loading-state">
                <span className="material-symbols-rounded">hourglass_empty</span>
                <p>Memuat hasil pencarian...</p>
              </div>
            </div>
          )}

          {!loading && !error && !searchLoading && !hasSearched && pengumuman.length > 0 && (
            <div className="pengumuman-pagination">
              <div className="pagination-info">
                Halaman {currentPage} dari {totalPages}
              </div>
              <div className="pagination-controls">
                <button
                  className="pagination-nav-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Halaman sebelumnya"
                >
                  «
                </button>
                <button
                  className="pagination-page-button active"
                  disabled
                >
                  {currentPage}
                </button>
                <button
                  className="pagination-nav-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Halaman berikutnya"
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <div style={{ height: "50px" }}></div>
    </main>
    </>
  );
}

export default Pengumuman;
