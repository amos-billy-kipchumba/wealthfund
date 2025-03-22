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
          <Head title="Services" />
          <GuestLayout>
          <>
  <div className="page-title">
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="page-title-heading">
            <h1 className="h1-title">Services Grid</h1>
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
                Services
                <i className="fa fa-angle-right" aria-hidden="true" />
              </a>
            </li>
            <li>
              <a href="#" title="">
                Services Grid
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
  <section className="flat-row pd-services-post">
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="title-section center s1">
            <h2>What We Can Offer You </h2>
            <p className="sub-title-section">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor
              <br />
              incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          {/* /.title-section */}
          <div className="dividers dividers-imagebox" />
        </div>
      </div>
      {/* /.row */}
      <div className="row">
        <div className="col-md-12">
          <div className="wrap-imagebox-grid">
            <div className="flat-imagebox services-grid item">
              <div className="flat-imagebox-inner">
                <div className="flat-imagebox-image">
                  <img src="images/imagebox/04.jpg" alt="img" />
                </div>
                <div className="flat-imagebox-header">
                  <h3 className="flat-imagebox-title">
                    <a href="#">Mutual Funds</a>
                  </h3>
                </div>
                <div className="flat-imagebox-content">
                  <div className="flat-imagebox-desc">
                    Mutual funds pool money from many investors to purchase
                    broad range of investments, such as stocks.
                  </div>
                  <div className="flat-imagebox-button">
                    <a href="#" target="_blank">
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* /.item .flat-imagebox */}
            <div className="flat-imagebox services-grid item">
              <div className="flat-imagebox-inner">
                <div className="flat-imagebox-image">
                  <img src="images/imagebox/05.jpg" alt="img" />
                </div>
                <div className="flat-imagebox-header">
                  <h3 className="flat-imagebox-title">
                    <a href="#">Investment Planning</a>
                  </h3>
                </div>
                <div className="flat-imagebox-content">
                  <div className="flat-imagebox-desc">
                    Mutual funds pool money from many investors to purchase
                    broad range of investments, such as stocks.
                  </div>
                  <div className="flat-imagebox-button">
                    <a href="#" target="_blank">
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* /.item .flat-imagebox */}
            <div className="flat-imagebox services-grid item">
              <div className="flat-imagebox-inner">
                <div className="flat-imagebox-image">
                  <img src="images/imagebox/06.jpg" alt="img" />
                </div>
                <div className="flat-imagebox-header">
                  <h3 className="flat-imagebox-title">
                    <a href="#">Personal Insurance</a>
                  </h3>
                </div>
                <div className="flat-imagebox-content">
                  <div className="flat-imagebox-desc">
                    Mutual funds pool money from many investors to purchase
                    broad range of investments, such as stocks.
                  </div>
                  <div className="flat-imagebox-button">
                    <a href="#" target="_blank">
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* /.item .flat-imagebox */}
            <div className="flat-imagebox services-grid item">
              <div className="flat-imagebox-inner">
                <div className="flat-imagebox-image">
                  <img src="images/imagebox/07.jpg" alt="img" />
                </div>
                <div className="flat-imagebox-header">
                  <h3 className="flat-imagebox-title">
                    <a href="#">Industrial Insurance</a>
                  </h3>
                </div>
                <div className="flat-imagebox-content">
                  <div className="flat-imagebox-desc">
                    Mutual funds pool money from many investors to purchase
                    broad range of investments, such as stocks.
                  </div>
                  <div className="flat-imagebox-button">
                    <a href="#" target="_blank">
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* /.item .flat-imagebox */}
            <div className="flat-imagebox services-grid item">
              <div className="flat-imagebox-inner">
                <div className="flat-imagebox-image">
                  <img src="images/imagebox/08.jpg" alt="img" />
                </div>
                <div className="flat-imagebox-header">
                  <h3 className="flat-imagebox-title">
                    <a href="#">INVESTMENT IN BONDS</a>
                  </h3>
                </div>
                <div className="flat-imagebox-content">
                  <div className="flat-imagebox-desc">
                    Mutual funds pool money from many investors to purchase
                    broad range of investments, such as stocks.
                  </div>
                  <div className="flat-imagebox-button">
                    <a href="#" target="_blank">
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* /.item .flat-imagebox */}
            <div className="flat-imagebox services-grid item">
              <div className="flat-imagebox-inner">
                <div className="flat-imagebox-image">
                  <img src="images/imagebox/09.jpg" alt="img" />
                </div>
                <div className="flat-imagebox-header">
                  <h3 className="flat-imagebox-title">
                    <a href="#">Retirement Planning</a>
                  </h3>
                </div>
                <div className="flat-imagebox-content">
                  <div className="flat-imagebox-desc">
                    Mutual funds pool money from many investors to purchase
                    broad range of investments, such as stocks.
                  </div>
                  <div className="flat-imagebox-button">
                    <a href="#" target="_blank">
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* /.item .flat-imagebox */}
          </div>{" "}
          {/* /.wrap-imagebox-grid */}
        </div>
      </div>
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
