import React from "react";

// ─── Glossary ───────────────────────────────────────────────────────────────
// Key acronyms/programs mentioned across the visa guide, with a short
// explanation and a link to the official resource when one exists.
export const GLOSSARY = {
    "KISED": {
        definition: "Korea Institute of Startup & Entrepreneurship Development: the public agency that supports foreign founders and runs the OASIS program.",
        url: "https://www.kised.or.kr"
    },
    "OASIS": {
        definition: "One-stop Assistance Service for International Startups: KISED's platform that scores your application on a points-based scale for the D-8-4 visa.",
        url: "https://www.kised.or.kr"
    },
    "K-Startup Grand Challenge": {
        definition: "Acceleration program run by the Korean government for foreign startups, with a direct recommendation toward the D-8-4S visa.",
        url: "https://www.k-startupgc.org"
    },
    "TIPS": {
        definition: "Tech Incubator Program for Startup: a Korean investment and technical support program for deep-tech startups.",
        url: "https://www.kised.or.kr/menu.es?mid=a20209040000"
    },
    "KOSME": {
        definition: "Korea SMEs and Startups Agency (중소벤처기업진흥공단): the public agency that distributes preferential-rate loans (정책자금) to Korean SMEs and startups.",
        url: "https://www.kosme.or.kr"
    },
    "Born2Global": {
        definition: "Korean center for international acceleration that helps foreign startups grow in the Korean and global markets."
    },
    "ARC": {
        definition: "Alien Registration Card: the foreign resident card, to be applied for within 90 days of your arrival in Korea.",
        url: "https://www.hikorea.go.kr"
    },
    "Start-Biz Online": {
        definition: "The official Korean online company incorporation portal (법인설립시스템): it lets you check and reserve your company name, prepare the articles of incorporation, and then submit the registration filing to the commercial court.",
        url: "https://www.startbiz.go.kr"
    },
    "Internet Registry Office": {
        definition: "The online commercial registry of the Supreme Court of Korea (인터넷등기소): your company is officially registered there, and you can obtain your certificate of incorporation (법인등기사항증명서).",
        url: "https://www.iros.go.kr"
    },
    "Hometax": {
        definition: "The portal of Korea's National Tax Service (국세청): it lets you register your company with the tax administration and manage your VAT and corporate tax filings.",
        url: "https://www.hometax.go.kr"
    },
    "KOTRA": {
        definition: "Korea Trade-Investment Promotion Agency: its Invest Korea / Foreign Investor Support Center division provides free support to foreign investors for FDI notification and company setup.",
        url: "https://www.investkorea.org"
    },
    "Global Startup Center": {
        definition: "Free center for foreign founders in Gangnam (Seoul), operated by KISED and the Ministry of SMEs and Startups: coworking space, support with registration and visas, and networking.",
        url: "https://www.startup-korea.com"
    }
};

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const TERMS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length).map(escapeRegex);
const GLOSSARY_REGEX = new RegExp(`\\b(${TERMS.join("|")})\\b`, "g");

export const GlossaryTerm = ({ term }) => {
    const entry = GLOSSARY[term];

    const content = (
        <>
            {term}
            <span className="glossary-term__tooltip">{entry.definition}</span>
        </>
    );

    if (entry.url) {
        return (
            <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glossary-term glossary-term--link"
                title={entry.definition}
            >
                {content}
            </a>
        );
    }

    return (
        <span className="glossary-term" tabIndex={0} title={entry.definition}>
            {content}
        </span>
    );
};

// Splits a string and wraps known glossary terms with <GlossaryTerm>.
export const withGlossary = (text) => {
    if (!text) return text;
    return text.split(GLOSSARY_REGEX).map((part, index) =>
        GLOSSARY[part] ? <GlossaryTerm key={`glossary-${index}`} term={part} /> : part
    );
};
