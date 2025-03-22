import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import "../../css/index.scss";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="boxed">
      {isLoading && (
        <div className="preloader">
          <div className="clear-loading loading-effect-2"><span /></div>
        </div>
      )}

      <div className="top">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <ul className="flat-infomation">
                <li className="phone">
                  Call us: <a href="tel:+971527265884">+971 52 726 5884</a>
                </li>
                <li className="email">
                  Email: <a href="mailto:info@nyotafund.com">info@nyotafund.com</a>
                </li>
              </ul>
              <div className="flat-questions">
                <Link href={route('contact-us')} className="questions">Have any questions?</Link>
                <Link href={route('register')} className="appointment">START INVESTING</Link>
              </div>
              <div className="clearfix" />
            </div>
          </div>
        </div>
      </div>

      <header id="header" className={`header bg-color ${isFixed ? 'fixed-header' : ''}`}
        style={isFixed ? {
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          transition: 'all 0.3s ease-in-out', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        } : {}}
      >
        <div className="container">
          <div className="row">
            <div className="header-wrap">
              <div className="col-md-2">
                <div id="logo" className="logo">
                  <Link href={route('home')} title="Financial Solutions">
                    <img src="/images/logo/logo.png" className='h-16 my-auto' alt="Finance Business Logo" />
                  </Link>
                </div>
              </div>
              <div className="col-md-10">
                <div className="nav-wrap">
                  <div className={`btn-menu ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}><span /></div>
                  <nav id="mainnav" className={`mainnav ${isMenuOpen && 'open'}`}>
                    <ul className="menu">
                      <li><Link href={route('home')} className="ekit-menu-nav-link">Home</Link></li>
                      <li><Link href={route('about')} className="ekit-menu-nav-link">About</Link></li>
                      <li><Link href={route('services')} className="ekit-menu-nav-link">Services</Link></li>
                      <li><Link href={route('contact-us')} className="ekit-menu-nav-link">Contact</Link></li>
                      <li><Link href={route('login')} className="ekit-menu-nav-link">Login</Link></li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;