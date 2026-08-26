import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import "./Pengurus.css";

const Pengurus = () => {
  const location = useLocation();
  const [pengurusList, setPengurusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPengurus = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = import.meta.env.VITE_API_PENGELOAAN_KONTEN;
        if (!apiUrl) {
          throw new Error("URL API tidak dikonfigurasi");
        }

        const response = await fetch(`${apiUrl}/API/pengurus`);
        if (!response.ok) {
          throw new Error("Gagal mengambil data pengurus");
        }

        const data = await response.json();
        setPengurusList(data?.pengurus || []);
      } catch (err) {
        console.error("Error fetching pengurus:", err);
        setError("Gagal memuat data pengurus. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchPengurus();
  }, []);

  return (
    <>
      <Helmet>
        <title>Profil Pengurus Perpustakaan Medayu Agung Surabaya</title>
        <meta
          name="description"
          content="Daftar pengurus Perpustakaan Medayu Agung Surabaya."
        />
        <meta
          name="keywords"
          content="pengurus perpustakaan medayu agung, profil pengurus, perpustakaan surabaya, yayasan medayu agung"
        />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Profil Pengurus Perpustakaan Medayu Agung Surabaya" />
        <meta
          property="og:description"
          content="Daftar pengurus Perpustakaan Medayu Agung Surabaya."
        />
        <meta property="og:locale" content="id_ID" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Profil Pengurus Perpustakaan Medayu Agung Surabaya" />
        <meta
          name="twitter:description"
          content="Daftar pengurus Perpustakaan Medayu Agung Surabaya."
        />
        
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Perpustakaan Medayu Agung Surabaya" />
        <link rel="canonical" href={`${window.location.origin}${location.pathname}`} />
      </Helmet>
      
      <main className="pengurus-main">
      <div className="pengurus-header">
        <h1 className="pengurus-title">Pengurus</h1>
      </div>

      <section className="pengurus-section">
        {loading && (
          <div className="pengurus-state">
            <div className="pengurus-skeleton-grid">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="pengurus-skeleton-card" />
              ))}
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="pengurus-state pengurus-state-error">
            <p>{error}</p>
            <button 
              className="retry-button" 
              onClick={() => window.location.reload()}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {pengurusList.length === 0 ? (
              <div className="pengurus-state">
                <p>Belum ada data pengurus yang tersedia.</p>
              </div>
            ) : (
              <div className="pengurus-grid">
                {pengurusList.map((pengurus) => (
                  <article className="pengurus-card" key={pengurus.id}>
                    <div className="pengurus-card-image">
                      {pengurus.foto && (
                        <img
                          src={`${import.meta.env.VITE_API_PENGELOAAN_KONTEN}/images/anggota/${pengurus.foto}`}
                          alt={pengurus.nama}
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="pengurus-card-body">
                      <h2 className="pengurus-card-name">{pengurus.nama}</h2>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <div style={{ height: "50px" }}></div>
    </main>
    </>
  );
};

export default Pengurus;
