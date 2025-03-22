import { useState, useEffect } from "react";
import { Link, Head } from "@inertiajs/react";
import {
  LayoutContext,
  LayoutProvider,
} from "@/Layouts/layout/context/layoutcontext.jsx";
import { PrimeReactProvider } from "primereact/api";
import React, { useContext } from "react";
import Guest from "@/Layouts/GuestLayout";
import "../../css/index.scss";
import BannerSlider from "@/Components/BannerSlider";
import ProjectsSection from "@/Components/projects";
import AboutSection from "@/Components/About";

const CountUp = ({ start, end, duration }) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [start, end, duration]);

  return <span>{count}</span>;
};

export default function Welcome({ auth, laravelVersion, phpVersion }) {
  const { layoutConfig } = useContext(LayoutContext);
  return (
    <>
      <PrimeReactProvider>
        <LayoutProvider>
          <Head title="Welcome" />
          <Guest>
          <>
            <BannerSlider />

            <AboutSection />

            <section className="flat-row flat-iconbox bg-theme">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="title-section left">
                      <h2>Why Nyota is Your Ideal Money Market Fund Investment Partner</h2>

                      <p className="mb-8">Nyota is a cutting-edge digital wealth management platform designed to simplify investing while prioritizing security and accessibility. Offering professional guidance and a wealth of resources, Nyota caters to both novice and seasoned investors on their path to financial success. Key advantages of choosing Nyota include:</p>
                    </div>
                    {/* /.title-section */}
                  </div>
                </div>
                {/* /.row */}
                <div className="row space-y-8">
                  <div className="col-sm-12 col-md-6 col-lg-3">
                    <div className="iconbox-item">
                      <div className="iconbox style1">
                        <div className="box-header">
                          <div className="icon-rounded ion-clipboard"></div>
                          {/* /.icon-rounded */}
                          <div className="box-title">
                            <a href="%27.html#" title="">
                            User-Friendliness:
                            </a>
                          </div>
                          {/* /.box-title */}
                        </div>
                        {/* /.box-header */}
                        <div className="box-content">
                        Nyota's intuitive platform simplifies investing for users of all experience levels.
                        </div>
                        {/* /.box-content */}
                      </div>
                      {/* /.iconbox */}
                    </div>
                    {/* /.iconbox-item */}
                  </div>
                  {/* /.col-md-4 */}
                  <div className="col-sm-12 col-md-6 col-lg-3">
                    <div className="iconbox-item">
                      <div className="iconbox style1">
                        <div className="box-header">
                          <div className="icon-rounded line-chart"></div>
                          <div className="box-title">
                            <a href="%27.html#" title="">
                            Low Entry Barrier:
                            </a>
                          </div>
                        </div>
                        {/* /.box-header */}
                        <div className="box-content">
                        Start investing in money market funds with as little as KES 200, making it accessible to all.
                        </div>
                        {/* /.box-content */}
                      </div>
                      {/* /.iconbox */}
                    </div>
                    {/* /.iconbox-item */}
                    
                  </div>

                  <div className="col-sm-12 col-md-6 col-lg-3">
                    <div className="iconbox-item">
                      <div className="iconbox style1">
                        <div className="box-header">
                          <div className="icon-rounded magic"></div>
                          <div className="box-title">
                            <a href="%27.html#" title="">
                            Expert Oversight:
                            </a>
                          </div>
                        </div>
                        {/* /.box-header */}
                        <div className="box-content">
                        Your funds are managed by skilled professionals who prioritize steady growth and minimal risk exposure.
                        </div>
                        {/* /.box-content */}
                      </div>
                      {/* /.iconbox */}
                    </div>
                    {/* /.iconbox-item */}
                  </div>

                  <div className="col-sm-12 col-md-6 col-lg-3">
                    <div className="iconbox-item">
                      <div className="iconbox style1">
                        <div className="box-header">
                          <div className="icon-rounded artboard"></div>
                          <div className="box-title">
                            <a href="%27.html#" title="">
                            Automated Investing:
                            </a>
                          </div>
                        </div>
                        {/* /.box-header */}
                        <div className="box-content">
                        Nyota handles every aspect of your investments, from initial allocation to ongoing portfolio management.
                        </div>
                        {/* /.box-content */}
                      </div>
                      {/* /.iconbox */}
                    </div>
                    {/* /.iconbox-item */}
                  </div>
                </div>
              </div>
              {/* /.container */}
            </section>

            <ProjectsSection />

            {/* /.flat-owl-stage */}
            <section className="flat-row flat-callback">
              <div className="container">
                <div className="row">
                  <div className="col-md-4">
                    <div className="text-block-callback">
                      <h2>Get a Call Back</h2>
                      <div className="text-callback-content">
                        If you need to speak to us about a general query fill in the form
                        below and we will call you back within the same working day.
                      </div>
                    </div>
                    {/* /.text-block-callback */}
                  </div>
                  {/* /.col-md-4 */}
                  <div className="col-md-8">
                    <div className="flat-callback-form">
                      <form
                        id="contactform"
                        method="post"
                        action="https://themesflat.co/html/finance/contact/contact-process2.php"
                        noValidate="novalidate"
                      >
                        <div className="flat-field">
                          <div className="field-one-half">
                            <label>How can we help? *</label>
                            <select name="discuss">
                              <option value="I would like to discuss:">
                                I would like to discuss:
                              </option>
                              <option value="I would like to discuss:">
                                I would like to discuss:
                              </option>
                              <option value="I would like to discuss:">
                                I would like to discuss:
                              </option>
                            </select>
                          </div>
                          {/* /.field-one-half */}
                          <div className="field-one-half field-email">
                            <input
                              type="text"
                              id="email"
                              defaultValue=""
                              name="email"
                              placeholder="You Email"
                              required="required"
                            />
                          </div>
                          {/* /.field-one-half */}
                          <div className="clearfix" />
                        </div>
                        <div className="flat-field">
                          <div className="field-one-half field-phone">
                            <input
                              type="text"
                              id="phone"
                              defaultValue=""
                              name="phone"
                              placeholder="You phone number"
                              required="required"
                            />
                          </div>
                          <div className="field-one-half field-submit">
                            <button
                              type="submit"
                              name="submit"
                              className="button-submit-field text-white"
                            >
                              Submit Now
                            </button>
                          </div>
                        </div>
                        {/* /.flat-field */}
                      </form>
                      {/* /.form */}
                    </div>
                    {/* /.callback-form */}
                  </div>
                  {/* /.col-md-8 */}
                </div>
                {/* /.row */}
              </div>
              {/* /.container */}
            </section>
         
            {/* Carousel */}
            <section className="flat-row flat-client bg-theme">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                     <div className="field-one-half field-submit mx-auto flex flex-col">
                      <Link
                        href={route('register')}
                        className="px-6 py-3 bg-green-400 text-white rounded-md text-sm hover:bg-blue-700 transition mx-auto"
                      >
                        Get started
                      </Link>
                    </div>
                  </div>{" "}
                  {/* /.col-md-12 */}
                </div>{" "}
                {/* /.row */}
              </div>{" "}
              {/* /.container */}
            </section>{" "}
            {/* /.flat-row */}
          </>

          </Guest>
        </LayoutProvider>
      </PrimeReactProvider>
    </>
  );
}
