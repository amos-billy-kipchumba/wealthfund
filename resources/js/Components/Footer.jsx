import React from 'react';
import { Link } from '@inertiajs/react';
import "../../css/index.scss";

function Footer() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('subscribe-email').value;
    // Implement subscription logic here
    console.log(`Subscribing email: ${email}`);
    // You would typically make an API call here
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <footer id="footer">
        <div className="footer-widgets">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="widget-infomation">
                  <ul className="infomation-footer">
                    <li>
                      <i className="fa fa-envelope" aria-hidden="true" />
                      <a href="mailto:support@themesflat.com" title="Email Support">
                        info@nyotafund.com
                      </a>
                    </li>
                    <li>
                      <i className="fa fa-phone" aria-hidden="true" />
                      <a href="tel:+61383766284" title="Call Us">
                        +971 52 726 5884
                      </a>
                    </li>
                    <li>
                      <i className="fa fa-map-marker" aria-hidden="true" />
                      <a href="https://maps.google.com/?q=PO Box 16122 Collins Street West Victoria 8007 Australia" target="_blank" rel="noopener noreferrer" title="Our Location">
                      Khalifa City A, Street 24, Villa 198, Near Adnoc Petrol Station - Abu Dhabi - United Arab Emirates
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row widget-box">
              <div className="col-md-4">
                <div className="widget widget-text">
                  <p>
                  Platforms like Nyota make investing in money market funds and other financial assets easy and accessible.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="widget widget-services">
                  <ul className="one-half first">
                    <li>
                      <Link href={route('home')} title="Home">Home</Link>
                    </li>
                    <li>
                      <Link href={route('about')} title="About Us">About Us</Link>
                    </li>
                  </ul>
                  <ul className="one-half">
                    <li>
                      <Link href={route('services')} title="Services">Services</Link>
                    </li>
                    <li>
                      <Link href={route('login')} title="Services">Login</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-4">
                <div className="widget widget-subscribe">
                  <form
                    id="subscribe-form"
                    onSubmit={handleSubmit}
                    method="post"
                    acceptCharset="utf-8"
                    data-mailchimp="true"
                  >
                    <div id="subscribe-content">
                      <label htmlFor="subscribe-email">Email address:</label>
                      <div className="input-email">
                        <input
                          type="email"
                          name="email-form"
                          id="subscribe-email"
                          placeholder="Your email address"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        id="subscribe-button"
                        className="button-subscribe px-4 text-white"
                      >
                        SUBMIT
                      </button>
                    </div>
                    <div id="subscribe-msg" />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="copyright">
                  <p>
                    Copyright {new Date().getFullYear()}{" "}
                    <a href="https://themesflat.com" target="_blank" rel="noopener noreferrer" title="ThemesFlat">
                    Nyotafund
                    </a>
                  </p>
                </div>
                <ul className="menu-footer">
                  <li>
                    <Link href={route('home')} title="Home">Home</Link>
                  </li>
                  <li>
                    <Link href={route('register')} title="Invest">Start investing</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="button-go-top">
        <a href="#" onClick={scrollToTop} title="Go to top" className="go-top">
          <i className="fa fa-chevron-up" />
        </a>
      </div>
    </>
  );
}

export default Footer;