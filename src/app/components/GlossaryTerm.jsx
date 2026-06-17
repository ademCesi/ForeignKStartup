import React from "react";

// ─── Glossary ───────────────────────────────────────────────────────────────
// Key acronyms/programs mentioned across the visa guide, with a short
// explanation and a link to the official resource when one exists.
export const GLOSSARY = {
    "KISED": {
        definition: "Korea Institute of Startup & Entrepreneurship Development : l'agence publique qui accompagne les fondateurs étrangers et gère le programme OASIS.",
        url: "https://www.kised.or.kr"
    },
    "OASIS": {
        definition: "One-stop Assistance Service for International Startups : la plateforme de KISED qui évalue votre dossier par points pour le visa D-8-4.",
        url: "https://www.kised.or.kr"
    },
    "K-Startup Grand Challenge": {
        definition: "Programme d'accélération du gouvernement coréen pour startups étrangères, avec recommandation directe vers le visa D-8-4S.",
        url: "https://www.k-startupgc.org"
    },
    "TIPS": {
        definition: "Tech Incubator Program for Startup : programme coréen d'investissement et d'accompagnement technique pour les startups deep-tech.",
        url: "https://www.kised.or.kr/menu.es?mid=a20209040000"
    },
    "KOSME": {
        definition: "Korea SMEs and Startups Agency (중소벤처기업진흥공단) : l'agence publique qui distribue les prêts à taux préférentiel (정책자금) aux PME et startups coréennes.",
        url: "https://www.kosme.or.kr"
    },
    "Born2Global": {
        definition: "Centre coréen d'accélération à l'international qui aide les startups étrangères à se développer sur le marché coréen et mondial."
    },
    "ARC": {
        definition: "Alien Registration Card : la carte de résident étranger, à demander dans les 90 jours suivant votre arrivée en Corée.",
        url: "https://www.hikorea.go.kr"
    },
    "Start-Biz Online": {
        definition: "Le portail officiel coréen de constitution de société en ligne (법인설립시스템) : il permet de vérifier et réserver le nom de votre société, préparer les statuts puis transmettre le dossier d'immatriculation au tribunal du commerce.",
        url: "https://www.startbiz.go.kr"
    },
    "Internet Registry Office": {
        definition: "Le registre du commerce en ligne de la Cour suprême de Corée (인터넷등기소) : votre société y est officiellement immatriculée et vous pouvez y obtenir votre certificat d'immatriculation (법인등기사항증명서).",
        url: "https://www.iros.go.kr"
    },
    "Hometax": {
        definition: "Le portail du Service national des impôts coréen (국세청) : il permet d'enregistrer votre société auprès de l'administration fiscale et de gérer vos déclarations de TVA et d'impôt sur les sociétés.",
        url: "https://www.hometax.go.kr"
    },
    "KOTRA": {
        definition: "Korea Trade-Investment Promotion Agency : son pôle Invest Korea / Foreign Investor Support Center accompagne gratuitement les investisseurs étrangers pour la notification FDI et la création de leur société.",
        url: "https://www.investkorea.org"
    },
    "Global Startup Center": {
        definition: "Centre gratuit pour fondateurs étrangers à Gangnam (Séoul), opéré par KISED et le ministère des PME et Startups : espace de coworking, accompagnement à l'immatriculation et au visa, mise en réseau.",
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
