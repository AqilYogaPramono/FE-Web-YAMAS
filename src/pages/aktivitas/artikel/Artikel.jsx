import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./Artikel.css";
import DefaultOgImage from "../../../assets/logo_medayuagung_warna.webp";

const ArtikelPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_BLOG;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!apiUrl) {
          throw new Error("URL API tidak dikonfigurasi");
        }

        const response = await fetch(`${apiUrl}/API/blog?page=${currentPage}`);
        
        if (!response.ok) {
          throw new Error("Gagal mengambil data blog");
        }

        const data = await response.json();
        setArticles(data?.blog || []);
        if (data?.pagination) {
          setTotalPages(data.pagination.totalHalaman);
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Gagal memuat data blog. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    if (!hasSearched) {
      fetchArticles();
    }
  }, [apiUrl, hasSearched, currentPage]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  const handleClearSearch = async () => {
    setSearchKeyword("");
    setHasSearched(false);
    setCurrentPage(1);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/API/blog?page=1`);
      
      if (!response.ok) {
        throw new Error("Gagal mengambil data blog");
      }

      const data = await response.json();
      setArticles(data?.blog || []);
      if (data?.pagination) {
        setTotalPages(data.pagination.totalHalaman);
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError("Gagal memuat data blog. Silakan coba lagi nanti.");
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
      const response = await fetch(`${apiUrl}/API/blog/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword }),
      });

      if (response.ok) {
        const data = await response.json();
        setArticles(data?.blog || []);
        setTotalPages(1);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setArticles([]);
        setError(errorData.message || "Gagal melakukan pencarian");
      }
    } catch (err) {
      console.error("Error searching blog:", err);
      setArticles([]);
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

  const currentUrl = `${window.location.origin}${location.pathname}`;
  const ogImage =
    articles.length > 0 && articles[0]?.foto_cover
      ? `${apiUrl}${articles[0].foto_cover}`
      : DefaultOgImage;

  return (
    <>
      <Helmet>
        <title>Blog Perpustakaan Medayu Agung Surabaya</title>
        <meta
          name="description"
          content="Baca blog terbaru dari Perpustakaan Medayu Agung Surabaya. Informasi tentang sejarah, budaya, koleksi perpustakaan, dan berbagai topik menarik lainnya."
        />
        <meta
          name="keywords"
          content="blog perpustakaan medayu agung, perpustakaan surabaya, blog sejarah, blog budaya, blog sejarah indonesia, blog perpustakaan"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta
          property="og:title"
          content="Blog Perpustakaan Medayu Agung Surabaya"
        />
        <meta
          property="og:description"
          content="Baca blog terbaru dari Perpustakaan Medayu Agung Surabaya. Informasi tentang sejarah, budaya, koleksi perpustakaan, dan berbagai topik menarik lainnya."
        />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Blog Perpustakaan Medayu Agung Surabaya"
        />
        <meta property="og:locale" content="id_ID" />
        <meta
          property="og:site_name"
          content="Perpustakaan Medayu Agung Surabaya"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={currentUrl} />
        <meta
          name="twitter:title"
          content="Blog Perpustakaan Medayu Agung Surabaya"
        />
        <meta
          name="twitter:description"
          content="Baca dan blog terbaru dari Perpustakaan Medayu Agung Surabaya. Informasi tentang sejarah, budaya, koleksi perpustakaan, dan berbagai topik menarik lainnya."
        />
        <meta name="twitter:image" content={ogImage} />
        <meta
          name="twitter:image:alt"
          content="Blog Perpustakaan Medayu Agung Surabaya"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Perpustakaan Medayu Agung Surabaya" />
        <link rel="canonical" href={currentUrl} />
      </Helmet>

      <main className="blog-main">
      <div className="blog-header">
        <h1 className="blog-title">Blog</h1>
      </div>

      <section className="blog-section">
        <div className="blog-container">
          <div className="blog-search-card">
            <form className="blog-search-form" onSubmit={handleSearch}>
              <div className="blog-search-wrapper">
                <span className="material-symbols-rounded search-icon">search</span>
                <input
                  type="text"
                  placeholder="Cari blog..."
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
            <div className="blog-state">
              <div className="blog-skeleton-grid">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="blog-skeleton-card" />
                ))}
              </div>
            </div>
          )}

          {error && !loading && !searchLoading && (
            <div className="blog-state blog-state-error">
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
              {articles.length === 0 ? (
                <div className="blog-state">
                  <p>{hasSearched ? "Blog yang Anda cari tidak ditemukan." : "Belum ada blog tersedia."}</p>
                </div>
              ) : (
                <div className="blog-grid">
                  {articles.map((article) => (
                    <article className="blog-card" key={article.id}>
                      <div className="blog-card-image">
                        {article.foto_cover && (
                          <img
                            src={`${apiUrl}${article.foto_cover}`}
                            alt={article.judul}
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className="blog-card-body">
                        <div className="blog-card-meta">
                          <span className="blog-card-date">
                            {formatDate(article.dibuat_pada)}
                          </span>
                          {article.nama_pembuat && (
                            <span className="blog-card-author">
                              {article.nama_pembuat}
                            </span>
                          )}
                        </div>
                        <h2 className="blog-card-title">{article.judul}</h2>
                        <p className="blog-card-desc">{article.ringkasan}</p>
                        <Link
                          to={`/blog/${article.tautan}`}
                          className="blog-card-link"
                        >
                          Baca Selengkapnya
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}

          {searchLoading && (
            <div className="blog-state">
              <div className="loading-state">
                <span className="material-symbols-rounded">hourglass_empty</span>
                <p>Memuat hasil pencarian...</p>
              </div>
            </div>
          )}

          {!loading && !error && !searchLoading && !hasSearched && articles.length > 0 && (
            <div className="blog-pagination">
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
};

export default ArtikelPage;
