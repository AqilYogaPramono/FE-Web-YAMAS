import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./DetailArtikel.css";
import DefaultOgImage from "../../../assets/logo_medayuagung_warna.webp"; 

const DetailArtikel = () => {
  const { tautan } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tautan]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BLOG;
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

  const apiUrl = import.meta.env.VITE_API_BLOG;
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

  const pageTitle = blog
    ? `${blog.judul || "Blog"} - Perpustakaan Medayu Agung Surabaya`
    : "Detail Blog - Perpustakaan Medayu Agung Surabaya";

  const pageDescription = blog?.ringkasan
    ? blog.ringkasan.length > 160
      ? `${blog.ringkasan.substring(0, 160).trim()}...`
      : blog.ringkasan
    : blog?.isi
      ? (() => {
          const plain = getPlainText(blog.isi);
          return plain.length > 160 ? `${plain.slice(0, 160).trim()}...` : plain;
        })()
      : "Baca blog lengkap dari Perpustakaan Medayu Agung Surabaya. Informasi tentang sejarah, budaya, dan koleksi perpustakaan.";

  const ogImage = blog?.foto_cover
    ? `${apiUrl}${blog.foto_cover}`
    : DefaultOgImage;

  const backButton = (
    <button className="blog-detail-back-button" onClick={() => navigate("/blog")}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>Kembali</span>
    </button>
  );

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Memuat Blog - Perpustakaan Medayu Agung Surabaya</title>
        </Helmet>
        <main className="blog-detail-main">
        <div className="blog-detail-back-header">
          {backButton}
        </div>
        <section className="blog-detail-section">
          <div className="blog-detail-skeleton">
            <div className="blog-detail-skeleton-header" />
            <div className="blog-detail-skeleton-image" />
            <div className="blog-detail-skeleton-content" />
            <div className="blog-detail-skeleton-content" />
            <div className="blog-detail-skeleton-content" />
          </div>
        </section>

        <div style={{ height: "50px" }}></div>
      </main>
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Helmet>
          <title>Blog Tidak Ditemukan - Perpustakaan Medayu Agung Surabaya</title>
        </Helmet>
        <main className="blog-detail-main">
        <div className="blog-detail-back-header">
          {backButton}
        </div>
        <section className="blog-detail-section">
          <div className="blog-detail-state blog-detail-state-error">
            <p>{error || "Blog tidak ditemukan"}</p>
          </div>
        </section>

        <div style={{ height: "50px" }}></div>
      </main>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content={`${blog?.judul || "blog"}, perpustakaan medayu agung, blog perpustakaan surabaya, blog sejarah, blog budaya, ${blog?.kategori?.map(k => k.nama_kategori).join(", ") || ""}, ${blog?.tag?.map(t => t.nama_tag).join(", ") || ""}`}
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={currentUrl} />
        <meta
          property="og:title"
          content={blog?.judul || "Blog Perpustakaan Medayu Agung Surabaya"}
        />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content={blog?.judul || "Blog Perpustakaan Medayu Agung Surabaya"}
        />
        <meta property="og:locale" content="id_ID" />
        <meta
          property="og:site_name"
          content="Perpustakaan Medayu Agung Surabaya"
        />
        {blog?.dibuat_pada && (
          <meta
            property="article:published_time"
            content={new Date(blog.dibuat_pada).toISOString()}
          />
        )}
        {blog?.kategori && blog.kategori.length > 0 && (
          <meta
            property="article:section"
            content={blog.kategori.map(k => k.nama_kategori).join(", ")}
          />
        )}
        {blog?.tag && blog.tag.length > 0 && (
          <>
            {blog.tag.map((tag, index) => (
              <meta
                key={index}
                property="article:tag"
                content={tag.nama_tag}
              />
            ))}
          </>
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={currentUrl} />
        <meta
          name="twitter:title"
          content={blog?.judul || "Blog Perpustakaan Medayu Agung Surabaya"}
        />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
        <meta
          name="twitter:image:alt"
          content={blog?.judul || "Blog Perpustakaan Medayu Agung Surabaya"}
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content={blog?.nama_pembuat || "Perpustakaan Medayu Agung Surabaya"} />
        <link rel="canonical" href={currentUrl} />
      </Helmet>

      <main className="blog-detail-main">
      <div className="blog-detail-back-header">
        {backButton}
      </div>
      <section className="blog-detail-section">
        <article className="blog-detail-container">
          <div className="blog-detail-article-header">
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
                src={`${import.meta.env.VITE_API_BLOG}${blog.foto_cover}`}
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
                  `src="${apiUrl}/images/`
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
                        src={`${apiUrl}${related.foto_cover}`}
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

      <div style={{ height: "50px" }}></div>
    </main>
    </>
  );
};

export default DetailArtikel;
