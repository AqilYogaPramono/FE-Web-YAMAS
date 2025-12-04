import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PencarianBukuMajalah.css';

const collectionData = `
    <h2 class="results-title">Hasil Pencarian</h2>
    <div class="collection-grid">
        <a href="/koleksi/bukumajalah/detailbuku" class="collection-card">
            <span class="collection-type-badge">Buku</span>
            <div class="collection-image-wrapper"></div>
            <h3>Bumi Manusia</h3>
            <p>Pramoedya Ananta Toer</p>
        </a>
        <a href="/koleksi/bukumajalah/detailbuku" class="collection-card">
            <span class="collection-type-badge">Buku</span>
            <div class="collection-image-wrapper"></div>
            <h3>Anak Semua Bangsa</h3>
            <p>Pramoedya Ananta Toer</p>
        </a>
        <a href="/koleksi/bukumajalah/detailmajalah" class="collection-card">
            <span class="collection-type-badge majalah">Majalah</span>
            <div class="collection-image-wrapper"></div>
            <h3>Tempo: Toleransi dalam Al-Qur'an</h3>
            <p>Majalah Tempo</p>
        </a>
        <a href="/koleksi/bukumajalah/detailmajalah" class="collection-card">
            <span class="collection-type-badge majalah">Majalah</span>
            <div class="collection-image-wrapper"></div>
            <h3>Kuwat Melebihi Maut</h3>
            <p>Majalah Tempo</p>
        </a>
    </div>
`;

const noResultsMessage = `
    <div class="no-results">
        <span class="material-symbols-rounded">find_in_page</span>
        <p>Koleksi Tidak Ditemukan</p>
        <p style="font-size: 1rem; margin-top: -10px;">Coba gunakan kata kunci lain.</p>
    </div>
`;

const topCategories = (
    <div id="topCategories">
        <hr />

        <h2 className="category-title">Buku Teratas</h2>
        <div className="collection-grid">
            <Link to="/koleksi/bukumajalah/detailbuku" className="collection-card">
                <span className="collection-type-badge">Buku</span>
                <div className="collection-image-wrapper"></div>
                <h3>Bumi Manusia</h3>
                <p>Pramoedya Ananta Toer</p>
            </Link>
            <Link to="/koleksi/bukumajalah/detailbuku" className="collection-card">
                <span className="collection-type-badge">Buku</span>
                <div className="collection-image-wrapper"></div>
                <h3>Anak Semua Bangsa</h3>
                <p>Pramoedya Ananta Toer</p>
            </Link>
            <Link to="/koleksi/bukumajalah/detailbuku" className="collection-card">
                <span className="collection-type-badge">Buku</span>
                <div className="collection-image-wrapper"></div>
                <h3>Jalan Tak Ada Ujung</h3>
                <p>Mochtar Lubis</p>
            </Link>
            <Link to="/koleksi/bukumajalah/detailbuku" className="collection-card">
                <span className="collection-type-badge">Buku</span>
                <div className="collection-image-wrapper"></div>
                <h3>Di Bawah Langit Jakarta</h3>
                <p>Sitor Situmorang</p>
            </Link>
        </div>

        <h2 className="category-title">Majalah Teratas</h2>
        <div className="collection-grid">
            <Link to="/koleksi/bukumajalah/detailmajalah" className="collection-card">
                <span className="collection-type-badge majalah">Majalah</span>
                <div className="collection-image-wrapper"></div>
                <h3>Majalah Tempo Edisi 1</h3>
                <p>Tempo</p>
            </Link>
            <Link to="/koleksi/bukumajalah/detailmajalah" className="collection-card">
                <span className="collection-type-badge majalah">Majalah</span>
                <div className="collection-image-wrapper"></div>
                <h3>Majalah Tempo Edisi 2</h3>
                <p>Tempo</p>
            </Link>
            <Link to="/koleksi/bukumajalah/detailmajalah" className="collection-card">
                <span className="collection-type-badge majalah">Majalah</span>
                <div className="collection-image-wrapper"></div>
                <h3>Majalah Tempo Edisi 3</h3>
                <p>Tempo</p>
            </Link>
            <Link to="/koleksi/bukumajalah/detailmajalah" className="collection-card">
                <span className="collection-type-badge majalah">Majalah</span>
                <div className="collection-image-wrapper"></div>
                <h3>Majalah Tempo Edisi 4</h3>
                <p>Tempo</p>
            </Link>
        </div>
    </div>
);


