import { useState, useEffect } from "react";
import { Link, Head, router, usePage } from "@inertiajs/react";
import {
  LayoutContext,
  LayoutProvider,
} from "@/Layouts/layout/context/layoutcontext.jsx";
import { PrimeReactProvider } from "primereact/api";
import React, { useContext } from "react";
import GuestLayout from "@/Layouts/GuestLayout";


export default function Welcome({ auth, laravelVersion, phpVersion }) {

  const { flash, pagination } = usePage().props;
  
  
  return (
    <>
      <PrimeReactProvider>
        <LayoutProvider>
          <Head title="Welcome" />
          <GuestLayout>
          <>
            <div className="page-title">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="page-title-heading">
                      <h1 className="h1-title">Overview</h1>
                    </div>
                    {/* /.page-title-heading */}
                    <ul className="breadcrumbs">
                      <li>
                        <a href="#" title="">
                          Home
                          <i className="fa fa-angle-right" aria-hidden="true" />
                        </a>
                      </li>
                      <li>
                        <a href="#" title="">
                          About
                          <i className="fa fa-angle-right" aria-hidden="true" />
                        </a>
                      </li>
                      <li>
                        <a href="#" title="">
                          Overview
                        </a>
                      </li>
                    </ul>
                    {/* /.breadcrumbs */}
                    <div className="clearfix" />
                    {/* /.clearfix */}
                  </div>
                </div>
              </div>
            </div>
            {/* /.page-title */}
            <section className="flat-row pd-aboutv3 ">
              <div className="container">
                <div className="row flat-tabs" data-effect="fadeIn">
                  <div className="col-md-3">
                    <div className="sidebar left">
                      {/* /.widget_nav_menu */}
                      <aside className="widget widget-brochure services">
                        <div className="brochure-box-title">
                          <h5 className="brochure-title">Our History</h5>
                          <p>
                            We started our financial prospectus since 2012
                          </p>
                        </div>
                      </aside>
                      {/* /.widget-brochure */}
                    </div>
                    {/* /.sidebar */}
                  </div>{" "}
                  {/* /.col-md-3 */}
                  <div className="col-md-9 content-tab">
                    <div className="content-inner">
                    <div className="wrap-main-post about-v3">
                      <div className="flexslider s2">
                        <div className="flat-slides">
                          <img src="/images/about/s01.jpg" className="w-full object-cover object-center" alt="NyotaFund" />
                        </div>
                      </div>

                      <div className="box-content">
                        <div className="title">Want to know more about NyotaFund?</div>
                        <p>
                          <strong>Embrace the Future of Savings:</strong> Investing in Money Market Funds with Nyota
                          <br />
                          Forget traditional savings accounts – Kenya's thriving money market funds offer low risk, high liquidity, and steady returns. Platforms like Nyota make investing in money market funds and other financial assets easy and accessible. This guide walks you through the process of investing in NyotaFund, helping you embark on your investment journey with confidence.
                        </p>
                        <div className="dividers dividers-bc-v4" />
                      </div>

                      {/* Timeline Section */}
                      <div className="flat-text-block-timeline">
                        <div className="year">2012</div>
                        <div className="flat-timeline-content">
                          <div className="box-content">
                            <div className="title">The Beginning – A Small Service with a Big Vision</div>
                            <p>
                              NyotaFund started with a simple yet powerful idea: to provide a financial service that was missing in the market.
                              With no certainty about the future, the founding team believed in offering investment solutions that made wealth building accessible to all.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flat-text-block-timeline">
                        <div className="year">2013</div>
                        <div className="flat-timeline-content">
                          <div className="box-content">
                            <div className="title">Digital Expansion – Website & Online Marketing</div>
                            <p>
                              As the company grew, it embraced digital transformation, launching its website and integrating SEO marketing strategies
                              to reach more investors. This step laid the foundation for NyotaFund to become a tech-driven investment platform.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flat-text-block-timeline">
                        <div className="year">Today</div>
                        <div className="flat-timeline-content">
                          <div className="box-content">
                            <div className="title">NyotaFund Today – A Leading Money Market Investment Platform</div>
                            <p>
                              Kenya's financial landscape is evolving, and NyotaFund remains at the forefront by offering seamless access to money market funds.
                              With low-risk, high-liquidity investment options, NyotaFund is transforming traditional savings into a smarter financial future.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                      {/* /.wrap-main-post */}
                    </div>
     
                  </div>{" "}
                  {/* /.col-md-9 */}
                </div>
                {/* /.row */}
              </div>
              {/* /.container */}
            </section>
          </>

          </GuestLayout>
        </LayoutProvider>
      </PrimeReactProvider>
    </>
  );
}
