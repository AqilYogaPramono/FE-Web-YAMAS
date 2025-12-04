import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailBuku.css';

function DetailBuku() {
    const { id } = useParams();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_EKATALOG || 'http://localhost:3000';
    
    const [buku, setBuku] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const handleBack = (e) => {
        e.preventDefault();
        navigate(-1);
    };

    const getCoverImage = (fotoCover) => {
        if (fotoCover) {
            return `${apiUrl}/images/buku/${fotoCover}`;
        }
        return null;
    };

    if (loading) {
        return (
            <main className="page-content">
                <div className="container">
                    <div className="loading-state">
                        <span className="material-symbols-rounded">hourglass_empty</span>
                        <p>Memuat data buku...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !buku) {
        return (
            <main className="page-content">
                <div className="container">
                    <div className="error-state">
                        <span className="material-symbols-rounded">error</span>
                        <p>{error || 'Data buku tidak ditemukan'}</p>
                        <button onClick={handleBack} className="back-button-text">
                            Kembali
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="page-content">
            <div className="container">
                <div className="detail-card">
                    <a
                        href="#"
                        className="back-button"
                        title="Kembali"
                        onClick={handleBack}
                    >
                        <span className="material-symbols-rounded">arrow_back</span>
                    </a>

                    <div className="cover-section">
                        {getCoverImage(buku.foto_cover) ? (
                            <img
                                src={getCoverImage(buku.foto_cover)}
                                alt={`Sampul ${buku.judul}`}
                                className="book-cover-image"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <div
                            className="book-cover-placeholder"
                            style={{ display: getCoverImage(buku.foto_cover) ? 'none' : 'flex' }}
                        >
                            Tidak Ada Gambar
                        </div>
                    </div>

                    <div className="info-section">
                        <h1 className="info-title">{buku.judul || '-'}</h1>
                        
                        <table className="metadata-table">
                            <tbody>
                                <tr>
                                    <td className="label">Pengarang</td>
                                    <td className="separator">:</td>
                                    <td className="value">{buku.pengarang || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="label">ISBN / ISSN</td>
                                    <td className="separator">:</td>
                                    <td className="value">{buku.isbn_issn || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="label">No. Klasifikasi</td>
                                    <td className="separator">:</td>
                                    <td className="value">{buku.no_klasifikasi || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="label">Bahasa</td>
                                    <td className="separator">:</td>
                                    <td className="value">{buku.nama_bahasa || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="label">Jumlah Halaman</td>
                                    <td className="separator">:</td>
                                    <td className="value">{buku.jumlah_halaman || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="label">Tahun Terbit</td>
                                    <td className="separator">:</td>
                                    <td className="value">{buku.tahun_terbit || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="label">Tempat Terbit</td>
                                    <td className="separator">:</td>
                                    <td className="value">{buku.tempat_terbit || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="label">Penerbit</td>
                                    <td className="separator">:</td>
                                    <td className="value">{buku.penerbit || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="label">Kategori</td>
                                    <td className="separator">:</td>
                                    <td className="value">{buku.nama_kategori || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="label">Lokasi</td>
                                    <td className="separator">:</td>
                                    <td className="value">{buku.lokasi || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="label">Ketersediaan</td>
                                    <td className="separator">:</td>
                                    <td
                                        className="value"
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
                            <div className="sinopsis-box">
                                <h3>Sinopsis</h3>
                                <p>{buku.sinopsis}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default DetailBuku;
