import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PencarianMajalah.css';

const TAHUN_OPTIONS = [];
const currentYear = new Date().getFullYear();
for (let year = 1950; year <= currentYear; year++) {
    TAHUN_OPTIONS.push(year);
}
TAHUN_OPTIONS.reverse();

function PencarianMajalah() {
    const apiUrl = import.meta.env.VITE_API_EKATALOG;
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mainKeyword, setMainKeyword] = useState('');
    const [noKlasifikasi, setNoKlasifikasi] = useState('');
    const [penerbit, setPenerbit] = useState('');
    const [idBahasa, setIdBahasa] = useState('');
    const [idKategori, setIdKategori] = useState('');
    const [tahunTerbit, setTahunTerbit] = useState('');
    const [edisi, setEdisi] = useState('');
    
    const [searchResults, setSearchResults] = useState([]);
    const [newMajalah, setNewMajalah] = useState([]);
    const [bahasaList, setBahasaList] = useState([]);
    const [kategoriList, setKategoriList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNewMajalah();
        fetchBahasa();
        fetchKategori();
    }, []);

    const fetchNewMajalah = async () => {
        try {
            const response = await fetch(`${apiUrl}/API/new-majalah`);
            if (response.ok) {
                const data = await response.json();
                setNewMajalah(data?.data || []);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchBahasa = async () => {
        try {
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
    };

    const handleClearAdvance = () => {
        setNoKlasifikasi('');
        setPenerbit('');
        setIdBahasa('');
        setIdKategori('');
        setTahunTerbit('');
        setEdisi('');
    };

    const handleSimpleSearch = async (e) => {
        e.preventDefault();
        const keyword = mainKeyword.trim();
        if (!keyword) return;

        setSearchLoading(true);
        setHasSearched(true);
        setError(null);
        
        try {
            const response = await fetch(`${apiUrl}/API/majalah/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ keyword }),
            });

            if (response.ok) {
                const data = await response.json();
                setSearchResults(data?.result || []);
            } else if (response.status === 404) {
                setSearchResults([]);
            } else {
                setSearchResults([]);
                setError('Gagal melakukan pencarian');
            }
        } catch (err) {
            console.error(err);
            setSearchResults([]);
            setError('Terjadi kesalahan saat melakukan pencarian');
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
        if (edisi.trim()) filters.edisi = edisi.trim();

        if (Object.keys(filters).length === 0) {
            setError('Minimal satu filter harus diisi');
            return;
        }

        setSearchLoading(true);
        setHasSearched(true);
        setError(null);
        setIsModalOpen(false);

        try {
            const response = await fetch(`${apiUrl}/API/majalah/advance-search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filters),
            });

            if (response.ok) {
                const data = await response.json();
                setSearchResults(data?.result || []);
            } else if (response.status === 404) {
                setSearchResults([]);
            } else {
                setSearchResults([]);
                setError('Gagal melakukan pencarian');
            }
        } catch (err) {
            console.error(err);
            setSearchResults([]);
            setError('Terjadi kesalahan saat melakukan pencarian');
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
            return `${apiUrl}/images/majalah/${fotoCover}`;
        }
        return 'https://via.placeholder.com/200x260/e0e0e0/999999?text=Tidak+Ada+Gambar';
    };

    return (
        <>
            <div className="hero-majalah-search">
                <div className="container">
                    <div className="hero-majalah-content">
                        <h1>Temukan Koleksi Pustaka Kami</h1>
                        <p>Jelajahi ribuan majalah yang tersedia di perpustakaan kami.</p>
                    </div>
                    
                    <form className="majalah-search-form" onSubmit={handleSimpleSearch}>
                        <div className="majalah-search-wrapper">
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
                                        placeholder="Masukkan judul majalah"
                                    />
                                </div>
                                <div className="modal-field-group">
                                    <label htmlFor="modal-edisi">Edisi</label>
                                    <input
                                        type="text"
                                        id="modal-edisi"
                                        value={edisi}
                                        onChange={(e) => setEdisi(e.target.value)}
                                        placeholder="Masukkan edisi majalah"
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
                    {error && (
                        <div className="majalah-error">
                            <p>{error}</p>
                        </div>
                    )}

                    {hasSearched ? (
                        <div id="majalahResults">
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
                            ) : searchResults.length > 0 ? (
                                <div className="majalah-grid">
                                    {searchResults.map((item) => (
                                        <Link
                                            key={item.id}
                                            to={`/majalah/detail/${item.id}`}
                                            className="majalah-card"
                                        >
                                            <span className="majalah-type-badge">Majalah</span>
                                            <div className="majalah-image-wrapper">
                                                <img
                                                    src={getCoverImage(item['foto-cover'])}
                                                    alt={item.judul}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/200x260/e0e0e0/999999?text=Tidak+Ada+Gambar';
                                                    }}
                                                />
                                            </div>
                                            <div className="majalah-info">
                                                <h3>{item.judul}</h3>
                                                <p>{item.edisi || item.lokasi || 'Lokasi tidak tersedia'}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="majalah-empty-not-found">
                                    <p>Data majalah yang Anda cari tidak ditemukan.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div id="majalahTerbaru">
                            <div className="section-header">
                                <h2 className="section-title">Majalah Terbaru</h2>
                                <p className="section-description">Jelajahi koleksi majalah terbaru yang tersedia di perpustakaan kami</p>
                            </div>
                            {newMajalah.length > 0 ? (
                                <div className="majalah-grid">
                                    {newMajalah.map((item) => (
                                        <Link
                                            key={item.id}
                                            to={`/majalah/detail/${item.id}`}
                                            className="majalah-card"
                                        >
                                            <span className="majalah-type-badge">Majalah</span>
                                            <div className="majalah-image-wrapper">
                                                <img
                                                    src={getCoverImage(item.foto_cover)}
                                                    alt={item.judul}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/200x260/e0e0e0/999999?text=Tidak+Ada+Gambar';
                                                    }}
                                                />
                                            </div>
                                            <div className="majalah-info">
                                                <h3>{item.judul}</h3>
                                                <p>{item.edisi || 'Edisi tidak tersedia'}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="majalah-empty">
                                    <p>Belum ada koleksi majalah yang tersedia.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default PencarianMajalah;
