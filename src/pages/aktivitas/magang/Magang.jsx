import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Magang.css";

function Magang() {
  const [magang, setMagang] = useState([]);
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
    const fetchMagang = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!apiUrl) {
          throw new Error("URL API tidak dikonfigurasi");
        }

        const response = await fetch(`${apiUrl}/API/magang?page=${currentPage}`);

        if (!response.ok) {
          throw new Error("Gagal mengambil data magang");
        }

        const data = await response.json();
        setMagang(data?.magang || []);
        if (data?.pagination) {
          setTotalPages(data.pagination.totalHalaman);
        }
      } catch (err) {
        console.error("Error fetching magang:", err);
        setError("Gagal memuat data magang. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    if (!hasSearched) {
      fetchMagang();
    }
  }, [apiUrl, currentPage, hasSearched]);

  const formatPeriode = (mulai, berakhir) => {
    if (!mulai || !berakhir) return "";

    const dateMulai = new Date(mulai);
    const dateBerakhir = new Date(berakhir);
    const options = { year: "numeric", month: "long", day: "numeric" };

    return `${dateMulai.toLocaleDateString("id-ID", options)} - ${dateBerakhir.toLocaleDateString("id-ID", options)}`;
  };

  const handleCardClick = (id) => {
    navigate(`/detail-magang/${id}`);
  };

  const handleClearSearch = async () => {
    setSearchKeyword("");
    setHasSearched(false);
    setCurrentPage(1);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/API/magang?page=1`);
      if (!response.ok) {
        throw new Error("Gagal mengambil data magang");
      }

      const data = await response.json();
      setMagang(data?.magang || []);
      if (data?.pagination) {
        setTotalPages(data.pagination.totalHalaman);
      }
    } catch (err) {
      console.error("Error fetching magang:", err);
      setError("Gagal memuat data magang. Silakan coba lagi nanti.");
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
      const response = await fetch(`${apiUrl}/API/magang/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword }),
      });

      if (response.ok) {
        const data = await response.json();
        setMagang(data?.magang || []);
        setTotalPages(1);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setMagang([]);
        setError(errorData.message || "Gagal melakukan pencarian");
      }
    } catch (err) {
      console.error("Error searching magang:", err);
      setMagang([]);
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
    <main className="magang-main">
      <div className="magang-header">
        <h1 className="magang-title">Program Magang</h1>
      </div>

      <section className="magang-section">
        <div className="magang-container">
          <div className="magang-description-wrapper">
            <p className="magang-subtitle">
              Program magang di Perpustakaan Medayu Agung memberikan kesempatan berharga bagi mahasiswa dan pemuda untuk terlibat aktif dalam pelestarian koleksi sejarah dan budaya yang kaya. Melalui program ini, peserta akan memperoleh pengalaman langsung dalam pengelolaan koleksi perpustakaan, mulai dari proses pengkatalogan, preservasi dokumen sejarah, hingga pelayanan kepada pengunjung. Bergabunglah dengan kami dan jadilah bagian dari upaya menjaga warisan budaya untuk generasi mendatang.
            </p>
          </div>

          <div className="magang-search-card">
            <form className="magang-search-form" onSubmit={handleSearch}>
              <div className="magang-search-wrapper">
                <span className="material-symbols-rounded search-icon">search</span>
                <input
                  type="text"
                  placeholder="Cari program magang..."
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
            <div className="magang-state">
              <div className="magang-skeleton-grid">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="magang-skeleton-card">
                    <div className="magang-skeleton-image"></div>
                    <div className="magang-skeleton-info"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && !loading && !searchLoading && (
            <div className="magang-state magang-state-error">
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
              {magang.length === 0 ? (
                <div className="magang-state">
                  <p>{hasSearched ? "Program magang yang Anda cari tidak ditemukan." : "Belum ada kegiatan magang tersedia."}</p>
                </div>
              ) : (
                <div className="magang-grid">
                  {magang.map((item) => (
                    <div
                      key={item.id}
                      className="magang-card"
                      onClick={() => handleCardClick(item.id)}
                    >
                      {item.cover && (
                        <div className="magang-card-image">
                          <img
                            src={`${apiUrl}/images/magang/${item.cover}`}
                            alt={item.judul || "Gambar program magang"}
                            loading="lazy"
                            width="3240"
                            height="1272"
                          />
                        </div>
                      )}
                      <div className="magang-card-info">
                        <div className="magang-card-title">{item.judul || "Tanpa Judul"}</div>
                        {item.periode_mulai && item.periode_berakhir && (
                          <div className="magang-card-period">
                            {formatPeriode(item.periode_mulai, item.periode_berakhir)}
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
            <div className="magang-state">
              <div className="loading-state">
                <span className="material-symbols-rounded">hourglass_empty</span>
                <p>Memuat hasil pencarian...</p>
              </div>
            </div>
          )}

          {!loading && !error && !searchLoading && !hasSearched && magang.length > 0 && (
            <div className="magang-pagination">
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

export default Magang;
