import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import "../../css/index.scss";

function Header() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };

  return (
    <div className='home-layout-wrapper'>
    <div className="ekit-template-content-markup ekit-template-content-header ekit-template-content-theme-support fixed bg-green-700 w-full z-10">
        <div
        data-elementor-type="wp-post"
        data-elementor-id={146}
        className="elementor elementor-146"
        >
        <section
            className="elementor-section elementor-top-section elementor-element elementor-element-e441622 elementor-section-full_width ekit-sticky--top elementor-section-height-default elementor-section-height-default"
            data-id="e441622"
            data-element_type="section"
            data-settings='{"ekit_sticky_effect_offset":{"unit":"px","size":1,"sizes":[]},"ekit_sticky_on":["desktop","tablet","mobile"],"background_background":"classic","ekit_sticky":"top","ekit_sticky_offset":{"unit":"px","size":0,"sizes":[]},"ekit_has_onepagescroll_dot":"yes"}'
        >
            <div className="elementor-container elementor-column-gap-wider">
            <div
                className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-b5dad61"
                data-id="b5dad61"
                data-element_type="column"
            >
                <div className="elementor-widget-wrap elementor-element-populated">
                <section
                    className="elementor-section elementor-inner-section elementor-element elementor-element-b1ed6bc elementor-section-full_width elementor-hidden-phone elementor-section-height-default elementor-section-height-default"
                    data-id="b1ed6bc"
                    data-element_type="section"
                    data-settings='{"background_background":"classic","ekit_has_onepagescroll_dot":"yes"}'
                >
                    <div className="elementor-container elementor-column-gap-wider">
                    <div
                        className="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-2f157c5"
                        data-id="2f157c5"
                        data-element_type="column"
                    >
                        <div className="elementor-widget-wrap"></div>
                    </div>
                    </div>
                </section>
                <section
                    className="elementor-section elementor-inner-section elementor-element elementor-element-0c1bf24 elementor-section-full_width elementor-section-height-default elementor-section-height-default"
                    data-id="0c1bf24"
                    data-element_type="section"
                    data-settings='{"ekit_has_onepagescroll_dot":"yes"}'
                >
                    <div className="elementor-container elementor-column-gap-default">
                    <div
                        className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-ef842ff"
                        data-id="ef842ff"
                        data-element_type="column"
                        data-settings='{"background_background":"classic"}'
                    >
                        <div className="elementor-widget-wrap elementor-element-populated">
                        <div
                            className="elementor-element elementor-element-6b69bb1 elementor-widget elementor-widget-image"
                            data-id="6b69bb1"
                            data-element_type="widget"
                            data-settings='{"ekit_we_effect_on":"none"}'
                            data-widget_type="image.default"
                        >
                            <div className="elementor-widget-container">
                            <Link  href={route('home')}>
                                <img
                                width={500}
                                src="/images/logo.png"
                                className="attachment-1536x1536 size-1536x1536 wp-image-3550"
                                alt=""
                                srcSet="/images/logo.png"
                                sizes="(max-width: 540px) 100vw, 540px"
                                />{" "}
                            </Link>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div
                        className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-c8cd629"
                        data-id="c8cd629"
                        data-element_type="column"
                        data-settings='{"background_background":"classic"}'
                    >
                        <div className="elementor-widget-wrap elementor-element-populated">
                        <div
                            className="elementor-element elementor-element-26c8dd0 elementor-widget__width-auto elementor-widget elementor-widget-ekit-nav-menu"
                            data-id="26c8dd0"
                            data-element_type="widget"
                            data-settings='{"ekit_we_effect_on":"none"}'
                            data-widget_type="ekit-nav-menu.default"
                        >
                            <div className="elementor-widget-container">
                            <div
                                className="ekit-wid-con ekit_menu_responsive_tablet"
                                data-hamburger-icon=""
                                data-hamburger-icon-type="icon"
                                data-responsive-breakpoint={1024}
                            >
                                <button
                                className="elementskit-menu-hamburger elementskit-menu-toggler"
                                type="button"
                                aria-label="hamburger-icon"
                                >
                                <span className="elementskit-menu-hamburger-icon" />
                                <span className="elementskit-menu-hamburger-icon" />
                                <span className="elementskit-menu-hamburger-icon" />
                                </button>
                                <div
                                id="ekit-megamenu-main-menu"
                                className="elementskit-menu-container elementskit-menu-offcanvas-elements elementskit-navbar-nav-default ekit-nav-menu-one-page-no ekit-nav-dropdown-hover"
                                >
                                <ul
                                    id="menu-main-menu"
                                    className="elementskit-navbar-nav elementskit-menu-po-right submenu-click-on-icon"
                                >
                                    <li
                                    id="menu-item-353"
                                    className="menu-item menu-item-type-post_type menu-item-object-page menu-item-home current-menu-item page_item page-item-293 current_page_item menu-item-353 nav-item nav-item elementskit-mobile-builder-content active"
                                    data-vertical-menu="750px"
                                    >
                                    <Link
                                        href={route('home')}
                                        className="ekit-menu-nav-link active"
                                    >
                                        Home
                                    </Link>
                                    </li>
                                    <li
                                    id="menu-item-360"
                                    className="menu-item menu-item-type-post_type menu-item-object-page menu-item-360 nav-item nav-item elementskit-mobile-builder-content"
                                    data-vertical-menu="750px"
                                    >
                                    <Link
                                        href={route('login')}
                                        className="ekit-menu-nav-link"
                                    >
                                        Login
                                    </Link>
                                    </li>
                                </ul>
                                <div className="elementskit-nav-identity-panel">
                                    <div className="elementskit-site-title">
                                    <a
                                        className="elementskit-nav-logo"
                                        href="index.html"
                                        target="_self"
                                        rel=""
                                    >
                                        <img
                                        width={324}
                                        height={137}
                                        src="/images/logo.png"
                                        className="attachment-full size-full"
                                        alt=""
                                        decoding="async"
                                        srcSet="/images/logo.png"
                                        sizes="(max-width: 324px) 100vw, 324px"
                                        />
                                    </a>
                                    </div>
                                    <button
                                    className="elementskit-menu-close elementskit-menu-toggler"
                                    type="button"
                                    >
                                    X
                                    </button>
                                </div>
                                </div>
                                <div className="elementskit-menu-overlay elementskit-menu-offcanvas-elements elementskit-menu-toggler ekit-nav-menu--overlay" />
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </section>
                </div>
            </div>
            </div>
        </section> 
        </div>
    </div>
    </div>
  )
}

export default Header;
