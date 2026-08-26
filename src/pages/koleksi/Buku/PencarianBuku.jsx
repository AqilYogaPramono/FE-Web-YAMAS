import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './PencarianBuku.css';

const TAHUN_OPTIONS = [];
const currentYear = new Date().getFullYear();
for (let year = 1950; year <= currentYear; year++) {
    TAHUN_OPTIONS.push(year);
}
TAHUN_OPTIONS.reverse();

function PencarianBuku() {
    const apiUrl = import.meta.env.VITE_API_E_KATALOG;
    const location = useLocation();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mainKeyword, setMainKeyword] = useState('');
    const [noKlasifikasi, setNoKlasifikasi] = useState('');
    const [penerbit, setPenerbit] = useState('');
    const [idBahasa, setIdBahasa] = useState('');
    const [idKategori, setIdKategori] = useState('');
    const [tahunTerbit, setTahunTerbit] = useState('');
    const [pengarang, setPengarang] = useState('');
    
    const [searchResults, setSearchResults] = useState([]);
    const [newBooks, setNewBooks] = useState([]);
    const [bahasaList, setBahasaList] = useState([]);
    const [kategoriList, setKategoriList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState(null);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        if (!apiUrl) {
            setFetchError('Gagal memuat data buku. Silakan coba lagi nanti.');
            return;
        }
        fetchNewBooks();
        fetchBahasa();
        fetchKategori();
    }, [apiUrl]);

    const fetchNewBooks = async () => {
        try {
            if (!apiUrl) {
                setFetchError('Gagal memuat data buku. Silakan coba lagi nanti.');
                return;
            }
            const response = await fetch(`${apiUrl}/API/new-buku`);
            if (response.ok) {
                const data = await response.json();
                setNewBooks(data?.data || []);
                setFetchError(null);
            } else {
                setFetchError('Gagal memuat data buku. Silakan coba lagi nanti.');
            }
        } catch (err) {
            console.error(err);
            setFetchError('Gagal memuat data buku. Silakan coba lagi nanti.');
        }
    };

    const fetchBahasa = async () => {
        try {
            if (!apiUrl) {
                return;
            }
            const response = await fetch(`${apiUrl}/API/bahasa`);
            if (response.ok) {
                const data = await response.json();
                setBahasaList(data?.data || []);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchKategori = async () => {
        try {
            if (!apiUrl) {
                return;
            }
            const response = await fetch(`${apiUrl}/API/kategori`);
            if (response.ok) {
                const data = await response.json();
                setKategoriList(data?.data || []);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenModal = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleClearSearch = () => {
        setMainKeyword('');
        setSearchResults([]);
        setHasSearched(false);
        setError(null);
        setFetchError(null);
    };

    const handleClearAdvance = () => {
        setNoKlasifikasi('');
        setPenerbit('');
        setIdBahasa('');
        setIdKategori('');
        setTahunTerbit('');
        setPengarang('');
    };

    const handleSimpleSearch = async (e) => {
        e.preventDefault();
        const keyword = mainKeyword.trim();
        if (!keyword) return;

        setSearchLoading(true);
        setHasSearched(true);
        setError(null);
        
        try {
            if (!apiUrl) {
                setSearchResults([]);
                setError('Gagal memuat data buku. Silakan coba lagi nanti.');
                return;
            }
            const response = await fetch(`${apiUrl}/API/buku/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ keyword }),
            });

            if (response.ok) {
                const data = await response.json();
                setSearchResults(data?.result || []);
            } else {
                const errorData = await response.json().catch(() => ({}));
                setSearchResults([]);
                setError('Gagal memuat data buku. Silakan coba lagi nanti.');
            }
        } catch (err) {
            console.error(err);
            setSearchResults([]);
            setError('Gagal memuat data buku. Silakan coba lagi nanti.');
        } finally {
            setSearchLoading(false);
            setTimeout(() => {
                const pageContent = document.querySelector('.page-content');
                if (pageContent) {
                    const offsetTop = pageContent.offsetTop - 20;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            }, 100);
        }
    };

    const handleAdvanceSearch = async (e) => {
        e.preventDefault();
        const filters = {};
        
        if (mainKeyword.trim()) filters.judul = mainKeyword.trim();
        if (noKlasifikasi.trim()) filters.no_klasifikasi = noKlasifikasi.trim();
        if (penerbit.trim()) filters.penerbit = penerbit.trim();
        if (idBahasa) filters.id_bahasa = parseInt(idBahasa);
        if (idKategori) filters.id_kategori = parseInt(idKategori);
        if (tahunTerbit.trim()) filters.tahun_terbit = parseInt(tahunTerbit.trim());
        if (pengarang.trim()) filters.pengarang = pengarang.trim();

        if (Object.keys(filters).length === 0) {
            setError('Minimal satu filter harus diisi');
            return;
        }

        setSearchLoading(true);
        setHasSearched(true);
        setError(null);
        setIsModalOpen(false);

        try {
            if (!apiUrl) {
                setSearchResults([]);
                setError('Gagal memuat data buku. Silakan coba lagi nanti.');
                return;
            }
            const response = await fetch(`${apiUrl}/API/buku/advance-search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filters),
            });

            if (response.ok) {
                const data = await response.json();
                setSearchResults(data?.result || []);
            } else {
                const errorData = await response.json().catch(() => ({}));
                setSearchResults([]);
                setError('Gagal memuat data buku. Silakan coba lagi nanti.');
            }
        } catch (err) {
            console.error(err);
            setSearchResults([]);
            setError('Gagal memuat data buku. Silakan coba lagi nanti.');
        } finally {
            setSearchLoading(false);
            setTimeout(() => {
                const pageContent = document.querySelector('.page-content');
                if (pageContent) {
                    const offsetTop = pageContent.offsetTop - 20;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            }, 100);
        }
    };

    const getCoverImage = (fotoCover) => {
        if (fotoCover) {
            return `${apiUrl}/images/buku/${fotoCover}`;
        }
        return 'https://via.placeholder.com/200x260/e0e0e0/999999?text=Tidak+Ada+Gambar';
    };

    const currentUrl = `${window.location.origin}${location.pathname}`;

    return (
        <>
            <Helmet>
                <title>E-Katalog Buku - Koleksi Buku Perpustakaan Medayu Agung Surabaya</title>
                <meta
                    name="description"
                    content="Cari dan temukan koleksi buku di Perpustakaan Medayu Agung Surabaya. Jelajahi ribuan buku dengan pencarian sederhana atau pencarian spesifik berdasarkan judul, pengarang, penerbit, kategori, dan tahun terbit."
                />
                <meta
                    name="keywords"
                    content="e-katalog buku, pencarian buku, koleksi buku perpustakaan medayu agung, katalog buku surabaya, pencarian buku perpustakaan, katalog online perpustakaan, koleksi pustaka"
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={currentUrl} />
                <meta
                    property="og:title"
                    content="E-Katalog Buku - Koleksi Perpustakaan Medayu Agung Surabaya"
                />
                <meta
                    property="og:description"
                    content="Cari dan temukan koleksi buku di Perpustakaan Medayu Agung Surabaya. Jelajahi ribuan buku dengan pencarian sederhana atau pencarian spesifik berdasarkan judul, pengarang, penerbit, kategori, dan tahun terbit."
                />
                <meta property="og:locale" content="id_ID" />
                <meta
                    property="og:site_name"
                    content="Perpustakaan Medayu Agung Surabaya"
                />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:url" content={currentUrl} />
                <meta
                    name="twitter:title"
                    content="Pencarian Buku - Koleksi Perpustakaan Medayu Agung Surabaya"
                />
                <meta
                    name="twitter:description"
                    content="Cari dan temukan koleksi buku di Perpustakaan Medayu Agung Surabaya. Jelajahi ribuan buku dengan pencarian sederhana atau pencarian spesifik berdasarkan judul, pengarang, penerbit, kategori, dan tahun terbit."
                />
                <meta name="robots" content="index, follow" />
                <meta name="author" content="Perpustakaan Medayu Agung Surabaya" />
                <link rel="canonical" href={currentUrl} />
            </Helmet>
            <div className="hero-buku-search">
                <div className="container">
                    <div className="hero-buku-content">
                    <h1>Temukan Koleksi Pustaka Kami</h1>
                        <p>Jelajahi ribuan buku yang tersedia di perpustakaan kami.</p>
                    </div>

                    <form className="buku-search-form" onSubmit={handleSimpleSearch}>
                        <div className="buku-search-wrapper">
                            <span className="material-symbols-rounded">search</span>
                            <input
                                type="text"
                                id="mainSearchInput"
                                placeholder="Masukkan Judul"
                                value={mainKeyword}
                                onChange={(e) => setMainKeyword(e.target.value)}
                            />
                            {mainKeyword && (
                            <span
                                className="material-symbols-rounded clear-search"
                                onClick={handleClearSearch}
                            >
                                close
                            </span>
                            )}
                            <button type="submit" disabled={searchLoading}>
                                {searchLoading ? 'Mencari...' : 'Cari'}
                            </button>
                        </div>
                    </form>

                    <div className="pencarian-spesifik">
                        <a
                            href="#"
                            onClick={handleOpenModal}
                        >
                            Pencarian Spesifik
                        </a>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Pencarian Spesifik</h2>
                            <button className="modal-close" onClick={handleCloseModal}>
                                <span className="material-symbols-rounded">close</span>
                            </button>
                        </div>
                        <form className="modal-form" onSubmit={handleAdvanceSearch}>
                            <div className="modal-fields">
                                <div className="modal-field-group">
                                    <label htmlFor="modal-judul">Judul</label>
                                    <input
                                        type="text"
                                        id="modal-judul"
                                        value={mainKeyword}
                                        onChange={(e) => setMainKeyword(e.target.value)}
                                        placeholder="Masukkan judul buku"
                                    />
                                </div>
                                <div className="modal-field-group">
                                    <label htmlFor="modal-no-klasifikasi">No. Klasifikasi</label>
                                    <input
                                        type="text"
                                        id="modal-no-klasifikasi"
                                        value={noKlasifikasi}
                                        onChange={(e) => setNoKlasifikasi(e.target.value)}
                                        placeholder="Masukkan nomor klasifikasi"
                                    />
                                </div>
                                <div className="modal-field-group">
                                    <label htmlFor="modal-penerbit">Penerbit</label>
                                    <input
                                        type="text"
                                        id="modal-penerbit"
                                        value={penerbit}
                                        onChange={(e) => setPenerbit(e.target.value)}
                                        placeholder="Masukkan nama penerbit"
                                    />
                                </div>
                                <div className="modal-field-group">
                                    <label htmlFor="modal-pengarang">Pengarang</label>
                                    <input
                                        type="text"
                                        id="modal-pengarang"
                                        value={pengarang}
                                        onChange={(e) => setPengarang(e.target.value)}
                                        placeholder="Masukkan nama pengarang"
                                    />
                                </div>
                                <div className="modal-field-group">
                                    <label htmlFor="modal-tahun-terbit">Tahun Terbit</label>
                                    <select
                                        id="modal-tahun-terbit"
                                        value={tahunTerbit}
                                        onChange={(e) => setTahunTerbit(e.target.value)}
                                    >
                                        <option value="">Pilih Tahun</option>
                                        {TAHUN_OPTIONS.map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="modal-field-group">
                                    <label htmlFor="modal-bahasa">Bahasa</label>
                                    <select
                                        id="modal-bahasa"
                                        value={idBahasa}
                                        onChange={(e) => setIdBahasa(e.target.value)}
                                    >
                                        <option value="">Pilih Bahasa</option>
                                        {bahasaList.map((bahasa) => (
                                            <option key={bahasa.id} value={bahasa.id}>
                                                {bahasa.bahasa}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="modal-field-group">
                                    <label htmlFor="modal-kategori">Kategori</label>
                                    <select
                                        id="modal-kategori"
                                        value={idKategori}
                                        onChange={(e) => setIdKategori(e.target.value)}
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {kategoriList.map((kategori) => (
                                            <option key={kategori.id} value={kategori.id}>
                                                {kategori.kategori}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-clear" onClick={handleClearAdvance}>
                                    Hapus
                                </button>
                                <button type="submit" className="btn-submit" disabled={searchLoading}>
                                    {searchLoading ? 'Mencari...' : 'Cari'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <main className="page-content">
                <div className="container">
                    {hasSearched ? (
                        <div id="bukuResults">
                            <div className="results-header">
                                <h2 className="section-title">Hasil Pencarian</h2>
                                <button 
                                    type="button"
                                    className="btn-hapus" 
                                    onClick={handleClearSearch}
                                >
                                    <span className="material-symbols-rounded">close</span> Hapus Pencarian
                                </button>
                            </div>
                            
                            {searchLoading ? (
                                <div className="loading-state">
                                    <span className="material-symbols-rounded">hourglass_empty</span>
                                    <p>Memuat hasil pencarian...</p>
                                </div>
                            ) : error ? (
                                <div className="buku-empty-not-found">
                                    <p>{error}</p>
                                    <button type="button" className="retry-button" onClick={() => window.location.reload()}>
                                        Coba Lagi
                                    </button>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="buku-grid">
                                    {searchResults.map((item) => (
                                        <Link
                                            key={item.id}
                                            to={`/buku/detail/${item.id}`}
                                            className="buku-card"
                                        >
                                            <span className="buku-type-badge">Buku</span>
                                            <div className="buku-image-wrapper">
                                                <img
                                                    src={getCoverImage(item.foto_cover)}
                                                    alt={item.judul}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/200x260/e0e0e0/999999?text=Tidak+Ada+Gambar';
                                                    }}
                                                />
                                            </div>
                                            <div className="buku-info">
                                                <h3>{item.judul}</h3>
                                                <p>{item.lokasi || 'Lokasi tidak tersedia'}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="buku-empty-not-found">
                                    <p>Data buku yang Anda cari tidak ditemukan.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div id="bukuTerbaru">
                            <div className="section-header">
                                <h2 className="section-title">Buku Terbaru</h2>
                                <p className="section-description">Jelajahi koleksi buku terbaru yang tersedia di perpustakaan kami</p>
                            </div>
                            {fetchError ? (
                                <div className="buku-empty buku-empty-error">
                                    <p>{fetchError}</p>
                                    <button type="button" className="retry-button" onClick={() => window.location.reload()}>
                                        Coba Lagi
                                    </button>
                                </div>
                            ) : newBooks.length > 0 ? (
                                <div className="buku-grid">
                                    {newBooks.map((item) => (
                                        <Link
                                            key={item.id}
                                            to={`/buku/detail/${item.id}`}
                                            className="buku-card"
                                        >
                                            <span className="buku-type-badge">Buku</span>
                                            <div className="buku-image-wrapper">
                                                <img
                                                    src={getCoverImage(item.foto_cover)}
                                                    alt={item.judul}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/200x260/e0e0e0/999999?text=Tidak+Ada+Gambar';
                                                    }}
                                                />
                                            </div>
                                            <div className="buku-info">
                                                <h3>{item.judul}</h3>
                                                <p>{item.pengarang || 'Pengarang tidak tersedia'}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="buku-empty">
                                    <p>Belum ada koleksi buku yang tersedia.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default PencarianBuku;
