import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import LogoDesktop from "../assets/LogoAndText_medayuagung.webp";
import IconMobile from "../assets/icon_medayuagung.svg";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = (to) => {
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
      menuToggle.checked = false;
    }
    
    // Jika ada path yang diberikan, navigate ke path tersebut
    if (to && to !== location.pathname) {
      navigate(to);
    }
  };

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <Link to="/" className="nav-logo" onClick={() => closeMenu("/")}>
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

        {/* Desktop Menu */}
        <ul className="nav-links desktop-nav-links">
          <li>
            <NavLink to="/" className="nav-link">Beranda</NavLink>
          </li>

          <li className="dropdown">
            <span className="nav-link dropdown-toggle">
              Profil
              <svg className="dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <ul className="dropdown-menu">
              <li><NavLink to="/pembina" className="nav-link">Pembina</NavLink></li>
              <li><NavLink to="/pengawas" className="nav-link">Pengawas</NavLink></li>
              <li><NavLink to="/pengurus" className="nav-link">Pengurus</NavLink></li>
            </ul>
          </li>

          <li className="dropdown">
            <span className="nav-link dropdown-toggle">
              Aktivitas
              <svg className="dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <ul className="dropdown-menu">
              <li><NavLink to="/pengumuman" className="nav-link">Pengumuman</NavLink></li>
              <li><NavLink to="/blog" className="nav-link">Blog</NavLink></li>
              <li><NavLink to="/magang" className="nav-link">Magang</NavLink></li>
              <li><NavLink to="/kunjungan" className="nav-link">Kunjungan</NavLink></li>
            </ul>
          </li>

          <li className="dropdown">
            <span className="nav-link dropdown-toggle">
              Koleksi
              <svg className="dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <ul className="dropdown-menu">
              <li><a href="https://arsiponline.medayuagung.my.id/" target="_blank" rel="noopener noreferrer" className="nav-link">Arsip Online</a></li>
              <li><NavLink to="/buku" className="nav-link">Buku</NavLink></li>
              <li><NavLink to="/majalah" className="nav-link">Majalah</NavLink></li>
              <li><NavLink to="/koran" className="nav-link">Koran</NavLink></li>
            </ul>
          </li>
        </ul>

        {/* Mobile Menu */}
        <div className="mobile-menu-wrapper">
          <div className="mobile-menu-header">
            <span className="mobile-menu-title">Menu</span>
            <label htmlFor="menu-toggle" className="mobile-menu-close" aria-label="Close menu">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </label>
          </div>
          <ul className="nav-links mobile-nav-links">
          <li>
            <NavLink to="/" className="nav-link" onClick={() => closeMenu("/")}>Beranda</NavLink>
          </li>

          <li className="dropdown">
            <input type="checkbox" id="dropdown-profil" className="dropdown-checkbox" />
            <label htmlFor="dropdown-profil" className="nav-link dropdown-toggle">
              <span>Profil</span>
              <svg className="dropdown-icon" width="18" height="18" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: 'block'}}>
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </label>
            <ul className="dropdown-menu">
              <li><NavLink to="/pembina" className="nav-link" onClick={() => closeMenu("/pembina")}>Pembina</NavLink></li>
              <li><NavLink to="/pengawas" className="nav-link" onClick={() => closeMenu("/pengawas")}>Pengawas</NavLink></li>
              <li><NavLink to="/pengurus" className="nav-link" onClick={() => closeMenu("/pengurus")}>Pengurus</NavLink></li>
            </ul>
          </li>

          <li className="dropdown">
            <input type="checkbox" id="dropdown-aktivitas" className="dropdown-checkbox" />
            <label htmlFor="dropdown-aktivitas" className="nav-link dropdown-toggle">
              <span>Aktivitas</span>
              <svg className="dropdown-icon" width="18" height="18" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: 'block'}}>
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </label>
            <ul className="dropdown-menu">
              <li><NavLink to="/pengumuman" className="nav-link" onClick={() => closeMenu("/pengumuman")}>Pengumuman</NavLink></li>
              <li><NavLink to="/blog" className="nav-link" onClick={() => closeMenu("/blog")}>Blog</NavLink></li>
              <li><NavLink to="/magang" className="nav-link" onClick={() => closeMenu("/magang")}>Magang</NavLink></li>
              <li><NavLink to="/kunjungan" className="nav-link" onClick={() => closeMenu("/kunjungan")}>Kunjungan</NavLink></li>
            </ul>
          </li>

          <li className="dropdown">
            <input type="checkbox" id="dropdown-koleksi" className="dropdown-checkbox" />
            <label htmlFor="dropdown-koleksi" className="nav-link dropdown-toggle">
              <span>Koleksi</span>
              <svg className="dropdown-icon" width="18" height="18" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: 'block'}}>
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </label>
            <ul className="dropdown-menu">
              <li><a href="https://arsiponline.medayuagung.my.id/" target="_blank" rel="noopener noreferrer" className="nav-link" onClick={() => closeMenu()}>Arsip Online</a></li>
              <li><NavLink to="/buku" className="nav-link" onClick={() => closeMenu("/buku")}>Buku</NavLink></li>
              <li><NavLink to="/majalah" className="nav-link" onClick={() => closeMenu("/majalah")}>Majalah</NavLink></li>
              <li><NavLink to="/koran" className="nav-link" onClick={() => closeMenu("/koran")}>Koran</NavLink></li>
            </ul>
          </li>
        </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
