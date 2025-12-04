import React from 'react';
import './DetailMajalah.css'; 

const collectionData = {
    title: "Kuat Melebihi Maut",
    edition: "Januari 2020",
    classificationNo: "813.54 PRO b",
    language: "Indonesia",
    publicationYear: 1980,
    publicationPlace: "Jakarta",
    publisher: "Tempo",
    location: "Lantai 1, Ruangan Koleksi Khusus, Rak 4",
    availability: "Tersedia",
    synopsis: "Majalah ini membahas mengenai Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
};

function DetailMajalah() {

    const handleBack = (e) => {
        e.preventDefault();
        window.history.back();
    };

    const metadata = [
        { label: "Edisi", value: collectionData.edition },
        { label: "No. Klasifikasi", value: collectionData.classificationNo },
        { label: "Bahasa", value: collectionData.language },
        { label: "Tahun Terbit", value: collectionData.publicationYear },
        { label: "Tempat Terbit", value: collectionData.publicationPlace },
        { label: "Penerbit", value: collectionData.publisher },
        { label: "Lokasi", value: collectionData.location },
    ];
    
    const availabilityColor = collectionData.availability === 'Tersedia' ? '#5cb85c' : '#dc3545';

    return (
        <main className="page-content">
            <div className="container">
                
                <div className="detail-card">
                    
                    {/* tombol back */}
                    <a 
                        href="/koleksi/pencarian"
                        className="back-button" 
                        title="Kembali ke Hasil Pencarian" 
                        onClick={handleBack}
                    >
                        <span className="material-symbols-rounded">arrow_back</span>
                    </a>

                    <div className="cover-section">
                        <div className="book-cover-placeholder">
                            [Gambar Sampul Koleksi]
                        </div>
                    </div>

                    <div className="info-section">
                        <h1 className="info-title">{collectionData.title}</h1>
                        
                        <table className="metadata-table">
                            <tbody>
                                {metadata.map((item, index) => (
                                    <tr key={index}>
                                        <td className="label">{item.label}</td>
                                        <td className="separator">:</td>
                                        <td className="value">{item.value}</td>
                                    </tr>
                                ))}
                                
                                <tr>
                                    <td className="label">Ketersediaan</td>
                                    <td className="separator">:</td>
                                    <td 
                                        className="value" 
                                        style={{ fontWeight: 700, color: availabilityColor }}
                                    >
                                        {collectionData.availability}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <div className="sinopsis-box">
                            <h3>Sinopsis</h3>
                            <p>{collectionData.synopsis}</p>
                        </div>

                    </div>
                </div>

            </div>
        </main>
    );
}

export default DetailMajalah;