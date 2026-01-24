import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './DetailBuku.css';
import DefaultOgImage from '../../../assets/logo_medayuagung_warna.webp';

function DetailBuku() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const apiUrl = import.meta.env.VITE_API_E_KATALOG;
    
    const [buku, setBuku] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        fetchDetailBuku();
    }, [id]);

    const fetchDetailBuku = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${apiUrl}/API/buku/detail/${id}`);
            
            if (response.ok) {
                const data = await response.json();
                setBuku(data?.buku || null);
            } else if (response.status === 404) {
                setError('Data buku tidak ditemukan');
            } else {
                setError('Gagal memuat data buku');
            }
        } catch (err) {
            console.error(err);
            setError('Terjadi kesalahan saat memuat data');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const getCoverImage = (fotoCover) => {
        if (fotoCover) {
            return `${apiUrl}/images/buku/${fotoCover}`;
        }
        return null;
    };

    const currentUrl = `${window.location.origin}${location.pathname}`;
    const pageTitle = buku
        ? `${buku.judul || "Buku"} - Perpustakaan Medayu Agung Surabaya`
        : "Detail Buku - Perpustakaan Medayu Agung Surabaya";
    
    const pageDescription = buku?.sinopsis
        ? buku.sinopsis.length > 160
            ? `${buku.sinopsis.substring(0, 160).trim()}...`
            : buku.sinopsis
        : buku?.judul
            ? `Detail buku ${buku.judul} dari koleksi Perpustakaan Medayu Agung Surabaya. ${buku.pengarang ? `Ditulis oleh ${buku.pengarang}.` : ""} ${buku.penerbit ? `Diterbitkan oleh ${buku.penerbit}.` : ""}`
            : "Detail buku dari koleksi Perpustakaan Medayu Agung Surabaya. Informasi lengkap tentang judul, pengarang, penerbit, dan ketersediaan buku.";

    const ogImage = buku?.foto_cover
        ? `${apiUrl}/images/buku/${buku.foto_cover}`
        : DefaultOgImage;

    if (loading) {
        return (
            <>
                <Helmet>
                    <title>Memuat Detail Buku - Perpustakaan Medayu Agung Surabaya</title>
                </Helmet>
                <main className="buku-detail-main">
                <section className="buku-detail-section">
                    <div className="buku-detail-skeleton">
                        <div className="buku-detail-skeleton-header" />
                        <div className="buku-detail-skeleton-image" />
                        <div className="buku-detail-skeleton-content" />
                        <div className="buku-detail-skeleton-content" />
                        <div className="buku-detail-skeleton-content" />
                    </div>
                </section>
            </main>
            </>
        );
    }

    if (error || !buku) {
        return (
            <>
                <Helmet>
                    <title>Buku Tidak Ditemukan - Perpustakaan Medayu Agung Surabaya</title>
                </Helmet>
                <main className="buku-detail-main">
                <section className="buku-detail-section">
                    <div className="buku-detail-state buku-detail-state-error">
                        <p>{error || 'Data buku tidak ditemukan'}</p>
                        <button className="buku-detail-back-button" onClick={handleBack}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Kembali</span>
                        </button>
                    </div>
                </section>
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
                    content={`${buku?.judul || "buku"}, ${buku?.pengarang || ""}, ${buku?.penerbit || ""}, ${buku?.nama_kategori || ""}, koleksi buku perpustakaan medayu agung, buku perpustakaan surabaya, katalog buku`}
                />
                <meta property="og:type" content="book" />
                <meta property="og:url" content={currentUrl} />
                <meta
                    property="og:title"
                    content={buku?.judul || "Detail Buku - Perpustakaan Medayu Agung Surabaya"}
                />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content={ogImage} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta
                    property="og:image:alt"
                    content={buku?.judul || "Detail Buku - Perpustakaan Medayu Agung Surabaya"}
                />
                <meta property="og:locale" content="id_ID" />
                <meta
                    property="og:site_name"
                    content="Perpustakaan Medayu Agung Surabaya"
                />
                {buku?.pengarang && (
                    <meta property="book:author" content={buku.pengarang} />
                )}
                {buku?.isbn_issn && (
                    <meta property="book:isbn" content={buku.isbn_issn} />
                )}
                {buku?.tahun_terbit && (
                    <meta property="book:release_date" content={buku.tahun_terbit.toString()} />
                )}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={currentUrl} />
                <meta
                    name="twitter:title"
                    content={buku?.judul || "Detail Buku - Perpustakaan Medayu Agung Surabaya"}
                />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="twitter:image" content={ogImage} />
                <meta
                    name="twitter:image:alt"
                    content={buku?.judul || "Detail Buku - Perpustakaan Medayu Agung Surabaya"}
                />
                <meta name="robots" content="index, follow" />
                <meta name="author" content="Perpustakaan Medayu Agung Surabaya" />
                <link rel="canonical" href={currentUrl} />
            </Helmet>

            <main className="buku-detail-main">
            <section className="buku-detail-section">
                <button className="buku-detail-back-button" onClick={handleBack}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Kembali</span>
                </button>

                <article className="buku-detail-container">
                    <div className="buku-detail-header">
                        <h1 className="buku-detail-title">{buku.judul || '-'}</h1>
                    </div>

                    <div className="buku-detail-content-wrapper">
                        <div className="buku-detail-cover-section">
                            {getCoverImage(buku.foto_cover) ? (
                                <div className="buku-detail-image">
                                    <img
                                        src={getCoverImage(buku.foto_cover)}
                                        alt={`Sampul ${buku.judul}`}
                                        loading="eager"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                    <div
                                        className="buku-detail-image-placeholder"
                                        style={{ display: getCoverImage(buku.foto_cover) ? 'none' : 'flex' }}
                                    >
                                        Tidak Ada Gambar
                                    </div>
                                </div>
                            ) : (
                                <div className="buku-detail-image">
                                    <div className="buku-detail-image-placeholder">
                                        Tidak Ada Gambar
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="buku-detail-info-section">
                            <table className="buku-detail-metadata-table">
                                <tbody>
                                    <tr>
                                        <td className="buku-detail-label">Pengarang</td>
                                        <td className="buku-detail-separator">:</td>
                                        <td className="buku-detail-value">{buku.pengarang || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="buku-detail-label">ISBN / ISSN</td>
                                        <td className="buku-detail-separator">:</td>
                                        <td className="buku-detail-value">{buku.isbn_issn || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="buku-detail-label">No. Klasifikasi</td>
                                        <td className="buku-detail-separator">:</td>
                                        <td className="buku-detail-value">{buku.no_klasifikasi || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="buku-detail-label">Bahasa</td>
                                        <td className="buku-detail-separator">:</td>
                                        <td className="buku-detail-value">{buku.nama_bahasa || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="buku-detail-label">Jumlah Halaman</td>
                                        <td className="buku-detail-separator">:</td>
                                        <td className="buku-detail-value">{buku.jumlah_halaman || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="buku-detail-label">Tahun Terbit</td>
                                        <td className="buku-detail-separator">:</td>
                                        <td className="buku-detail-value">{buku.tahun_terbit || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="buku-detail-label">Tempat Terbit</td>
                                        <td className="buku-detail-separator">:</td>
                                        <td className="buku-detail-value">{buku.tempat_terbit || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="buku-detail-label">Penerbit</td>
                                        <td className="buku-detail-separator">:</td>
                                        <td className="buku-detail-value">{buku.penerbit || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="buku-detail-label">Kategori</td>
                                        <td className="buku-detail-separator">:</td>
                                        <td className="buku-detail-value">{buku.nama_kategori || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="buku-detail-label">Lokasi</td>
                                        <td className="buku-detail-separator">:</td>
                                        <td className="buku-detail-value">{buku.lokasi || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="buku-detail-label">Ketersediaan</td>
                                        <td className="buku-detail-separator">:</td>
                                        <td
                                            className="buku-detail-value"
                                            style={{
                                                fontWeight: 700,
                                                color: buku.ketersediaan === 'Tersedia' ? '#28a745' : '#dc3545'
                                            }}
                                        >
                                            {buku.ketersediaan || '-'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            
                            {buku.sinopsis && (
                                <div className="buku-detail-sinopsis">
                                    <h3 className="buku-detail-sinopsis-title">Sinopsis</h3>
                                    <p className="buku-detail-sinopsis-text">{buku.sinopsis}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </article>
            </section>
        </main>
        </>
    );
}

export default DetailBuku;
