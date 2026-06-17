export const STEP_COUNT = 8;
const STEP_SLUG_LANGUAGE = "en";

const slugify = (value) => {
    if (!value) return "";

    return value
        .toString()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};

const normalizeStepNumber = (stepNumber) => {
    const parsed = parseInt(stepNumber, 10);
    if (Number.isNaN(parsed) || parsed < 1 || parsed > STEP_COUNT) return null;
    return parsed;
};

export const getStepSlug = (stepNumber, t) => {
    const normalized = normalizeStepNumber(stepNumber);
    if (!normalized) return null;

    const title = t(`roadmap.step${normalized}.title`, { lng: STEP_SLUG_LANGUAGE });
    const slug = slugify(title);
    return slug || `step-${normalized}`;
};

export const getStepPath = (stepNumber, t) => {
    const slug = getStepSlug(stepNumber, t);
    return slug ? `/step/${encodeURIComponent(slug)}` : "/";
};

export const getStepIndexFromParam = (paramValue, t) => {
    if (!paramValue) return null;

    const decodedParam = decodeURIComponent(paramValue).trim();
    if (!decodedParam) return null;

    if (/^\d+$/.test(decodedParam)) {
        return normalizeStepNumber(decodedParam);
    }

    for (let i = 1; i <= STEP_COUNT; i += 1) {
        if (decodedParam === getStepSlug(i, t)) {
            return i;
        }
    }

    // Backward compatibility: accept previous locale-based slugs and redirect to EN canonical slug.
    for (let i = 1; i <= STEP_COUNT; i += 1) {
        const legacyLocalizedSlug = slugify(t(`roadmap.step${i}.title`));
        if (decodedParam === legacyLocalizedSlug) {
            return i;
        }
    }

    return null;
};

export const getStepAnchorId = (stepNumber) => {
    const normalized = normalizeStepNumber(stepNumber);
    if (!normalized) return null;
    return `step-${String(normalized).padStart(2, "0")}`;
};
