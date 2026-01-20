import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Kunjungan.css";

function Kunjungan() {
  const [kunjungan, setKunjungan] = useState([]);
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
    const fetchKunjungan = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!apiUrl) {
          throw new Error("URL API tidak dikonfigurasi");
        }

        const response = await fetch(`${apiUrl}/API/kunjungan?page=${currentPage}`);

        if (!response.ok) {
          throw new Error("Gagal mengambil data kunjungan");
        }

        const data = await response.json();
        setKunjungan(data?.kunjungan || []);
        if (data?.pagination) {
          setTotalPages(data.pagination.totalHalaman);
        }
      } catch (err) {
        console.error("Error fetching kunjungan:", err);
        setError("Gagal memuat data kunjungan. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    if (!hasSearched) {
      fetchKunjungan();
    }
  }, [apiUrl, currentPage, hasSearched]);

  const formatWaktu = (waktu) => {
    if (!waktu) return "";

    const date = new Date(waktu);
    const options = { year: "numeric", month: "long", day: "numeric" };

    return date.toLocaleDateString("id-ID", options);
  };

  const handleCardClick = (id) => {
    navigate(`/detail-kunjungan/${id}`);
  };

  const handleClearSearch = async () => {
    setSearchKeyword("");
    setHasSearched(false);
    setCurrentPage(1);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/API/kunjungan?page=1`);
      if (!response.ok) {
        throw new Error("Gagal mengambil data kunjungan");
      }

      const data = await response.json();
      setKunjungan(data?.kunjungan || []);
      if (data?.pagination) {
        setTotalPages(data.pagination.totalHalaman);
      }
    } catch (err) {
      console.error("Error fetching kunjungan:", err);
      setError("Gagal memuat data kunjungan. Silakan coba lagi nanti.");
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
      const response = await fetch(`${apiUrl}/API/kunjungan/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword }),
      });

      if (response.ok) {
        const data = await response.json();
        setKunjungan(data?.kunjungan || []);
        setTotalPages(1);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setKunjungan([]);
        setError(errorData.message || "Gagal melakukan pencarian");
      }
    } catch (err) {
      console.error("Error searching kunjungan:", err);
      setKunjungan([]);
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
    <main className="kunjungan-main">
      <div className="kunjungan-header">
        <h1 className="kunjungan-title">Kunjungan</h1>
      </div>

      <section className="kunjungan-section">
        <div className="kunjungan-container">
          <div className="kunjungan-description-wrapper">
            <p className="kunjungan-subtitle">
              Perpustakaan Medayu Agung menerima berbagai kunjungan dari berbagai instansi, lembaga pendidikan, dan organisasi. Kunjungan ini memberikan kesempatan untuk mengenal lebih dekat koleksi sejarah dan budaya yang dimiliki perpustakaan.
            </p>
          </div>

          <div className="kunjungan-search-card">
            <form className="kunjungan-search-form" onSubmit={handleSearch}>
              <div className="kunjungan-search-wrapper">
                <span className="material-symbols-rounded search-icon">search</span>
                <input
                  type="text"
                  placeholder="Cari kunjungan..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                {searchKeyword && (
                  <span className="material-symbols-rounded clear-search" onClick={handleClearSearch}>
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
            <div className="kunjungan-state">
              <div className="kunjungan-skeleton-grid">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="kunjungan-skeleton-card">
                    <div className="kunjungan-skeleton-image"></div>
                    <div className="kunjungan-skeleton-info"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && !loading && !searchLoading && (
            <div className="kunjungan-state kunjungan-state-error">
              <p>{error}</p>
              {hasSearched ? (
                <button className="retry-button" onClick={handleClearSearch}>
                  Hapus Pencarian
                </button>
              ) : (
                <button className="retry-button" onClick={() => window.location.reload()}>
                  Coba Lagi
                </button>
              )}
            </div>
          )}

          {!loading && !error && !searchLoading && (
            <>
              {kunjungan.length === 0 ? (
                <div className="kunjungan-state">
                  <p>{hasSearched ? "Kunjungan yang Anda cari tidak ditemukan." : "Belum ada kunjungan tersedia."}</p>
                </div>
              ) : (
                <div className="kunjungan-grid">
                  {kunjungan.map((item) => (
                    <div
                      key={item.id}
                      className="kunjungan-card"
                      onClick={() => handleCardClick(item.id)}
                    >
                      {item.cover && (
                        <div className="kunjungan-card-image">
                          <img
                            src={`${apiUrl}/images/kunjungan/${item.cover}`}
                            alt={item.judul || "Gambar kunjungan"}
                            loading="lazy"
                            width="3240"
                            height="1272"
                          />
                        </div>
                      )}
                      <div className="kunjungan-card-info">
                        <div className="kunjungan-card-title">{item.judul || "Tanpa Judul"}</div>
                        {item.waktu_kunjungan && (
                          <div className="kunjungan-card-waktu">
                            {formatWaktu(item.waktu_kunjungan)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {searchLoading && (
            <div className="kunjungan-state">
              <div className="loading-state">
                <span className="material-symbols-rounded">hourglass_empty</span>
                <p>Memuat hasil pencarian...</p>
              </div>
            </div>
          )}

          {!loading && !error && !searchLoading && !hasSearched && kunjungan.length > 0 && (
            <div className="kunjungan-pagination">
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
                <button className="pagination-page-button active" disabled>
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

export default Kunjungan;
