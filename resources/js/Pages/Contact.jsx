import { Link, Head, usePage } from "@inertiajs/react";
import { PrimeReactProvider } from "primereact/api";
import { LayoutProvider } from "@/Layouts/layout/context/layoutcontext.jsx";
import GuestLayout from "@/Layouts/GuestLayout";
import React from "react";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
  return (
    <>
      <PrimeReactProvider>
        <LayoutProvider>
          <Head title="Welcome" />
          <GuestLayout>
            <div className="page-title">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="page-title-heading">
                      <h1 className="h1-title">Contact</h1>
                    </div>
                    <ul className="breadcrumbs">
                      <li>
                        <a href="#" title="">
                          Home <i className="fa fa-angle-right" aria-hidden="true" />
                        </a>
                      </li>
                      <li>
                        <a href="#" title="">Contact</a>
                      </li>
                    </ul>
                    <div className="clearfix" />
                  </div>
                </div>
              </div>
            </div>

            <section className="flat-row pd-contact-v1">
              <div className="container">
                <div className="row">
                  <div className="col-md-4">
                    <div className="contact-info">
                      <div className="info info-address">
                        <div className="title">Address</div>
                        <p>PO Box 16122 Collins Street West, Victoria 8007, Australia</p>
                      </div>
                      <div className="info info-address">
                        <div className="title">Phone number</div>
                        <p>Call us: 190 140 2468</p>
                      </div>
                      <div className="info info-address">
                        <div className="title">E-mail address</div>
                        <p>support@themesflat.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="flat-form-info">
                      <form id="contactform" method="post" action="https://themesflat.co/html/finance/contact/contact-process.php" noValidate className="form-info">
                        <div className="one-half v3">
                          <p className="input-info">
                            <input type="text" name="name" placeholder="Name" required />
                          </p>
                          <p className="input-info">
                            <input type="email" name="email" placeholder="Email" required />
                          </p>
                          <p className="input-info">
                            <input type="text" name="subject" placeholder="Subject" required />
                          </p>
                          <p className="input-info">
                            <button type="submit" className="submit">Send Message</button>
                          </p>
                        </div>
                        <div className="one-half v4">
                          <p className="input-info">
                            <textarea id="message-contact" name="message" placeholder="Message" required />
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Embedded Google Map */}
            <section className="flat-row pdmap">
              <div className="gm-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24191.41880340991!2d-74.005974!3d40.712776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z0KHQqNCQ!5e0!3m2!1sen!2sus!4v1711043543427"
                  width="100%"
                  height="454"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </section>
          </GuestLayout>
        </LayoutProvider>
      </PrimeReactProvider>
    </>
  );
}
