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
          <div className='home-layout-wrapper'>
            <div
              data-elementor-type="wp-page"
              data-elementor-id={293}
              className="elementor elementor-293 pt-[80px]"
            >
              <section
                className="elementor-section elementor-top-section elementor-element elementor-element-91d4ebb elementor-section-height-min-height elementor-section-boxed elementor-section-height-default elementor-section-items-middle"
                data-id="91d4ebb"
                data-element_type="section"
                data-settings='{"background_background":"classic","ekit_has_onepagescroll_dot":"yes"}'
              >
                <div className="elementor-background-overlay" />
                <div className="elementor-container elementor-column-gap-narrow">
                  <div
                    className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-bdbbe5a"
                    data-id="bdbbe5a"
                    data-element_type="column"
                    data-settings='{"background_background":"classic"}'
                  >
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div
                        className="elementor-element elementor-element-83149ad elementor-widget elementor-widget-image"
                        data-id="83149ad"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="image.default"
                      >
                        <div className="elementor-widget-container">
                          <img
                            fetchpriority="high"
                            decoding="async"
                            width={1990}
                            height={2105}
                            src="wp-content/uploads/2024/05/mla.png"
                            className="attachment-full size-full wp-image-3201"
                            alt=""
                            srcSet="/images/great.png"
                            sizes="(max-width: 1990px) 100vw, 1990px"
                          />{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-54111957"
                    data-id={54111957}
                    data-element_type="column"
                  >
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div
                        className="elementor-element elementor-element-faae917 elementor-widget elementor-widget-heading"
                        data-id="faae917"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="heading.default"
                      >
                        <div className="elementor-widget-container">
                          <h1 className="elementor-heading-title elementor-size-default">
                          The Future of Investing
                          </h1>{" "}
                        </div>
                      </div>
                      <div
                        className="elementor-element elementor-element-11dda437 elementor-widget elementor-widget-text-editor"
                        data-id="11dda437"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="text-editor.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="page" title="Page 2">
                            <div className="section">
                              <div className="layoutArea">
                                <div className="column">
                                  <p>
                                  Experience Hassle-Free Investing
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>{" "}
                        </div>
                      </div>
                      <div
                        className="elementor-element elementor-element-53accc8 elementor-widget__width-auto elementor-mobile-align-right elementor-widget elementor-widget-button mt-4"
                        data-id="53accc8"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="button.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="elementor-button-wrapper">
                            <Link
                              className="elementor-button elementor-button-link elementor-size-sm"
                              href={route('register')}
                              style={{backgroundColor: '#8bc73c'}}
                            >
                              <span className="elementor-button-content-wrapper">
                                <span className="elementor-button-text">
                                REGISTER TO INVEST
                                </span>
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section
                className="elementor-section elementor-top-section elementor-element elementor-element-3e215ee elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                data-id="3e215ee"
                data-element_type="section"
                data-settings='{"ekit_has_onepagescroll_dot":"yes"}'
              >
                <div className="elementor-container elementor-column-gap-default">
                  <div
                    className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-db0bbc4"
                    data-id="db0bbc4"
                    data-element_type="column"
                  >
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div
                        className="elementor-element elementor-element-75478aa elementor-widget elementor-widget-spacer"
                        data-id="75478aa"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="spacer.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="elementor-spacer">
                            <div className="elementor-spacer-inner" />
                          </div>
                        </div>
                      </div>
                      <div
                        className="elementor-element elementor-element-6562aed elementor-widget elementor-widget-heading"
                        data-id="6562aed"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="heading.default"
                      >
                        <div className="elementor-widget-container">
                          <h2 className="elementor-heading-title elementor-size-default">
                          Kickstart your portfolio in minutes, with no financial expertise needed.
                          </h2>{" "}
                        </div>
                      </div>
                      <div
                        className="elementor-element elementor-element-5411d26 elementor-widget elementor-widget-spacer"
                        data-id="5411d26"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="spacer.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="elementor-spacer">
                            <div className="elementor-spacer-inner" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section
                className="elementor-section elementor-top-section elementor-element elementor-element-534b93d elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                data-id="534b93d"
                data-element_type="section"
                data-settings='{"ekit_has_onepagescroll_dot":"yes"}'
              >
                <div className="elementor-container elementor-column-gap-default">
                  <div
                    className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-05f29ae"
                    data-id="05f29ae"
                    data-element_type="column"
                  >
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div
                        className="elementor-element elementor-element-b80df94 elementor-widget elementor-widget-image"
                        data-id="b80df94"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="image.default"
                      >
                        <div className="elementor-widget-container">
                          <img
                            decoding="async"
                            width={150}
                            height={150}
                            src="wp-content/uploads/2024/05/time-150x150.png"
                            className="attachment-thumbnail size-thumbnail wp-image-3203"
                            alt=""
                            srcSet="https://moneycloud.co.ke/wp-content/uploads/2024/05/time-150x150.png 150w, https://moneycloud.co.ke/wp-content/uploads/2024/05/time.png 295w"
                            sizes="(max-width: 150px) 100vw, 150px"
                          />{" "}
                        </div>
                      </div>
                      <div
                        className="elementor-element elementor-element-a67e723 elementor-widget elementor-widget-text-editor"
                        data-id="a67e723"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="text-editor.default"
                      >
                        <div className="elementor-widget-container">
                          <p>Fast – Withdrawal within hours</p>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-3211d1c"
                    data-id="3211d1c"
                    data-element_type="column"
                  >
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div
                        className="elementor-element elementor-element-3ecc70a elementor-widget elementor-widget-image"
                        data-id="3ecc70a"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="image.default"
                      >
                        <div className="elementor-widget-container">
                          <img
                            decoding="async"
                            width={150}
                            height={150}
                            src="wp-content/uploads/2024/05/thumb-150x150.png"
                            className="attachment-thumbnail size-thumbnail wp-image-3204"
                            alt=""
                            srcSet="https://moneycloud.co.ke/wp-content/uploads/2024/05/thumb-150x150.png 150w, https://moneycloud.co.ke/wp-content/uploads/2024/05/thumb.png 295w"
                            sizes="(max-width: 150px) 100vw, 150px"
                          />{" "}
                        </div>
                      </div>
                      <div
                        className="elementor-element elementor-element-d82dba1 elementor-widget elementor-widget-text-editor"
                        data-id="d82dba1"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="text-editor.default"
                      >
                        <div className="elementor-widget-container">
                          <p>Hassle free – Free Investing</p>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-3ca23a6"
                    data-id="3ca23a6"
                    data-element_type="column"
                  >
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div
                        className="elementor-element elementor-element-22ba8fd elementor-widget elementor-widget-image"
                        data-id="22ba8fd"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="image.default"
                      >
                        <div className="elementor-widget-container">
                          <img
                            loading="lazy"
                            decoding="async"
                            width={150}
                            height={150}
                            src="wp-content/uploads/2024/05/people-150x150.png"
                            className="attachment-thumbnail size-thumbnail wp-image-3202"
                            alt=""
                            srcSet="https://moneycloud.co.ke/wp-content/uploads/2024/05/people-150x150.png 150w, https://moneycloud.co.ke/wp-content/uploads/2024/05/people.png 295w"
                            sizes="(max-width: 150px) 100vw, 150px"
                          />{" "}
                        </div>
                      </div>
                      <div
                        className="elementor-element elementor-element-44cb3f6 elementor-widget elementor-widget-text-editor"
                        data-id="44cb3f6"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="text-editor.default"
                      >
                        <div className="elementor-widget-container">
                          <p>
                            Highly 
                            secured
                          </p>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section
                className="elementor-section elementor-top-section elementor-element elementor-element-5f16556 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                data-id="5f16556"
                data-element_type="section"
                data-settings='{"ekit_has_onepagescroll_dot":"yes"}'
              >
                <div className="elementor-container elementor-column-gap-default">
                  <div
                    className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-48d6670"
                    data-id="48d6670"
                    data-element_type="column"
                  >
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div
                        className="elementor-element elementor-element-f44efbc elementor-widget elementor-widget-spacer"
                        data-id="f44efbc"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="spacer.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="elementor-spacer">
                            <div className="elementor-spacer-inner" />
                          </div>
                        </div>
                      </div>
                      <div
                        className="elementor-element elementor-element-ab58322 elementor-widget elementor-widget-heading"
                        data-id="ab58322"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="heading.default"
                      >
                        <div className="elementor-widget-container">
                          <h2 className="elementor-heading-title elementor-size-default">
                            Why choose us?
                          </h2>{" "}
                        </div>
                      </div>
                      <div
                        className="elementor-element elementor-element-1aadc08 elementor-widget elementor-widget-spacer"
                        data-id="1aadc08"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="spacer.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="elementor-spacer">
                            <div className="elementor-spacer-inner" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section
                className="elementor-section elementor-top-section elementor-element elementor-element-172ad97 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                data-id="172ad97"
                data-element_type="section"
                data-settings='{"ekit_has_onepagescroll_dot":"yes"}'
              >
                <div className="elementor-container elementor-column-gap-default">
                  <div
                    className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-4cff585"
                    data-id="4cff585"
                    data-element_type="column"
                  >
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div
                        className="elementor-element elementor-element-08bb907 elementor-widget elementor-widget-spacer"
                        data-id="08bb907"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="spacer.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="elementor-spacer">
                            <div className="elementor-spacer-inner" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section
                className="elementor-section elementor-top-section elementor-element elementor-element-2e6d9e2e elementor-section-content-middle elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                data-id="2e6d9e2e"
                data-element_type="section"
                data-settings='{"background_background":"classic","ekit_has_onepagescroll_dot":"yes"}'
              >
                <div className="elementor-container elementor-column-gap-no">
                  <div
                    className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-ef09cd0"
                    data-id="ef09cd0"
                    data-element_type="column"
                  >
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div
                        className="elementor-element elementor-element-dc792ca elementor-widget elementor-widget-counter"
                        data-id="dc792ca"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="counter.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="elementor-counter">
                            <div className="elementor-counter-title">
                              INVESTORS Served{" "}
                            </div>{" "}
                            <div className="elementor-counter-number-wrapper">
                              <span className="elementor-counter-number-prefix" />
                              <span
                                className="elementor-counter-number"
                              >
                                 <CountUp start={1} end={8000} duration={2000} />
                              </span>
                              <span className="elementor-counter-number-suffix">
                                + 
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-3325da24"
                    data-id="3325da24"
                    data-element_type="column"
                  >
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div
                        className="elementor-element elementor-element-db0efe elementor-widget elementor-widget-counter"
                        data-id="db0efe"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="counter.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="elementor-counter">
                            <div className="elementor-counter-title">
                              ASSETS TO DATE
                            </div>{" "}
                            <div className="elementor-counter-number-wrapper">
                              <span className="elementor-counter-number-prefix" />
                              <span
                                className="elementor-counter-number"
                              >
                                 <CountUp start={1} end={12500} duration={2000} />
                              </span>
                              <span className="elementor-counter-number-suffix">
                                + 
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-9626e9f"
                    data-id="9626e9f"
                    data-element_type="column"
                  >
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div
                        className="elementor-element elementor-element-b195a60 elementor-widget elementor-widget-counter"
                        data-id="b195a60"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="counter.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="elementor-counter">
                            <div className="elementor-counter-title">
                              Value of assets
                            </div>{" "}
                            <div className="elementor-counter-number-wrapper">
                              <span className="elementor-counter-number-prefix">
                                Kes
                              </span>

                              <span
                                className="elementor-counter-number"
                              >
                                 <CountUp start={1} end={370} duration={2000} />
                              </span>
                              <span className="elementor-counter-number-suffix">
                                M+ 
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section
                className="elementor-section elementor-top-section elementor-element elementor-element-e7193a0 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                data-id="e7193a0"
                data-element_type="section"
                data-settings='{"ekit_has_onepagescroll_dot":"yes"}'
              >
                <div className="elementor-container elementor-column-gap-default">
                  <div
                    className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-cecceb0"
                    data-id="cecceb0"
                    data-element_type="column"
                  >
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div
                        className="elementor-element elementor-element-b9ffab2 elementor-widget elementor-widget-spacer"
                        data-id="b9ffab2"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="spacer.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="elementor-spacer">
                            <div className="elementor-spacer-inner" />
                          </div>
                        </div>
                      </div>
                      <div
                        className="elementor-element elementor-element-bf0e659 elementor-widget elementor-widget-heading"
                        data-id="bf0e659"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="heading.default"
                      >
                        <div className="elementor-widget-container">
                          <h2 className="elementor-heading-title elementor-size-default">
                          ABOUT US
                          </h2>{" "}
                        </div>
                      </div>
                      <div
                        className="elementor-element elementor-element-3012086 elementor-widget elementor-widget-spacer"
                        data-id={3012086}
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="spacer.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="elementor-spacer">
                            <div className="elementor-spacer-inner" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section
                className="elementor-section elementor-top-section elementor-element elementor-element-8c59945 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                data-id="8c59945"
                data-element_type="section"
                data-settings='{"ekit_has_onepagescroll_dot":"yes"}'
              >
                <div className="elementor-container elementor-column-gap-default">
                  <div
                    className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-7203425"
                    data-id={7203425}
                    data-element_type="column"
                  >
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div
                        className="elementor-element elementor-element-4395eb7 elementor-widget elementor-widget-shortcode"
                        data-id="4395eb7"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="shortcode.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="elementor-shortcode">
                            <div
                              className="elfsight-widget-youtube-gallery elfsight-widget"
                              data-elfsight-youtube-gallery-options="%7B%22channel%22%3A%22https%3A%5C%2F%5C%2Fwww.youtube.com%5C%2Fchannel%5C%2FUCWpjCZWtuKUN-hBEU8mdKmg%22%2C%22sourceGroups%22%3Anull%2C%22headerVisible%22%3Atrue%2C%22headerLayout%22%3A%22classic%22%2C%22headerInfo%22%3A%5B%22logo%22%2C%22banner%22%2C%22channelName%22%2C%22videosCounter%22%2C%22subscribersCounter%22%2C%22viewsCounter%22%2C%22subscribeButton%22%5D%2C%22headerChannelName%22%3Anull%2C%22headerChannelDescription%22%3Anull%2C%22headerChannelLogo%22%3Anull%2C%22headerChannelBanner%22%3Anull%2C%22contentColumns%22%3A3%2C%22contentRows%22%3A1%2C%22contentGutter%22%3A20%2C%22contentResponsive%22%3A%5B%7B%22minWidth%22%3A375%2C%22columns%22%3A1%2C%22rows%22%3A1%2C%22gutter%22%3A%2220%22%7D%2C%7B%22minWidth%22%3A768%2C%22columns%22%3A2%2C%22rows%22%3A1%2C%22gutter%22%3A%2220%22%7D%5D%2C%22width%22%3A%22auto%22%2C%22videoLayout%22%3A%22classic%22%2C%22videoInfo%22%3A%5B%22playIcon%22%2C%22duration%22%2C%22title%22%2C%22date%22%2C%22description%22%2C%22viewsCounter%22%2C%22likesCounter%22%2C%22commentsCounter%22%5D%2C%22videoPlayMode%22%3A%22popup%22%2C%22popupInfo%22%3A%5B%22title%22%2C%22channelLogo%22%2C%22channelName%22%2C%22subscribeButton%22%2C%22viewsCounter%22%2C%22likesCounter%22%2C%22dislikesCounter%22%2C%22likesRatio%22%2C%22share%22%2C%22date%22%2C%22description%22%2C%22descriptionMoreButton%22%2C%22comments%22%5D%2C%22popupAutoplay%22%3Atrue%2C%22contentDirection%22%3A%22horizontal%22%2C%22contentArrowsControl%22%3Atrue%2C%22contentScrollControl%22%3Afalse%2C%22contentDragControl%22%3Atrue%2C%22contentPaginationControl%22%3Atrue%2C%22contentScrollbar%22%3Afalse%2C%22contentSearch%22%3Afalse%2C%22contentDivider1%22%3Anull%2C%22contentTransitionSpeed%22%3A600%2C%22contentTransitionEffect%22%3A%22slide%22%2C%22contentFreeMode%22%3Afalse%2C%22contentDivider2%22%3Anull%2C%22contentAuto%22%3A0%2C%22contentAutoPauseOnHover%22%3Afalse%2C%22colorScheme%22%3A%22default%22%2C%22colorHeaderBg%22%3A%22rgb%28250%2C%20250%2C%20250%29%22%2C%22colorHeaderBannerOverlay%22%3A%22rgba%28255%2C%20255%2C%20255%2C%200.92%29%22%2C%22colorHeaderChannelName%22%3A%22rgb%2817%2C%2017%2C%2017%29%22%2C%22colorHeaderChannelNameHover%22%3A%22rgb%2817%2C%2017%2C%2017%29%22%2C%22colorHeaderChannelDescription%22%3A%22rgb%2817%2C%2017%2C%2017%29%22%2C%22colorHeaderAnchor%22%3A%22rgb%2817%2C%2017%2C%2017%29%22%2C%22colorHeaderAnchorHover%22%3A%22rgb%2817%2C%2017%2C%2017%29%22%2C%22colorHeaderCounters%22%3A%22rgba%2817%2C%2017%2C%2017%2C%200.7%29%22%2C%22colorGroupsBg%22%3A%22rgb%28250%2C%20250%2C%20250%29%22%2C%22colorGroupsLink%22%3A%22rgb%2817%2C%2017%2C%2017%2C%200.5%29%22%2C%22colorGroupsLinkHover%22%3A%22rgb%2817%2C%2017%2C%2017%29%22%2C%22colorGroupsLinkActive%22%3A%22rgb%2817%2C%2017%2C%2017%29%22%2C%22colorGroupsHighlightHover%22%3A%22rgb%2817%2C%2017%2C%2017%29%22%2C%22colorGroupsHighlightActive%22%3A%22rgb%2817%2C%2017%2C%2017%29%22%2C%22colorVideoBg%22%3A%22rgb%28255%2C%20255%2C%20255%29%22%2C%22colorVideoOverlay%22%3A%22rgba%28255%2C%20255%2C%20255%2C%200.95%29%22%2C%22colorVideoPlayIcon%22%3A%22rgba%28255%2C%200%2C%200%2C%200.8%29%22%2C%22colorVideoPlayIconHover%22%3A%22rgba%28255%2C%200%2C%200%2C%201%29%22%2C%22colorVideoDuration%22%3A%22rgb%28255%2C%20255%2C%20255%29%22%2C%22colorVideoDurationBg%22%3A%22rgba%2834%2C%2034%2C%2034%2C%200.81%29%22%2C%22colorVideoTitle%22%3A%22rgb%2817%2C%2017%2C%2017%29%22%2C%22colorVideoTitleHover%22%3A%22rgb%2817%2C%2017%2C%2017%29%22%2C%22colorVideoDate%22%3A%22rgba%2817%2C%2017%2C%2017%2C%200.7%29%22%2C%22colorVideoDescription%22%3A%22rgb%2817%2C%2017%2C%2017%29%22%2C%22colorVideoAnchor%22%3A%22rgb%2826%2C%20137%2C%20222%29%22%2C%22colorVideoAnchorHover%22%3A%22rgb%2847%2C%20165%2C%20255%29%22%2C%22colorVideoCounters%22%3A%22rgba%2817%2C%2017%2C%2017%2C%200.7%29%22%2C%22colorPopupBg%22%3A%22rgb%28255%2C%20255%2C%20255%29%22%2C%22colorPopupAnchor%22%3A%22rgb%2826%2C%20137%2C%20222%29%22%2C%22colorPopupAnchorHover%22%3A%22rgb%2847%2C%20165%2C%20255%29%22%2C%22colorPopupOverlay%22%3A%22rgba%280%2C%200%2C%200%2C%200.7%29%22%2C%22colorPopupTitle%22%3A%22rgb%2817%2C%2017%2C%2017%29%22%2C%22colorPopupChannelName%22%3A%22rgb%2817%2C%2017%2C%2017%29%22%2C%22colorPopupChannelNameHover%22%3A%22rgb%2817%2C%2017%2C%2017%29%22%2C%22colorPopupViewsCounter%22%3A%22rgba%2817%2C%2017%2C%2017%2C%200.7%29%22%2C%22colorPopupLikesRatio%22%3A%22rgb%2847%2C%20165%2C%20255%29%22%2C%22colorPopupDislikesRatio%22%3A%22rgb%28207%2C%20207%2C%20207%29%22%2C%22colorPopupLikesCounter%22%3A%22rgba%2817%2C%2017%2C%2017%2C%200.5%29%22%2C%22colorPopupDislikesCounter%22%3A%22rgba%2817%2C%2017%2C%2017%2C%200.5%29%22%2C%22colorPopupShare%22%3A%22rgba%2817%2C%2017%2C%2017%2C%200.5%29%22%2C%22colorPopupDate%22%3A%22rgba%2817%2C%2017%2C%2017%2C%200.7%29%22%2C%22colorPopupDescription%22%3A%22rgb%2817%2C%2017%2C%2017%29%22%2C%22colorPopupDescriptionMoreButton%22%3A%22rgba%2817%2C%2017%2C%2017%2C%200.5%29%22%2C%22colorPopupDescriptionMoreButtonHover%22%3A%22rgba%2817%2C%2017%2C%2017%2C%200.7%29%22%2C%22colorPopupCommentsUsername%22%3A%22rgb%2817%2C%2017%2C%2017%29%22%2C%22colorPopupCommentsUsernameHover%22%3A%22rgb%2817%2C%2017%2C%2017%29%22%2C%22colorPopupCommentsPassedTime%22%3A%22rgba%2817%2C%2017%2C%2017%2C%200.7%29%22%2C%22colorPopupCommentsLikes%22%3A%22rgba%2817%2C%2017%2C%2017%2C%200.5%29%22%2C%22colorPopupCommentsText%22%3A%22rgb%2817%2C%2017%2C%2017%29%22%2C%22colorPopupControls%22%3A%22rgb%28160%2C%20160%2C%20160%29%22%2C%22colorPopupControlsHover%22%3A%22rgb%28220%2C%20220%2C%20220%29%22%2C%22colorPopupControlsMobile%22%3A%22rgb%28220%2C%20220%2C%20220%29%22%2C%22colorPopupControlsMobileBg%22%3A%22rgba%28255%2C%20255%2C%20255%2C%200%29%22%2C%22colorContentBg%22%3A%22rgb%28255%2C%20255%2C%20255%29%22%2C%22colorContentArrows%22%3A%22rgb%280%2C%200%2C%200%29%22%2C%22colorContentArrowsHover%22%3A%22rgb%280%2C%200%2C%200%29%22%2C%22colorContentArrowsBg%22%3A%22rgba%28255%2C%20255%2C%20255%2C%200.8%29%22%2C%22colorContentArrowsBgHover%22%3A%22rgba%28255%2C%20255%2C%20255%2C%201%29%22%2C%22colorContentScrollbarBg%22%3A%22rgb%28204%2C%20204%2C%20204%29%22%2C%22colorContentScrollbarSliderBg%22%3A%22rgba%280%2C%200%2C%200%2C%200.4%29%22%2C%22lang%22%3A%22en%22%2C%22adsClient%22%3Anull%2C%22adsSlotsContent%22%3Anull%2C%22adsSlotsPopup%22%3Anull%2C%22noCookies%22%3Anull%2C%22key%22%3A%22AIzaSyBE-ELgvfalORwMUNlnzqidEKHEbNAmCvs%22%2C%22apiUrl%22%3A%22https%3A%5C%2F%5C%2Fmoneycloud.co.ke%5C%2Fwp-json%5C%2Felfsight-youtube-gallery%5C%2Fapi%22%2C%22widgetId%22%3A%222%22%7D"
                              data-elfsight-youtube-gallery-version="3.5.0"
                              data-elfsight-widget-id="elfsight-youtube-gallery-2"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section
                className="elementor-section elementor-top-section elementor-element elementor-element-083dc1b elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                data-id="083dc1b"
                data-element_type="section"
                data-settings='{"ekit_has_onepagescroll_dot":"yes"}'
              >
                <div className="elementor-container elementor-column-gap-default">
                  <div
                    className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-13ca5e6"
                    data-id="13ca5e6"
                    data-element_type="column"
                  >
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div
                        className="elementor-element elementor-element-73d0006 elementor-widget elementor-widget-image"
                        data-id="73d0006"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="image.default"
                      >
                        <div className="elementor-widget-container">
                          <p>Embrace the Future of Savings: Investing in Money Market Funds with Nyota</p>
                          <p>Forget traditional savings accounts – Kenya's thriving money market funds offer low risk, high liquidity, and steady returns. Platforms like Nyota make investing in money market funds and other financial assets easy and accessible. This comprehensive guide will walk you through the process of investing in Nyota Investment Fund by helping you embark on your investment journey with confidence.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-a13ffdc"
                    data-id="a13ffdc"
                    data-element_type="column"
                  >
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div
                        className="elementor-element elementor-element-07fc0c9 elementor-widget elementor-widget-image"
                        data-id="07fc0c9"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="image.default"
                      >
                        <div className="elementor-widget-container">
                          <img
                            loading="lazy"
                            decoding="async"
                            width={900}
                            height={703}
                            src="wp-content/uploads/2024/06/nsn-1024x800.png"
                            className="attachment-large size-large wp-image-3655"
                            alt=""
                            srcSet="/images/human-hand-inserting-coin-piggybank_23-2147919267.jpg"
                            sizes="(max-width: 900px) 100vw, 900px"
                          />{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section
                className="elementor-section elementor-top-section elementor-element elementor-element-2e6d9e2e elementor-section-content-middle elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                data-id="2e6d9e2e"
                data-element_type="section"
                data-settings='{"background_background":"classic","ekit_has_onepagescroll_dot":"yes"}'
              >
                <h2 className="text-center">Why Nyota is Your Ideal Money Market Fund Investment Partner</h2>
                <p className="container mx-auto text-left">Nyota is a cutting-edge digital wealth management platform designed to simplify investing while prioritizing security and accessibility. Offering professional guidance and a wealth of resources, Nyota caters to both novice and seasoned investors on their path to financial success. Key advantages of choosing Nyota include:</p>
                <div className="elementor-container elementor-column-gap-no">
                  <div
                    className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-ef09cd0"
                    data-id="ef09cd0"
                    data-element_type="column"
                  >
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div
                        className="elementor-element elementor-element-dc792ca elementor-widget elementor-widget-counter"
                        data-id="dc792ca"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="counter.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="elementor-counter">
                            <div className="elementor-counter-title">
                            Nyota's intuitive platform simplifies investing for users of all experience levels.{" "}
                            </div>{" "}
                            <div className="elementor-counter-title text-left text-white font-bold text-lg mr-auto">
                            User-Friendliness:
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  

                  <div
                    className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-ef09cd0"
                    data-id="ef09cd0"
                    data-element_type="column"
                  >
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div
                        className="elementor-element elementor-element-dc792ca elementor-widget elementor-widget-counter"
                        data-id="dc792ca"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="counter.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="elementor-counter">
                            <div className="elementor-counter-title">
                            Start investing in money market funds with as little as KES 200, making it accessible to all.{" "}
                            </div>{" "}
                            <div className="elementor-counter-title text-left text-white font-bold text-lg mr-auto">
                            Low Entry Barrier:
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-ef09cd0"
                    data-id="ef09cd0"
                    data-element_type="column"
                  >
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div
                        className="elementor-element elementor-element-dc792ca elementor-widget elementor-widget-counter"
                        data-id="dc792ca"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="counter.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="elementor-counter">
                            <div className="elementor-counter-title">
                            Nyota handles every aspect of your investments, from initial allocation to ongoing portfolio management.{" "}
                            </div>{" "}
                            <div className="elementor-counter-title text-left text-white font-bold text-lg mr-auto">
                            Automated Investing:
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-ef09cd0"
                    data-id="ef09cd0"
                    data-element_type="column"
                  >
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div
                        className="elementor-element elementor-element-dc792ca elementor-widget elementor-widget-counter"
                        data-id="dc792ca"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="counter.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="elementor-counter">
                            <div className="elementor-counter-title">
                            Your funds are managed by skilled professionals who prioritize steady growth and minimal risk exposure.{" "}
                            </div>{" "}
                            <div className="elementor-counter-title text-left text-white font-bold text-lg mr-auto">
                            Expert Oversight: 
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </section>

              <section
                className="elementor-section elementor-top-section elementor-element elementor-element-083dc1b elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                data-id="083dc1b"
                data-element_type="section"
                data-settings='{"ekit_has_onepagescroll_dot":"yes"}'
              >
                <div className="elementor-container elementor-column-gap-default">

                  <div
                    className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-a13ffdc"
                    data-id="a13ffdc"
                    data-element_type="column"
                  >
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div
                        className="elementor-element elementor-element-07fc0c9 elementor-widget elementor-widget-image"
                        data-id="07fc0c9"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="image.default"
                      >
                        <div className="elementor-widget-container">
                          <img
                            loading="lazy"
                            decoding="async"
                            width={900}
                            height={703}
                            src="wp-content/uploads/2024/06/nsn-1024x800.png"
                            className="attachment-large size-large wp-image-3655"
                            alt=""
                            srcSet="/images/businesswoman-6557677_1280.webp"
                            sizes="(max-width: 900px) 100vw, 900px"
                          />{" "}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-13ca5e6"
                    data-id="13ca5e6"
                    data-element_type="column"
                  >
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div
                        className="elementor-element elementor-element-73d0006 elementor-widget elementor-widget-image"
                        data-id="73d0006"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="image.default"
                      >
                        <div className="elementor-widget-container">
                          <h2>What is a money market fund?</h2>
                          <p>A money market fund (MMF) is an investment vehicle that focuses on low-risk, short-term financial instruments to generate stable returns for investors. With a goal of preserving capital while offering competitive interest rates, MMFs have become a preferred alternative to traditional savings accounts. Key benefits include higher interest earnings, minimal risk exposure, and easy access to funds when needed.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              
              <section
                className="elementor-section elementor-top-section elementor-element elementor-element-9be37b0 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                data-id="9be37b0"
                data-element_type="section"
                data-settings='{"background_background":"classic","ekit_has_onepagescroll_dot":"yes"}'
              >
                <div className="elementor-container elementor-column-gap-default">
                  <div
                    className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-41346ff"
                    data-id="41346ff"
                    data-element_type="column"
                  >
                    <div className="elementor-widget-wrap elementor-element-populated">
                      <div
                        className="elementor-element elementor-element-7802b81 elementor-widget elementor-widget-spacer"
                        data-id="7802b81"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="spacer.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="elementor-spacer">
                            <div className="elementor-spacer-inner" />
                          </div>
                        </div>
                      </div>
                      <div
                        className="elementor-element elementor-element-3a16771 elementor-widget elementor-widget-text-editor"
                        data-id="3a16771"
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="text-editor.default"
                      >
                        <div className="elementor-widget-container">
                          <p>
                          Join Nyota now and witness <br />the future of investing unfold!
                          </p>{" "}
                        </div>

                        <div className="pt-6">
                          <Link
                            className="text-2xl text-white mx-auto border-2 px-4 py-2 rounded-md" 
                            style={{backgroundColor: '#8cc63e !important'}}
                            href={route('register')}
                          >
                            REGISTER TO INVEST
                          </Link>
                        </div>
                        
                      </div>
                      <div
                        className="elementor-element elementor-element-6417129 elementor-widget elementor-widget-spacer"
                        data-id={6417129}
                        data-element_type="widget"
                        data-settings='{"ekit_we_effect_on":"none"}'
                        data-widget_type="spacer.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="elementor-spacer">
                            <div className="elementor-spacer-inner" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            
            <div
              className="ht-ctc ht-ctc-chat ctc-analytics ctc_wp_desktop style-2   ctc_side_positions "
              id="ht-ctc-chat"
              style={{
                display: "none",
                position: "fixed",
                bottom: 15,
                left: 15,
              }}
            >
              <div className="ht_ctc_style ht_ctc_chat_style">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className="ctc-analytics ctc_s_2"
                >
                  <p
                    className="ctc-analytics ctc_cta ctc_cta_stick ht-ctc-cta  ctc_m_cta_order_0 "
                    style={{
                      padding: "0px 16px",
                      lineHeight: "1.6",
                      fontSize: 15,
                      backgroundColor: "#25D366",
                      color: "#ffffff",
                      borderRadius: 10,
                      margin: "0 10px",
                      order: 1,
                    }}
                  >
                    WhatsApp us
                  </p>
                  <svg
                    style={{
                      pointerEvents: "none",
                      display: "block",
                      height: 50,
                      width: 50,
                    }}
                    width="50px"
                    height="50px"
                    viewBox="0 0 1024 1024"
                  >
                    <defs>
                      <path
                        id="htwasqicona-chat"
                        d="M1023.941 765.153c0 5.606-.171 17.766-.508 27.159-.824 22.982-2.646 52.639-5.401 66.151-4.141 20.306-10.392 39.472-18.542 55.425-9.643 18.871-21.943 35.775-36.559 50.364-14.584 14.56-31.472 26.812-50.315 36.416-16.036 8.172-35.322 14.426-55.744 18.549-13.378 2.701-42.812 4.488-65.648 5.3-9.402.336-21.564.505-27.15.505l-504.226-.081c-5.607 0-17.765-.172-27.158-.509-22.983-.824-52.639-2.646-66.152-5.4-20.306-4.142-39.473-10.392-55.425-18.542-18.872-9.644-35.775-21.944-50.364-36.56-14.56-14.584-26.812-31.471-36.415-50.314-8.174-16.037-14.428-35.323-18.551-55.744-2.7-13.378-4.487-42.812-5.3-65.649-.334-9.401-.503-21.563-.503-27.148l.08-504.228c0-5.607.171-17.766.508-27.159.825-22.983 2.646-52.639 5.401-66.151 4.141-20.306 10.391-39.473 18.542-55.426C34.154 93.24 46.455 76.336 61.07 61.747c14.584-14.559 31.472-26.812 50.315-36.416 16.037-8.172 35.324-14.426 55.745-18.549 13.377-2.701 42.812-4.488 65.648-5.3 9.402-.335 21.565-.504 27.149-.504l504.227.081c5.608 0 17.766.171 27.159.508 22.983.825 52.638 2.646 66.152 5.401 20.305 4.141 39.472 10.391 55.425 18.542 18.871 9.643 35.774 21.944 50.363 36.559 14.559 14.584 26.812 31.471 36.415 50.315 8.174 16.037 14.428 35.323 18.551 55.744 2.7 13.378 4.486 42.812 5.3 65.649.335 9.402.504 21.564.504 27.15l-.082 504.226z"
                      />
                    </defs>
                    <linearGradient
                      id="htwasqiconb-chat"
                      gradientUnits="userSpaceOnUse"
                      x1="512.001"
                      y1=".978"
                      x2="512.001"
                      y2="1025.023"
                    >
                      <stop offset={0} stopColor="#61fd7d" />
                      <stop offset={1} stopColor="#2bb826" />
                    </linearGradient>
                    <use
                      xlinkHref="#htwasqicona-chat"
                      overflow="visible"
                      style={{ fill: "url(#htwasqiconb-chat)" }}
                      fill="url(#htwasqiconb-chat)"
                    />
                    <g>
                      <path
                        style={{ fill: "#FFFFFF" }}
                        fill="#FFF"
                        d="M783.302 243.246c-69.329-69.387-161.529-107.619-259.763-107.658-202.402 0-367.133 164.668-367.214 367.072-.026 64.699 16.883 127.854 49.017 183.522l-52.096 190.229 194.665-51.047c53.636 29.244 114.022 44.656 175.482 44.682h.151c202.382 0 367.128-164.688 367.21-367.094.039-98.087-38.121-190.319-107.452-259.706zM523.544 808.047h-.125c-54.767-.021-108.483-14.729-155.344-42.529l-11.146-6.612-115.517 30.293 30.834-112.592-7.259-11.544c-30.552-48.579-46.688-104.729-46.664-162.379.066-168.229 136.985-305.096 305.339-305.096 81.521.031 158.154 31.811 215.779 89.482s89.342 134.332 89.312 215.859c-.066 168.243-136.984 305.118-305.209 305.118zm167.415-228.515c-9.177-4.591-54.286-26.782-62.697-29.843-8.41-3.062-14.526-4.592-20.645 4.592-6.115 9.182-23.699 29.843-29.053 35.964-5.352 6.122-10.704 6.888-19.879 2.296-9.176-4.591-38.74-14.277-73.786-45.526-27.275-24.319-45.691-54.359-51.043-63.543-5.352-9.183-.569-14.146 4.024-18.72 4.127-4.109 9.175-10.713 13.763-16.069 4.587-5.355 6.117-9.183 9.175-15.304 3.059-6.122 1.529-11.479-.765-16.07-2.293-4.591-20.644-49.739-28.29-68.104-7.447-17.886-15.013-15.466-20.645-15.747-5.346-.266-11.469-.322-17.585-.322s-16.057 2.295-24.467 11.478-32.113 31.374-32.113 76.521c0 45.147 32.877 88.764 37.465 94.885 4.588 6.122 64.699 98.771 156.741 138.502 21.892 9.45 38.982 15.094 52.308 19.322 21.98 6.979 41.982 5.995 57.793 3.634 17.628-2.633 54.284-22.189 61.932-43.615 7.646-21.427 7.646-39.791 5.352-43.617-2.294-3.826-8.41-6.122-17.585-10.714z"
                      />
                    </g>
                  </svg>
                </div>{" "}
              </div>
            </div>
            <span
              className="ht_ctc_chat_data"
              data-no_number=""
              data-settings='{"number":"254758564440","pre_filled":"Hello MoneyCloud!\r\n\r\nI would like more information on...","dis_m":"show","dis_d":"show","css":"display: none; cursor: pointer; z-index: 99999999;","pos_d":"position: fixed; bottom: 15px; left: 15px;","pos_m":"position: fixed; bottom: 10px; right: 10px;","schedule":"no","se":150,"ani":"no-animations","url_structure_d":"web","url_target_d":"_blank","ga":"yes","fb":"yes","g_init":"default","g_an_event_name":"chat: {number}","pixel_event_name":"Click to Chat by HoliThemes"}'
            />
            <link
              rel="stylesheet"
              id="0-css"
              href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,0,1001,1000,2001,2000,3001,3000,4001,4000,5001,5000,6001,6000,7001,7000,8001,8000,9001,900;0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,0,1001,1000,2001,2000,3001,3000,4001,4000,5001,5000,6001,6000,7001,7000,8001,8000,9001,900&family=Roboto+Slab:ital,wght@0,0,1001,1000,2001,2000,3001,3000,4001,4000,5001,5000,6001,6000,7001,7000,8001,8000,9001,900&family=Heebo:ital,wght@0,0,1001,1000,2001,2000,3001,3000,4001,4000,5001,5000,6001,6000,7001,7000,8001,8000,9001,900&family=Poppins:ital,wght@0,0,1001,1000,2001,2000,3001,3000,4001,4000,5001,5000,6001,6000,7001,7000,8001,8000,9001,900&display=swap"
              type="text/css"
              media="all"
            />
          </div>
          </Guest>
        </LayoutProvider>
      </PrimeReactProvider>
    </>
  );
}
