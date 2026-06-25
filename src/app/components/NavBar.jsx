import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../styles/NavBar.scss";

const NavBar = () => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  const languages = [
    { code: "ar", label: t("arabic") },
    { code: "zh", label: t("chinese") },
    { code: "en", label: t("english") },
    { code: "fr", label: t("french") },
    { code: "hi", label: t("hindi") },
    { code: "ja", label: t("japanese") },
    { code: "ko", label: t("korean") },
    { code: "pt", label: t("portuguese") },
    { code: "ru", label: t("russian") },
    { code: "es", label: t("spanish") },
  ];

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLangChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    setLangOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__container">

        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-foreign">Foreign</span>
          <span className="navbar__logo-k"> K-Startup</span>
          <span className="navbar__logo-star">*</span>
        </Link>

        {/* Language dropdown */}
        <div className="navbar__lang" ref={langRef}>
          <button
            className={`navbar__lang-trigger ${langOpen ? "navbar__lang-trigger--open" : ""}`}
            onClick={() => setLangOpen(!langOpen)}
            aria-haspopup="listbox"
            aria-expanded={langOpen}
          >
            <span className="navbar__lang-trigger-flag" data-code={currentLang.code}>
              {currentLang.code}
            </span>
            <span className="navbar__lang-trigger-label">{currentLang.label}</span>
            <svg className="navbar__lang-trigger-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {langOpen && (
            <ul className="navbar__lang-dropdown" role="listbox">
              {languages.map((lang) => (
                <li
                  key={lang.code}
                  className={`navbar__lang-option ${i18n.language === lang.code ? "navbar__lang-option--active" : ""}`}
                  role="option"
                  aria-selected={i18n.language === lang.code}
                  onClick={() => handleLangChange(lang.code)}
                >
                  <span className="navbar__lang-option-flag" data-code={lang.code}>
                    {lang.code}
                  </span>
                  <span className="navbar__lang-option-label">{lang.label}</span>
                  {i18n.language === lang.code && (
                    <svg className="navbar__lang-option-check" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </nav>
  );
};

export default NavBar;