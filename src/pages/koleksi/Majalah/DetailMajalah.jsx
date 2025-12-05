import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailMajalah.css'; 

function DetailMajalah() {
    const { id } = useParams();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_E_KATALOG;
    
    const [majalah, setMajalah] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        fetchDetailMajalah();
    }, [id]);

    const fetchDetailMajalah = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${apiUrl}/API/majalah/detail/${id}`);
            
            if (response.ok) {
                const data = await response.json();
                setMajalah(data?.majalah || null);
            } else if (response.status === 404) {
                setError('Data majalah tidak ditemukan');
            } else {
                setError('Gagal memuat data majalah');
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
            return `${apiUrl}/images/majalah/${fotoCover}`;
        }
        return null;
    };

    if (loading) {
        return (
            <main className="majalah-detail-main">
                <section className="majalah-detail-section">
                    <div className="majalah-detail-skeleton">
                        <div className="majalah-detail-skeleton-header" />
                        <div className="majalah-detail-skeleton-image" />
                        <div className="majalah-detail-skeleton-content" />
                        <div className="majalah-detail-skeleton-content" />
                        <div className="majalah-detail-skeleton-content" />
                    </div>
                </section>
            </main>
        );
    }

    if (error || !majalah) {
        return (
            <main className="majalah-detail-main">
                <section className="majalah-detail-section">
                    <div className="majalah-detail-state majalah-detail-state-error">
                        <p>{error || 'Data majalah tidak ditemukan'}</p>
                        <button className="majalah-detail-back-button" onClick={handleBack}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Kembali</span>
                        </button>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="majalah-detail-main">
            <section className="majalah-detail-section">
                <button className="majalah-detail-back-button" onClick={handleBack}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Kembali</span>
                </button>

                <article className="majalah-detail-container">
                    <div className="majalah-detail-header">
                        <h1 className="majalah-detail-title">{majalah.judul || '-'}</h1>
                    </div>

                    <div className="majalah-detail-content-wrapper">
                        <div className="majalah-detail-cover-section">
                            {getCoverImage(majalah.foto_cover) ? (
                                <div className="majalah-detail-image">
                                    <img
                                        src={getCoverImage(majalah.foto_cover)}
                                        alt={`Sampul ${majalah.judul}`}
                                        loading="eager"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                    <div
                                        className="majalah-detail-image-placeholder"
                                        style={{ display: getCoverImage(majalah.foto_cover) ? 'none' : 'flex' }}
                                    >
                                        Tidak Ada Gambar
                                    </div>
                                </div>
                            ) : (
                                <div className="majalah-detail-image">
                                    <div className="majalah-detail-image-placeholder">
                                        Tidak Ada Gambar
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="majalah-detail-info-section">
                            <table className="majalah-detail-metadata-table">
                            <tbody>
                                    <tr>
                                        <td className="majalah-detail-label">Edisi</td>
                                        <td className="majalah-detail-separator">:</td>
                                        <td className="majalah-detail-value">{majalah.edisi || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="majalah-detail-label">No. Klasifikasi</td>
                                        <td className="majalah-detail-separator">:</td>
                                        <td className="majalah-detail-value">{majalah.no_klasifikasi || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="majalah-detail-label">Bahasa</td>
                                        <td className="majalah-detail-separator">:</td>
                                        <td className="majalah-detail-value">{majalah.nama_bahasa || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="majalah-detail-label">Tahun Terbit</td>
                                        <td className="majalah-detail-separator">:</td>
                                        <td className="majalah-detail-value">{majalah.tahun_terbit || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="majalah-detail-label">Tempat Terbit</td>
                                        <td className="majalah-detail-separator">:</td>
                                        <td className="majalah-detail-value">{majalah.tempat_terbit || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="majalah-detail-label">Penerbit</td>
                                        <td className="majalah-detail-separator">:</td>
                                        <td className="majalah-detail-value">{majalah.penerbit || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="majalah-detail-label">Kategori</td>
                                        <td className="majalah-detail-separator">:</td>
                                        <td className="majalah-detail-value">{majalah.nama_kategori || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="majalah-detail-label">Lokasi</td>
                                        <td className="majalah-detail-separator">:</td>
                                        <td className="majalah-detail-value">{majalah.lokasi || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="majalah-detail-label">Ketersediaan</td>
                                        <td className="majalah-detail-separator">:</td>
                                        <td
                                            className="majalah-detail-value"
                                            style={{
                                                fontWeight: 700,
                                                color: majalah.ketersediaan === 'Tersedia' ? '#28a745' : '#dc3545'
                                            }}
                                        >
                                            {majalah.ketersediaan || '-'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                            {majalah.sinopsis && (
                                <div className="majalah-detail-sinopsis">
                                    <h3 className="majalah-detail-sinopsis-title">Sinopsis</h3>
                                    <p className="majalah-detail-sinopsis-text">{majalah.sinopsis}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </article>
            </section>
        </main>
    );
}

export default DetailMajalah;