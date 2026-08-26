import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import "./Pembina.css";

const Pembina = () => {
  const location = useLocation();
  const [pembinaList, setPembinaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPembina = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = import.meta.env.VITE_API_PENGELOAAN_KONTEN;
        if (!apiUrl) {
          throw new Error("URL API tidak dikonfigurasi");
        }

        const response = await fetch(`${apiUrl}/API/pembina`);
        if (!response.ok) {
          throw new Error("Gagal mengambil data pembina");
        }

        const data = await response.json();
        setPembinaList(data?.pembina || []);
      } catch (err) {
        console.error("Error fetching pembina:", err);
        setError("Gagal memuat data pembina. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchPembina();
  }, []);

  return (
    <>
      <Helmet>
        <title>Profil Pembina Perpustakaan Medayu Agung Surabaya</title>
        <meta
          name="description"
          content="Daftar pembina Perpustakaan Medayu Agung Surabaya."
        />
        <meta
          name="keywords"
          content="pembina perpustakaan medayu agung, profil pembina, perpustakaan surabaya, yayasan medayu agung"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Profil Pembina Perpustakaan Medayu Agung Surabaya" />
        <meta
          property="og:description"
          content="Daftar pembina Perpustakaan Medayu Agung Surabaya."
        />
        <meta property="og:locale" content="id_ID" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Profil Pembina Perpustakaan Medayu Agung Surabaya" />
        <meta
          name="twitter:description"
          content="Daftar pembina Perpustakaan Medayu Agung Surabaya."
        />
        
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Perpustakaan Medayu Agung Surabaya" />
        <link rel="canonical" href={`${window.location.origin}${location.pathname}`} />
      </Helmet>
      
      <main className="pembina-main">
      <div className="pembina-header">
        <h1 className="pembina-title">Pembina</h1>
      </div>

      <section className="pembina-section">
        {loading && (
          <div className="pembina-state">
            <div className="pembina-skeleton-grid">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="pembina-skeleton-card" />
              ))}
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="pembina-state pembina-state-error">
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
            {pembinaList.length === 0 ? (
              <div className="pembina-state">
                <p>Belum ada data pembina yang tersedia.</p>
              </div>
            ) : (
              <div className="pembina-grid">
                {pembinaList.map((pembina) => (
                  <article className="pembina-card" key={pembina.id}>
                    <div className="pembina-card-image">
                      {pembina.foto && (
                        <img
                          src={`${import.meta.env.VITE_API_PENGELOAAN_KONTEN}/images/anggota/${pembina.foto}`}
                          alt={pembina.nama}
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="pembina-card-body">
                      <h2 className="pembina-card-name">{pembina.nama}</h2>
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

export default Pembina;