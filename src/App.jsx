import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Beranda from "./pages/beranda/Beranda";
import Pembina from "./pages/profil/Pembina";
import Pengawas from "./pages/profil/Pengawas";
import Pengurus from "./pages/profil/Pengurus";
import Magang from "./pages/aktivitas/magang/Magang";
import DetailMagang from "./pages/aktivitas/magang/DetailMagang";
import Pengumuman from "./pages/aktivitas/pengumuman/Pengumuman";
import DetailPengumuman from "./pages/aktivitas/pengumuman/DetailPengumuman";
import Artikel from "./pages/aktivitas/artikel/Artikel";
import DetailArtikel from "./pages/aktivitas/artikel/DetailArtikel";
import KategoriArtikel from "./pages/aktivitas/artikel/KategoriArtikel";
import TagArtikel from "./pages/aktivitas/artikel/TagArtikel";
import Kunjungan from "./pages/aktivitas/kunjungan/Kunjungan";
import DetailKunjungan from "./pages/aktivitas/kunjungan/DetailKunjungan";
import PencarianBuku from "./pages/koleksi/Buku/PencarianBuku";
import DetailBuku from "./pages/koleksi/Buku/DetailBuku";
import PencarianMajalah from "./pages/koleksi/Majalah/PencarianMajalah";
import DetailMajalah from "./pages/koleksi/Majalah/DetailMajalah";
import PencarianKoran from "./pages/koleksi/Koran/PencarianKoran";


function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <div className="content">
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/pembina" element={<Pembina />} />
          <Route path="/pengawas" element={<Pengawas />} />
          <Route path="/pengurus" element={<Pengurus />} />
          <Route path="/magang" element={<Magang />} />
          <Route path="/detail-magang/:id" element={<DetailMagang />} />
          <Route path="/pengumuman" element={<Pengumuman />} />
          <Route path="/detail-pengumuman/:id" element={<DetailPengumuman />} />
          <Route path="/blog" element={<Artikel />} />
          <Route path="/blog/kategori/:id" element={<KategoriArtikel />} />
          <Route path="/blog/tag/:id" element={<TagArtikel />} />
          <Route path="/blog/:tautan" element={<DetailArtikel />} />
          <Route path="/kunjungan" element={<Kunjungan />} />
          <Route path="/detail-kunjungan/:id" element={<DetailKunjungan />} />
          <Route path="/buku" element={<PencarianBuku />} />
          <Route path="/buku/detail/:id" element={<DetailBuku />} />
          <Route path="/majalah" element={<PencarianMajalah />} />
          <Route path="/majalah/detail/:id" element={<DetailMajalah />} />
          <Route path="/koran" element={<PencarianKoran />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
