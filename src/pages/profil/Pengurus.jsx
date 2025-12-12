import React, { useEffect, useState } from "react";
import "./Pengurus.css";

const Pengurus = () => {
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
  );
};

export default Pengurus;
