import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./TagArtikel.css";

const TagArtikel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [tagName, setTagName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BLOG || import.meta.env.VITE_API_PENGELOAAN_KONTEN;
        const response = await fetch(`${apiUrl}/API/tag/${id}`);
        if (!response.ok) {
          throw new Error("Gagal mengambil data artikel");
        }

        const data = await response.json();
        const articlesData = data?.data || [];
        
        if (data?.tag) {
          setTagName(data.tag.nama_tag);
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
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  return (
    <main className="blog-main">
      <section className="blog-section">
        <div className="blog-header">
          <button className="blog-detail-back-button" onClick={() => navigate("/blog")}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Kembali</span>
          </button>
          <h1 className="blog-title">
            <Link to="/blog">Tag</Link>
            <span style={{ margin: "0 10px", color: "#64748b" }}>&gt;</span>
            <span>{tagName || ""}</span>
          </h1>
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

        {error && !loading && (
          <div className="blog-state blog-state-error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {articles.length === 0 ? (
              <div className="blog-state">
                <p>Belum ada artikel dengan tag ini.</p>
              </div>
            ) : (
              <div className="blog-grid">
                {articles.map((article) => (
                  <article className="blog-card" key={article.id}>
                    <div className="blog-card-image">
                      {article.foto_cover && (
                        <img
                          src={`${import.meta.env.VITE_API_BLOG || import.meta.env.VITE_API_PENGELOAAN_KONTEN}${article.foto_cover}`}
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
      </section>
    </main>
  );
};

export default TagArtikel;