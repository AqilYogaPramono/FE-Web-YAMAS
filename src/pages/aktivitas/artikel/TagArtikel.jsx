import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./TagArtikel.css";
import DefaultOgImage from "../../../assets/logo_medayuagung_warna.webp";

const TagArtikel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [tagName, setTagName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_BLOG;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, currentPage]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!apiUrl) {
          throw new Error("URL API tidak dikonfigurasi");
        }

        const response = await fetch(`${apiUrl}/API/tag/${id}?page=${currentPage}`);
        if (!response.ok) {
          throw new Error("Gagal mengambil data blog");
        }

        const data = await response.json();
        const articlesData = data?.data || [];
        
        if (data?.tag) {
          setTagName(data.tag.nama_tag);
        }

        if (data?.pagination) {
          setTotalPages(data.pagination.totalHalaman);
        }
        
        setArticles(articlesData);
      } catch (err) {
        console.error(err);
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticles();
    }
  }, [id, currentPage, apiUrl]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const currentUrl = `${window.location.origin}${location.pathname}`;
  const pageTitle = tagName
    ? `Tag ${tagName} - Blog Perpustakaan Medayu Agung Surabaya`
    : "Tag Blog - Blog Perpustakaan Medayu Agung Surabaya";
  const pageDescription = tagName
    ? `Baca blog dengan tag ${tagName} dari Perpustakaan Medayu Agung Surabaya. Koleksi blog tentang sejarah, budaya, dan informasi perpustakaan.`
    : "Baca blog berdasarkan tag dari Perpustakaan Medayu Agung Surabaya. Koleksi blog tentang sejarah, budaya, dan informasi perpustakaan.";
  const ogImage =
    articles.length > 0 && articles[0]?.foto_cover
      ? `${apiUrl}${articles[0].foto_cover}`
      : DefaultOgImage;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content={`${tagName || "tag"}, blog perpustakaan medayu agung, blog perpustakaan surabaya, blog tag, blog sejarah, blog budaya`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta
          property="og:title"
          content={pageTitle}
        />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content={pageTitle}
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
          content={pageTitle}
        />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
        <meta
          name="twitter:image:alt"
          content={pageTitle}
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Perpustakaan Medayu Agung Surabaya" />
        <link rel="canonical" href={currentUrl} />
      </Helmet>

      <main className="blog-tag-main">
      <div className="blog-detail-back-header">
        <button className="blog-detail-back-button" onClick={() => navigate("/blog")}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Kembali</span>
        </button>
      </div>

      <section className="blog-section">
        <div className="blog-container">
          <h1 className="blog-tag-title">
            <Link to="/blog">Tag</Link>
            <span className="blog-tag-sep">&gt;</span>
            <span>{tagName || ""}</span>
          </h1>

          {loading && (
            <div className="blog-state">
              <div className="blog-skeleton-grid">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="blog-skeleton-card" />
                ))}
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="blog-state blog-state-error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {articles.length === 0 ? (
                <div className="blog-state">
                  <p>Belum ada blog dengan tag ini.</p>
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
                          <span className="blog-card-author">
                            {article.nama_pembuat}
                          </span>
                        </div>
                        <h2 className="blog-card-title">{article.judul}</h2>
                        <p className="blog-card-desc">{article.ringkasan}</p>
                        <Link
                          to={`/blog/${article.tautan}`}
                          className="blog-card-link"
                          onClick={() => window.scrollTo(0, 0)}
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

          {!loading && !error && articles.length > 0 && (
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

export default TagArtikel;