import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";
import LogoDesktop from "../assets/LogoAndText_medayuagung.webp";
import IconMobile from "../assets/icon_medayuagung.svg";

function Navbar() {
  const closeMenu = () => {
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
      menuToggle.checked = false;
    }
  };

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img src={LogoDesktop} alt="Medayu Agung" className="nav-logo-desktop" />
          <img src={IconMobile} alt="Medayu Agung" className="nav-logo-mobile" />
        </Link>

        <input type="checkbox" id="menu-toggle" className="menu-toggle" />
        <label htmlFor="menu-toggle" className="hamburger" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </label>

        <label htmlFor="menu-toggle" className="nav-overlay"></label>

        <ul className="nav-links">
          <li>
            <NavLink to="/" className="nav-link" onClick={closeMenu}>Beranda</NavLink>
          </li>

          <li className="dropdown">
            <input type="checkbox" id="dropdown-profil" className="dropdown-checkbox" />
            <label htmlFor="dropdown-profil" className="nav-link dropdown-toggle">
              Profil
              <svg className="dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </label>
            <ul className="dropdown-menu">
              <li><NavLink to="/pembina" className="nav-link" onClick={closeMenu}>Pembina</NavLink></li>
              <li><NavLink to="/pengawas" className="nav-link" onClick={closeMenu}>Pengawas</NavLink></li>
              <li><NavLink to="/pengurus" className="nav-link" onClick={closeMenu}>Pengurus</NavLink></li>
            </ul>
          </li>

          <li className="dropdown">
            <input type="checkbox" id="dropdown-aktivitas" className="dropdown-checkbox" />
            <label htmlFor="dropdown-aktivitas" className="nav-link dropdown-toggle">
              Aktivitas
              <svg className="dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </label>
            <ul className="dropdown-menu">
              <li><NavLink to="/pengumuman" className="nav-link" onClick={closeMenu}>Pengumuman</NavLink></li>
              <li><NavLink to="/blog" className="nav-link" onClick={closeMenu}>Blog</NavLink></li>
              <li><NavLink to="/magang" className="nav-link" onClick={closeMenu}>Magang</NavLink></li>
              <li><NavLink to="/kunjungan" className="nav-link" onClick={closeMenu}>Kunjungan</NavLink></li>
            </ul>
          </li>

          <li className="dropdown">
            <input type="checkbox" id="dropdown-koleksi" className="dropdown-checkbox" />
            <label htmlFor="dropdown-koleksi" className="nav-link dropdown-toggle">
              Koleksi
              <svg className="dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </label>
            <ul className="dropdown-menu">
              <li><a href="https://arsiponline.medayuagung.my.id/" target="_blank" rel="noopener noreferrer" className="nav-link" onClick={closeMenu}>Arsip Online</a></li>
              <li><NavLink to="/buku" className="nav-link" onClick={closeMenu}>Buku</NavLink></li>
              <li><NavLink to="/majalah" className="nav-link" onClick={closeMenu}>Majalah</NavLink></li>
              <li><NavLink to="/koran" className="nav-link" onClick={closeMenu}>Koran</NavLink></li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