function PencarianBukuMajalah() {
    const [isSpesifikOpen, setIsSpesifikOpen] = useState(false);
    const [mainKeyword, setMainKeyword] = useState('');
    const [noKlasifikasi, setNoKlasifikasi] = useState('');
    const [penerbit, setPenerbit] = useState('');
    const [searchResults, setSearchResults] = useState(null); // null: tampilkan kategori terata

    const mainPlaceholder = isSpesifikOpen ? 'Judul' : 'Kata Kunci';

    // pencarian spesifik
    const handleToggleSpesifik = (e) => {
        e.preventDefault();
        const newState = !isSpesifikOpen;
        setIsSpesifikOpen(newState);

        if (!newState) {
            setNoKlasifikasi('');
            setPenerbit('');
        }
    };

    // ke tampilan awal
    const handleClearSearch = () => {
        setMainKeyword('');
        setSearchResults(null);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();

        const keyword = mainKeyword.trim().toLowerCase();

        if (keyword === '' || keyword.includes('no data') || keyword.includes('kosong')) {
            setSearchResults(noResultsMessage); // psan tidak ditemukan
        } else {
            setSearchResults(collectionData);
        }
    };

    return (
        <>
            <div className="hero-search">
                <div className="container">
                    <h1>Temukan Koleksi Pustaka Kami</h1>
                    <p>Jelajahi ribuan buku dan majalah yang tersedia.</p>

                    <form className="search-form-group" onSubmit={handleSearchSubmit}>
                        <div className="search-form-wrapper">
                            <span className="material-symbols-rounded">search</span>
                            <input
                                type="text"
                                id="mainSearchInput"
                                placeholder={mainPlaceholder}
                                value={mainKeyword}
                                onChange={(e) => setMainKeyword(e.target.value)}
                            />
                            {/* tombol clear */}
                            <span
                                className="material-symbols-rounded clear-search"
                                onClick={handleClearSearch}
                            >
                                close
                            </span>
                            <button type="submit">Cari</button>
                        </div>

                        {/* bidang pencarian spesifik */}
                        <div className={`spesifik-fields ${isSpesifikOpen ? 'show' : ''}`} id="spesifikFields">
                            <div className="field-group">
                                <label htmlFor="no-klasifikasi">No. Klasifikasi</label>
                                <input
                                    type="text"
                                    id="no-klasifikasi"
                                    name="no_klasifikasi"
                                    value={noKlasifikasi}
                                    onChange={(e) => setNoKlasifikasi(e.target.value)}
                                />
                            </div>
                            <div className="field-group">
                                <label htmlFor="penerbit">Penerbit</label>
                                <input
                                    type="text"
                                    id="penerbit"
                                    name="penerbit"
                                    value={penerbit}
                                    onChange={(e) => setPenerbit(e.target.value)}
                                />
                            </div>
                        </div>
                    </form>

                    <div className="pencarian-spesifik">
                        <a
                            href="#"
                            id="toggleSpesifik"
                            className={isSpesifikOpen ? 'active' : ''}
                            onClick={handleToggleSpesifik}
                        >
                            Pencarian Spesifik
                        </a>
                    </div>
                </div>
            </div>

            <main className="page-content">
                <div className="container search-results-section">

                    {/* hasil pencarian utama  atau kategori eratas */}
                    {searchResults !== null ? (
                        <div id="mainResults" dangerouslySetInnerHTML={{ __html: searchResults }} />
                    ) : (
                        topCategories
                    )}

                </div>
            </main>
        </>
    );
}

export default PencarianBukuMajalah;