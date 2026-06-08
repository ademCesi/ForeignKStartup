import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logoPNU from "../assets/images/logoPNU.png";
import "../styles/Footer.scss";

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer__container">

                {/* Top row */}
                <div className="footer__top">

                    {/* Brand */}
                    <div className="footer__brand">
                        <div className="footer__logo">
                            <img src={logoPNU} alt="PNU Logo" className="footer__logo-img" />
                            <div className="footer__logo-text">
                                <span className="footer__logo-foreign">Foreign</span>
                                <span className="footer__logo-k"> K-Startup</span>
                                <span className="footer__logo-star">*</span>
                            </div>
                        </div>
                        <p className="footer__tagline">{t("footer.tagline")}</p>
                    </div>

                    {/* Contact */}
                    <div className="footer__contact">
                        <h4 className="footer__contact-name">
                            {t("footer.organization", { defaultValue: "Pusan National University V-SPACE" })}
                        </h4>
                        <p className="footer__contact-address">
                            {t("footer.addressLine1", { defaultValue: "2, Busandaehak-ro 63beon-gil, Geumjeong-gu, Busan" })}
                            <br />
                            {t("footer.addressLine2", { defaultValue: "Mechanical Engineering Building (303), Room 208 V-SPACE" })}
                        </p>
                        <div className="footer__contact-details">
                            <span>{t("footer.phone", { defaultValue: "Tel. 051-510-3261" })}</span>
                            <span>{t("footer.fax", { defaultValue: "Fax. 051-510-0787" })}</span>
                            <a href="mailto:pnuvspace@gmail.com" className="footer__contact-email">
                                pnuvspace@gmail.com
                            </a>
                        </div>
                    </div>

                </div>

                {/* Divider */}
                <div className="footer__divider" />

                {/* Bottom row */}
                <div className="footer__bottom">
                    <div className="footer__legal">
                        <Link to="/privacy" className="footer__legal-link">{t("footer.privacy")}</Link>
                        <span className="footer__legal-sep">|</span>
                        <Link to="/emailPrivacy" className="footer__legal-link">{t("footer.emailPolicy")}</Link>
                        <span className="footer__legal-sep">|</span>
                        <a href="mailto:pnuvspace@gmail.com" className="footer__legal-link">
                            {t("footer.contact", { defaultValue: "Contact" })}
                        </a>
                    </div>
                    <p className="footer__copyright">
                        <Link to="/" className="footer__copyright-link">
                            {t("footer.copyrightOwner", { defaultValue: "PNU V-Space" })}
                        </Link>
                        {" "}{t("footer.copyright", { defaultValue: "© Copyright" })} {currentYear}
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;