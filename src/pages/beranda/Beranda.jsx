import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import "./Beranda.css";
import SliderImage from "../../assets/slider.webp";
import Slide1 from "../../assets/1.webp";
import QrCodeDonasi from "../../assets/QRIS.jpeg";

function Beranda() {
  const [slides, setSlides] = useState([SliderImage]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showDots, setShowDots] = useState(false);
  const [isWrapping, setIsWrapping] = useState(false);
  const sliderRef = useRef(null);
  const startXRef = useRef(0);
  const dotsTimeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const wrapTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchHalamanUtama = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_PENGELOAAN_KONTEN}/API/halaman-utama`);
        if (!response.ok) {
          throw new Error("Gagal mengambil data halaman utama");
        }

        const data = await response.json();
        const halamanUtama = data?.halaman_utama || [];
        
        const sortedHalamanUtama = halamanUtama.sort((a, b) => a.urutan - b.urutan);
        
        const apiSlides = sortedHalamanUtama.map((item) => 
          `${import.meta.env.VITE_API_PENGELOAAN_KONTEN}/images/halaman-utama/${item.foto}`
        );
        
        setSlides([SliderImage, ...apiSlides]);
      } catch (err) {
        console.error(err);
        setSlides([SliderImage]);
      }
    };

    fetchHalamanUtama();
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || isPaused || isDragging) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex === slides.length - 1) {
          return 0;
        }
        return prevIndex + 1;
      });
      setShowDots(false);
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [slides.length, isPaused, isDragging]);

  useEffect(() => {
    if (slides.length <= 1) return;

    if (dotsTimeoutRef.current) {
      clearTimeout(dotsTimeoutRef.current);
    }

    dotsTimeoutRef.current = setTimeout(() => {
      setShowDots(false);
    }, 3000);

    return () => {
      if (dotsTimeoutRef.current) {
        clearTimeout(dotsTimeoutRef.current);
      }
      if (wrapTimeoutRef.current) {
        clearTimeout(wrapTimeoutRef.current);
      }
    };
  }, [currentIndex, slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setShowDots(true);
    
    if (dotsTimeoutRef.current) {
      clearTimeout(dotsTimeoutRef.current);
    }
    
    dotsTimeoutRef.current = setTimeout(() => {
      setShowDots(false);
    }, 3000);
  };

  const showDotsTemporarily = () => {
    setShowDots(true);
    
    if (dotsTimeoutRef.current) {
      clearTimeout(dotsTimeoutRef.current);
    }
    
    dotsTimeoutRef.current = setTimeout(() => {
      setShowDots(false);
    }, 3000);
  };

  const handleTouchStart = (e) => {
    if (slides.length <= 1) return;
    startXRef.current = e.touches[0].clientX;
    setIsDragging(true);
    setIsPaused(true);
    showDotsTemporarily();
  };

  const handleTouchMove = (e) => {
    if (!isDragging || slides.length <= 1) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    if (!isDragging || slides.length <= 1) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startXRef.current - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= slides.length) {
            setIsWrapping(true);
            if (wrapTimeoutRef.current) {
              clearTimeout(wrapTimeoutRef.current);
            }
            wrapTimeoutRef.current = setTimeout(() => {
              setIsWrapping(false);
            }, 50);
            return 0;
          }
          return nextIndex;
        });
      } else {
        setCurrentIndex((prevIndex) => {
          const prevIndexNew = prevIndex - 1;
          if (prevIndexNew < 0) {
            setIsWrapping(true);
            if (wrapTimeoutRef.current) {
              clearTimeout(wrapTimeoutRef.current);
            }
            wrapTimeoutRef.current = setTimeout(() => {
              setIsWrapping(false);
            }, 50);
            return slides.length - 1;
          }
          return prevIndexNew;
        });
      }
      showDotsTemporarily();
    }

    setIsDragging(false);
    setIsPaused(false);
  };

  const handleMouseDown = (e) => {
    if (slides.length <= 1) return;
    startXRef.current = e.clientX;
    setIsDragging(true);
    setIsPaused(true);
    showDotsTemporarily();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || slides.length <= 1) return;
    e.preventDefault();
  };

  const handleMouseUp = (e) => {
    if (!isDragging || slides.length <= 1) return;
    const endX = e.clientX;
    const diff = startXRef.current - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= slides.length) {
            setIsWrapping(true);
            if (wrapTimeoutRef.current) {
              clearTimeout(wrapTimeoutRef.current);
            }
            wrapTimeoutRef.current = setTimeout(() => {
              setIsWrapping(false);
            }, 50);
            return 0;
          }
          return nextIndex;
        });
      } else {
        setCurrentIndex((prevIndex) => {
          const prevIndexNew = prevIndex - 1;
          if (prevIndexNew < 0) {
            setIsWrapping(true);
            if (wrapTimeoutRef.current) {
              clearTimeout(wrapTimeoutRef.current);
            }
            wrapTimeoutRef.current = setTimeout(() => {
              setIsWrapping(false);
            }, 50);
            return slides.length - 1;
          }
          return prevIndexNew;
        });
      }
      showDotsTemporarily();
    }

    setIsDragging(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleMouseMoveEvent = (e) => handleMouseMove(e);
    const handleMouseUpEvent = (e) => handleMouseUp(e);
    const handleMouseLeave = () => {
      setIsDragging(false);
      setIsPaused(false);
    };

    if (isDragging) {
      slider.addEventListener('mousemove', handleMouseMoveEvent);
      slider.addEventListener('mouseup', handleMouseUpEvent);
      slider.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      slider.removeEventListener('mousemove', handleMouseMoveEvent);
      slider.removeEventListener('mouseup', handleMouseUpEvent);
      slider.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDragging]);

  return (
    <>
      <Helmet>
        <title>Perpustakaan Medayu Agung Surabaya Koleksi Koran Lama, Kliping Koran, Majalah Lama, Buku Langka dan Arsip Sejarah</title>
        <meta
          name="description"
          content="Perpustakaan Medayu Agung di Surabaya menyimpan koleksi buku langka, koran lama, majalah lama, dan arsip sejarah Indonesia. Terletak di Jalan Medayu Selatan, perpustakaan ini buka setiap hari Senin-Sabtu dan terbuka untuk umum."
        />
        <meta
          name="keywords"
          content="perpustakaan medayu agung, perpustakaan surabaya, buku langka, koran lama, majalah lama, arsip sejarah indonesia, kliping koran, koleksi sejarah"
        />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Perpustakaan Medayu Agung Surabaya - Koleksi Langka & Arsip Sejarah" />
        <meta
          property="og:description"
          content="Perpustakaan Medayu Agung di Surabaya menyimpan koleksi buku langka, koran lama, majalah lama, dan arsip sejarah Indonesia. Terletak di Jalan Medayu Selatan, perpustakaan ini buka setiap hari Senin-Sabtu dan terbuka untuk umum."
        />
        <meta property="og:locale" content="id_ID" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Perpustakaan Medayu Agung Surabaya - Koleksi Buku Langka & Arsip Sejarah" />
        <meta
          name="twitter:description"
          content="Perpustakaan Medayu Agung di Surabaya menyimpan koleksi buku langka, koran lama, majalah lama, dan arsip sejarah Indonesia."
        />
        
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Perpustakaan Medayu Agung Surabaya" />
        <link rel="canonical" href={window.location.origin} />
      </Helmet>
      
      <main>
      <section 
        className="hero-slider"
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => {
          showDotsTemporarily();
        }}
        onMouseLeave={() => {
          if (dotsTimeoutRef.current) {
            clearTimeout(dotsTimeoutRef.current);
          }
          dotsTimeoutRef.current = setTimeout(() => {
            setShowDots(false);
          }, 2000);
        }}
      >
        <div className={`slider-container ${isWrapping ? 'no-transition' : ''}`}>
        {slides.map((img, index) => (
          <div
            key={index}
              className={`slide ${index === currentIndex ? 'active' : ''}`}
              style={{ 
                backgroundImage: `url(${img})`,
                transform: `translateX(${(index - currentIndex) * 100}%)`
              }}
          ></div>
        ))}
        </div>
        {slides.length > 1 && (
          <div className={`slider-dots ${showDots ? 'visible' : 'hidden'}`}>
            {slides.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      <section className="tentang-section">
        <div className="container">
          <h2>Tentang Perpustakaan Medayu Agung</h2>

          <div className="tentang-box">
            <div className="tentang-image">
              <img src={Slide1} alt="Perpustakaan" />
            </div>

            <div className="tentang-text">
              <p>
                Perpustakaan Medayu Agung Surabaya didirikan pada tahun 2001 oleh
                Yayasan Medayu Agung Surabaya dalam upaya turut serta untuk
                mencerdaskan kehidupan bangsa. Perpustakaan Medayu Agung disahkan
                berdasarkan Keputusan Menteri Hukum dan Hak Asasi Manusia Republik
                Indonesia Nomor AHU-0000761.AH.01.05. Tahun 2019. Nama "Medayu
                Agung" memiliki makna kebajikan dan kebijaksanaan untuk tujuan
                yang besar.
              </p>
            </div>
          </div>

          <div className="tentang-text-full">
            <p>
              Koleksi yang dimiliki oleh Perpustakaan Medayu Agung pada awalnya
              berasal dari koleksi pribadi milik Bapak Oei Hiem Hwie. Koleksi
              terkini berjumlah kurang lebih 10.000 eksemplar, belum termasuk
              surat kabar, majalah dan foto-foto sejarah sejak tahun 1800-an.
            </p>
          </div>
        </div>
      </section>

      <section className="tujuan-section">
        <div className="container">
          <h2>Tujuan</h2>
          <ol className="tujuan-list">
            <li>
              Mengembangkan dan membantu masyarakat dalam usaha mencerdaskan
              kehidupan bangsa.
            </li>
            <li>
              Ikut berperan secara aktif dalam perkembangan seni, budaya, dan
              pelestarian sejarah Indonesia.
            </li>
            <li>
              Ikut mendidik generasi muda mencintai ilmu pengetahuan.
            </li>
          </ol>
        </div>
      </section>

      <section className="support-section">
        <div className="container">
          <h2>Support kegiatan kami</h2>

          <div className="support-content">
            <div className="qr-box">
              <img
                src={QrCodeDonasi}
                alt="QR Code Donasi"
              />
            </div>
            
            <div className="bank-info">
              <p className="bank-description">Transfer ke bank dapat menggunakan:</p>
              <h3>Bank BCA</h3>
              <p className="account-number">822-2788322</p>
              <p className="account-name">a.n. Yayasan Medayu Agung</p>
            </div>
          </div>

          <p className="support-note">Harap konfirmasi ke WhatsApp setelah melakukan donasi</p>

        </div>
      </section>

    </main>
    </>
  );
}

export default Beranda;
