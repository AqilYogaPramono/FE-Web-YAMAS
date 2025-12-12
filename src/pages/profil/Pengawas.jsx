import React, { useEffect, useState } from "react";
import "./Pengawas.css";

const Pengawas = () => {
  const [pengawasList, setPengawasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPengawas = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = import.meta.env.VITE_API_PENGELOAAN_KONTEN;
        if (!apiUrl) {
          throw new Error("URL API tidak dikonfigurasi");
        }

        const response = await fetch(`${apiUrl}/API/pengawas`);
        if (!response.ok) {
          throw new Error("Gagal mengambil data pengawas");
        }

        const data = await response.json();
        setPengawasList(data?.pengawas || []);
      } catch (err) {
        console.error("Error fetching pengawas:", err);
        setError("Gagal memuat data pengawas. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchPengawas();
  }, []);

  return (
    <main className="pengawas-main">
      <div className="pengawas-header">
        <h1 className="pengawas-title">Pengawas</h1>
      </div>

      <section className="pengawas-section">
        {loading && (
          <div className="pengawas-state">
            <div className="pengawas-skeleton-grid">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="pengawas-skeleton-card" />
              ))}
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="pengawas-state pengawas-state-error">
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
            {pengawasList.length === 0 ? (
              <div className="pengawas-state">
                <p>Belum ada data pengawas yang tersedia.</p>
              </div>
            ) : (
              <div className="pengawas-grid">
                {pengawasList.map((pengawas) => (
                  <article className="pengawas-card" key={pengawas.id}>
                    <div className="pengawas-card-image">
                      {pengawas.foto && (
                        <img
                          src={`${import.meta.env.VITE_API_PENGELOAAN_KONTEN}/images/anggota/${pengawas.foto}`}
                          alt={pengawas.nama}
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="pengawas-card-body">
                      <h2 className="pengawas-card-name">{pengawas.nama}</h2>
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
  );
};

export default Pengawas;
