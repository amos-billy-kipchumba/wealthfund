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
                        <p>Khalifa City A, Street 24, Villa 198, Near Adnoc Petrol Station - Abu Dhabi - United Arab Emirates</p>
                      </div>
                      <div className="info info-address">
                        <div className="title">Phone number</div>
                        <p>Call us: +971 52 726 5884</p>
                      </div>
                      <div className="info info-address">
                        <div className="title">E-mail address</div>
                        <p>info@nyotafund.com</p>
                      </div>
                      <div className="info info-address">
                        <div className="title">Facebook</div>
                        <a href="https://www.facebook.com/share/1ADV58unu6/" target="_blank">https://www.facebook.com/share/1ADV58unu6/</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Embedded Google Map */}
            <section className="flat-row pdmap">
              <div className="gm-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29063.390423578305!2d54.55892717462802!3d24.41871458298452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e462f2e4c5579%3A0xf23be38de105ba6f!2sADNOC%20Service%20Station%20%7C%20Khalifa%20City%20(766)!5e0!3m2!1sen!2ske!4v1742765020954!5m2!1sen!2ske"
                  width="100%"
                  height="454"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

              </div>
            </section>
          </GuestLayout>
        </LayoutProvider>
      </PrimeReactProvider>
    </>
  );
}
