import React, { useState, useEffect } from 'react';
import './PencarianKoran.css';

const BULAN_OPTIONS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const TAHUN_OPTIONS = [];
const currentYear = new Date().getFullYear();
for (let year = 1950; year <= currentYear; year++) {
    TAHUN_OPTIONS.push(year);
}
TAHUN_OPTIONS.reverse();

function PencarianKoran() {
    const [penerbitKoran, setPenerbitKoran] = useState([]);
    const [koleksiTerbaru, setKoleksiTerbaru] = useState([]);
    const [idPenerbitKoran, setIdPenerbitKoran] = useState('');
    const [tahun, setTahun] = useState('');
    const [bulan, setBulan] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fetchError, setFetchError] = useState(null);

    const apiUrl = import.meta.env.VITE_API_E_KATALOG;

    useEffect(() => {
        const fetchPenerbit = async () => {
            try {
                if (!apiUrl) {
                    return;
                }

                const response = await fetch(`${apiUrl}/API/penerbit-koran`);
                if (!response.ok) {
                    return;
                }

                const data = await response.json();
                const penerbitList = data?.penerbitKoran || [];
                const formattedPenerbit = penerbitList.map(p => ({
                    id: p.id,
                    nama_penerbit: p.nama_penerbit
                }));
                setPenerbitKoran(formattedPenerbit);
            } catch (err) {
                console.error(err);
            }
        };

        fetchPenerbit();
    }, [apiUrl]);

    useEffect(() => {
        const fetchKoleksi = async () => {
            try {
                setLoading(true);
                setFetchError(null);

                if (!apiUrl) {
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${apiUrl}/API/new-koran`);
                if (!response.ok) {
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                const koleksi = data?.data || [];
                setKoleksiTerbaru(koleksi.slice(0, 6));
            } catch (err) {
                console.error(err);
                setFetchError('Gagal memuat data koleksi koran');
            } finally {
                setLoading(false);
            }
        };

        fetchKoleksi();
    }, [apiUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!idPenerbitKoran && !tahun && !bulan) {
            setShowResults(false);
            return;
        }

        try {
            setSearchLoading(true);
            setError(null);

            if (!apiUrl) {
                throw new Error('URL API tidak dikonfigurasi');
            }

            const response = await fetch(`${apiUrl}/API/koran/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_penerbit_koran: idPenerbitKoran || null,
                    tahun: tahun || null,
                    bulan: bulan || null
                })
            });

            if (!response.ok) {
                throw new Error('Gagal melakukan pencarian koran');
            }

            const data = await response.json();
            setResults(data?.koran || []);
            setShowResults(true);
            
            setTimeout(() => {
                const pageContent = document.querySelector('.page-content');
                if (pageContent) {
                    const offsetTop = pageContent.offsetTop - 20;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            }, 100);
        } catch (err) {
            console.error(err);
            if (err.name === 'TypeError' && err.message.includes('fetch')) {
                setError('Gagal terhubung ke server. Silakan coba lagi.');
            } else {
                setError(err.message || 'Terjadi kesalahan saat melakukan pencarian');
            }
        } finally {
            setSearchLoading(false);
        }
    };

    const handleClearSearch = (e) => {
        e.preventDefault();
        setIdPenerbitKoran('');
        setTahun('');
        setBulan('');
        setShowResults(false);
        setResults([]);
        setError(null);
    };

    const getPenerbitName = (id) => {
        if (!id) return '';
        const penerbit = penerbitKoran.find(p => p.id === parseInt(id));
        return penerbit?.nama_penerbit || 'Tidak diketahui';
    };

    return (
        <>
            <div className="hero-koran-search">
                <div className="container">
                    <div className="hero-koran-content">
                        <h1>Temukan Koleksi Pustaka Kami</h1>
                        <p>Jelajahi ribuan koran yang tersedia di perpustakaan kami.</p>
                    </div>
                    
                    <form className="koran-search-form" onSubmit={handleSubmit}>
                        <div className="koran-filters-wrapper">
                            <div className="filter-group">
                                <select 
                                    className="koran-select" 
                                    id="penerbitKoran"
                                    value={idPenerbitKoran}
                                    onChange={(e) => setIdPenerbitKoran(e.target.value)}
                                >
                                    <option value="">Pilih Penerbit</option>
                                    {penerbitKoran.map((penerbit) => (
                                        <option key={penerbit.id} value={penerbit.id}>
                                            {penerbit.nama_penerbit}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-group">
                                <select 
                                    className="koran-select" 
                                    id="tahunKoran"
                                    value={tahun}
                                    onChange={(e) => setTahun(e.target.value)}
                                >
                                    <option value="">Pilih Tahun</option>
                                    {TAHUN_OPTIONS.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-group">
                                <select 
                                    className="koran-select" 
                                    id="bulanKoran"
                                    value={bulan}
                                    onChange={(e) => setBulan(e.target.value)}
                                >
                                    <option value="">Pilih Bulan</option>
                                    {BULAN_OPTIONS.map((bulanItem) => (
                                        <option key={bulanItem} value={bulanItem}>
                                            {bulanItem}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <button 
                                type="submit" 
                                className="btn-cari"
                                disabled={searchLoading}
                            >
                                {searchLoading ? 'Mencari...' : 'Cari'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <main className="page-content">
                <div className="container">
                    {error && (
                        <div className="koran-error">
                            <p>{error}</p>
                        </div>
                    )}

                    {loading && (
                        <div className="koran-skeleton-section">
                            <div className="koran-skeleton-title"></div>
                            <div className="koran-skeleton-grid">
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <div key={item} className="koran-skeleton-card" />
                                ))}
                            </div>
                        </div>
                    )}

                    {!loading && !showResults && (
                        <>
                            {fetchError ? (
                                <div className="koran-error">
                                    <p>{fetchError}</p>
                                </div>
                            ) : koleksiTerbaru.length > 0 ? (
                                <div id="koranTerbaru">
                                    <div className="section-header">
                                        <h2 className="section-title">Koleksi Koran Terbaru</h2>
                                        <p className="section-description">Jelajahi koleksi koran terbaru yang tersedia di perpustakaan kami</p>
                                    </div>
                                    <div className="koran-grid">
                                        {koleksiTerbaru.map((koran) => (
                                            <div className="koran-card" key={koran.id}>
                                                <div className="koran-image-wrapper">
                                                    {koran.foto && (
                                                        <img 
                                                            src={`${apiUrl}/images/penerbit-koran/${koran.foto}`}
                                                            alt={koran.nama_penerbit}
                                                            loading="lazy"
                                                        />
                                                    )}
                                                </div>
                                                <div className="koran-info">
                                                    <h3>{koran.nama_penerbit}</h3>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="koran-empty">
                                    <p>Belum ada koleksi koran yang tersedia.</p>
                                </div>
                            )}
                        </>
                    )}
                    
                    {!loading && showResults && (
                        <div id="koranResults">
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
                            
                            {results.length === 0 ? (
                                <div className="koran-empty-not-found">
                                    <p>Data koran yang Anda cari tidak ditemukan.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="koran-results-wrapper koran-results-desktop">
                                        <table className="koran-results-table">
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Penerbit</th>
                                                    <th>Bulan</th>
                                                    <th>Tahun</th>
                                                    <th>Ketersediaan</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {results.map((result, index) => (
                                                    <tr key={result.id || index}>
                                                        <td>{index + 1}</td>
                                                        <td>{result.nama_penerbit || getPenerbitName(result.id_penerbit_koran)}</td>
                                                        <td>{result.bulan}</td>
                                                        <td>{result.tahun}</td>
                                                        <td>
                                                            <span className={`ketersediaan-badge ${result.ketersediaan === 'Tersedia' ? 'tersedia' : 'tidak-tersedia'}`}>
                                                                {result.ketersediaan}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="koran-results-mobile">
                                        {results.map((result, index) => (
                                            <div className="koran-result-card" key={result.id || index}>
                                                <div className="result-card-row">
                                                    <span className="result-label">No</span>
                                                    <span className="result-value">{index + 1}</span>
                                                </div>
                                                <div className="result-card-row">
                                                    <span className="result-label">Penerbit</span>
                                                    <span className="result-value">{result.nama_penerbit || getPenerbitName(result.id_penerbit_koran)}</span>
                                                </div>
                                                <div className="result-card-row">
                                                    <span className="result-label">Bulan</span>
                                                    <span className="result-value">{result.bulan}</span>
                                                </div>
                                                <div className="result-card-row">
                                                    <span className="result-label">Tahun</span>
                                                    <span className="result-value">{result.tahun}</span>
                                                </div>
                                                <div className="result-card-row">
                                                    <span className="result-label">Ketersediaan</span>
                                                    <span className="result-value">
                                                        <span className={`ketersediaan-badge ${result.ketersediaan === 'Tersedia' ? 'tersedia' : 'tidak-tersedia'}`}>
                                                            {result.ketersediaan}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default PencarianKoran;
