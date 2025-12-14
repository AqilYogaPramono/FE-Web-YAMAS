import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  return (
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
  );
}

export default Pengumuman;
