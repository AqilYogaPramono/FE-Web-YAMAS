import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import "./DetailArtikel.css"; 

const DetailArtikel = () => {
  const { tautan } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tautan]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BLOG || import.meta.env.VITE_API_PENGELOAAN_KONTEN;
        const response = await fetch(`${apiUrl}/API/blog/${tautan}`);
        if (!response.ok) {
          throw new Error("Gagal mengambil data blog");
        }

        const data = await response.json();
        setBlog(data?.data || null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    if (tautan) {
      fetchBlog();
    }
  }, [tautan]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  if (loading) {
  return (
      <main className="blog-detail-main">
        <section className="blog-detail-section">
          <div className="blog-detail-skeleton">
            <div className="blog-detail-skeleton-header" />
            <div className="blog-detail-skeleton-image" />
            <div className="blog-detail-skeleton-content" />
            <div className="blog-detail-skeleton-content" />
            <div className="blog-detail-skeleton-content" />
          </div>
        </section>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="blog-detail-main">
        <section className="blog-detail-section">
          <div className="blog-detail-state blog-detail-state-error">
            <p>{error || "Blog tidak ditemukan"}</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="blog-detail-main">
      <section className="blog-detail-section">
        <button className="blog-detail-back-button" onClick={() => navigate("/blog")}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Kembali</span>
        </button>

        <article className="blog-detail-container">
          <div className="blog-detail-header">
            <h1 className="blog-detail-title">{blog.judul}</h1>

            {blog.ringkasan && (
              <div className="blog-detail-ringkasan">
                <p>{blog.ringkasan}</p>
              </div>
            )}

            <div className="blog-detail-meta">
              <span className="blog-detail-author">{blog.nama_pembuat}</span>
              <span className="blog-detail-separator">•</span>
              <span className="blog-detail-date">{formatDate(blog.dibuat_pada)}</span>
            </div>
          </div>

          {blog.foto_cover && (
            <div className="blog-detail-image">
              <img
                src={`${import.meta.env.VITE_API_BLOG || import.meta.env.VITE_API_PENGELOAAN_KONTEN}${blog.foto_cover}`}
                alt={blog.judul}
                loading="eager"
              />
            </div>
          )}

          <div className="blog-detail-content">
            <div
              className="blog-detail-isi"
              dangerouslySetInnerHTML={{
                __html: blog.isi?.replace(
                  /src="\/images\//g,
                  `src="${import.meta.env.VITE_API_BLOG || import.meta.env.VITE_API_PENGELOAAN_KONTEN}/images/`
                ) || ''
              }}
            />
          </div>

          <div className="blog-detail-footer">
            {blog.kategori && blog.kategori.length > 0 && (
              <div className="blog-detail-tags">
                <span className="blog-detail-tags-label">Kategori:</span>
                <div className="blog-detail-tags-list">
                  {blog.kategori.map((kat) => (
                    <Link
                      key={kat.id}
                      to={`/blog/kategori/${kat.id}`}
                      className="blog-detail-tag blog-detail-tag-link"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      {kat.nama_kategori}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {blog.tag && blog.tag.length > 0 && (
              <div className="blog-detail-tags">
                <span className="blog-detail-tags-label">Tag:</span>
                <div className="blog-detail-tags-list">
                  {blog.tag.map((tag) => (
                    <Link
                      key={tag.id}
                      to={`/blog/tag/${tag.id}`}
                      className="blog-detail-tag blog-detail-tag-link"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      {tag.nama_tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {blog.related && blog.related.length > 0 && (
          <section className="blog-detail-related">
            <h2 className="blog-detail-related-title">Blog Terkait</h2>
            <div className="blog-detail-related-grid">
              {blog.related.map((related) => (
                <Link
                  to={`/blog/${related.tautan}`}
                  className="blog-detail-related-card"
                  key={related.id}
                  onClick={() => window.scrollTo(0, 0)}
                >
                  {related.foto_cover && (
                    <div className="blog-detail-related-image">
                      <img
                        src={`${import.meta.env.VITE_API_BLOG || import.meta.env.VITE_API_PENGELOAAN_KONTEN}${related.foto_cover}`}
                        alt={related.judul}
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="blog-detail-related-body">
                    <h3 className="blog-detail-related-title-card">{related.judul}</h3>
                    <p className="blog-detail-related-date">
                      {formatDate(related.dibuat_pada)}
                    </p>
                  </div>
                </Link>
            ))}
          </div>
        </section>
        )}
      </section>
    </main>
  );
};

export default DetailArtikel;
