# Monthly Progress Report #1 — Research Phase

**Project:** Foreign Entrepreneur Helper App (외국인 창업 도우미 앱)
**Milestone:** Week 1–2 — Research & Planning
**Team:** Adem Bensalem, Mathis Cornic, Justin Edon
**Supervisor:** Prof. Seokyoung Ahn
**Report date:** June 30, 2026

This report covers three of the five tasks completed during the Research & Planning milestone:

1. Research on Korean startup regulations for foreigners
2. Study of visa requirements (D-8-4, D-8-4S, D-10-2, F-2-7)
3. Analysis of existing apps and services

The findings below are not theoretical — they are the actual content basis we built into the website prototype (the step-by-step roadmap on foreign-k-startup), which has already been implemented as a working showcase site.

---

## 1. Research: Korean Startup Regulations for Foreigners

Setting up a company in Korea as a foreign founder follows a well-defined regulatory path, structured around four areas: legal structure, registered address, company registration, and taxation.

### 1.1 Legal structure

Two statuses cover the vast majority of foreign startup formations in Korea:

| | Chusik Hoesa (주식회사) | Yuhan Hoesa (유한회사) |
|---|---|---|
| Type | Joint-stock company | Limited liability company |
| Best for | Startups raising funding, multiple co-founders | Solo founders / small teams, services & consulting |
| Minimum setup | 1 shareholder + 1 director | 1 member (100% foreign capital allowed) |
| Strengths | Easier to issue shares to investors; preferred by Korean VCs, accelerators, and public programs | Simpler incorporation and day-to-day administration; no statutory auditor required |
| Watch out for | Formal governance required (general meetings, shareholder register, minutes); statutory auditor mandatory above 1 billion KRW capital | Converting to a Chusik Hoesa later is possible but must be planned ahead |

Key regulatory facts applying to both structures:
- **100% foreign capital is allowed** — no local partner is required.
- **A single shareholder is sufficient** to found and hold either structure.
- Registration cost is roughly **0.4% of registered capital** (minimum 112,500 KRW), excluding attorney fees.

### 1.2 Business address (head office)

A registered Korean address is mandatory and becomes the official **본점** (head office) recorded in the articles of incorporation. Four options exist:

| Option | Indicative cost | Suited for |
|---|---|---|
| Virtual office | ≈125,000–300,000 KRW/month | Founders based outside Korea or remote teams |
| Co-working space | from ≈120,000 KRW/month | Small teams wanting a real workspace |
| Public startup center (e.g. Global Startup Center, KISED incubators) | Free to very low cost, by selection | Founders eligible for government support, limited spots |
| Personal address | 0 KRW | Unregulated activities with no public reception |

Important regulatory points: the address determines the company's tax jurisdiction and competent court; changing it after registration requires amending the articles of incorporation (본점이전); and some regulated activities require specific commercial zoning.

### 1.3 Company registration process

Registration runs through three sequential phases, each producing a document required for the next:

1. **Investment notification & capital deposit** — Notify the foreign direct investment to KOTRA or a forex-licensed bank, then deposit capital in a temporary foreign-currency account. Produces: foreign exchange transaction certificate (외국환거래신고필증), deposit balance certificate.
2. **Company name reservation** — Check and reserve the company name via Start-Biz Online, in compliance with Korean naming/industry classification rules.
3. **Filing articles of incorporation with the commercial court** — Submit via the Internet Registry Office (인터넷등기소): articles of incorporation, deposit balance certificate, apostilled passports of directors/shareholders, notarized power of attorney (if filed by an agent).

All foreign documents require notarization + apostille/consular legalization + an official Korean translation. The process yields the **corporate registration number (법인등록번호)** and the **corporate seal certificate (인감증명서)**.

### 1.4 Tax obligations

Before normal operations, two formalities are required: the **business registration certificate (사업자등록증)** via Hometax (within 20 days of starting operations), and the appointment of a **mandatory Korean tax agent (회계대리인)** who files all returns in Korean with the National Tax Service.

Corporate income tax (법인세) is progressive:

| Bracket | Rate |
|---|---|
| Up to 200M KRW taxable profit | 10% (almost all early-stage startups) |
| 200M–20B KRW | 20% |
| 20B–300B KRW | 22% |
| Above 300B KRW | 25% |

Other key facts: **10% VAT**, filed quarterly; a **50–100% startup tax reduction** during the first 5 years (capped at 500M KRW cumulative), depending on head office location; and a 3-month deadline to file the annual corporate income tax return after fiscal year close.

---

## 2. Study: Visa Requirements (D-8, D-8-4S, D-10-2, F-2-7)

Four main visa paths lead to founding a company in Korea as a foreigner:

| Visa | Name | Path | Duration | Best suited for |
|---|---|---|---|---|
| **D-8-4** | Tech Investor Visa (OASIS) | Standard | 1 year, renewable up to 2 years | Founders with a developed project: business plan, patent, prototype, or recognized experience |
| **D-8-4S** | Streamlined path (since Nov. 2024) | Fast track | 1 year, renewable | Founders already backed by an approved program (K-Startup Grand Challenge, TIPS, Born2Global...) |
| **D-10-2** | Startup preparation visa | Preparation | 6 months, renewable once | Founders wanting to explore the market and prepare their OASIS application before committing |
| **F-2-7** | Points-based talent visa | Alternative | 3 years, renewable, can lead to F-5 (permanent residency) | Senior profiles (advanced degree, experience, income) wanting flexibility, not tied to one company |

A special case applies to **D-2 student visa holders**: many universities (including PNU) have an industry-university cooperation foundation that supports the transition from student status directly to D-8-4 founder status, without leaving the country.

### 2.1 The standard D-8-4 journey (7 steps)

1. **Prepare the application** — degrees, resume, business plan, proof of experience/patents, translated and apostilled.
2. **Submit on the OASIS platform** — KISED's online platform, assessed under a points-based scale (degree, experience, patents, funding).
3. **Assessment & interview** — KISED reviews the file; an interview may be required depending on profile/industry.
4. **Recommendation letter** — issued by KISED if approved; required for the visa application.
5. **Company registration** — with the recommendation letter, finalize legal registration with the commercial court (see Section 1.3).
6. **Submit the visa application** — at a Korean consulate (if abroad) or the local immigration office (for a change of status).
7. **Visa approval & ARC card** — apply for the Alien Registration Card within 90 days of entering Korea.

### 2.2 Post-visa checklist

Regardless of the visa obtained, four points must be planned for:
- **Private health insurance** covering at least 100 million KRW, taken out before applying.
- A **clean criminal record** extract, apostilled/legalized with an official translation.
- The **Alien Registration Card (ARC)**, required within 90 days of arrival to open a bank account or get a phone plan.
- **Annual renewal**: actual company activity, revenue, and jobs created are reviewed against KISED's criteria.

### 2.3 Key takeaway for the app

Visa choice is the very first strategic decision in the founder's journey — it determines how fast they can get set up, which steps are mandatory, and how much freedom they'll have to grow. This is why our roadmap places "Get the right visa" as Step 1, ahead of legal structure and registration.

---

## 3. Analysis of Existing Apps & Services

Foreign founders currently rely on **at least eight separate official Korean platforms**, each covering one isolated part of the journey, with no single guided path connecting them:

| Service | Role | Operator |
|---|---|---|
| **OASIS** (KISED) | Points-based visa assessment platform for D-8-4 | Korea Institute of Startup & Entrepreneurship Development |
| **K-Startup Grand Challenge** | Government accelerator program, can fast-track to D-8-4S | Korean government |
| **TIPS** | Investment & technical support for deep-tech startups | KISED |
| **Born2Global** | International acceleration center for foreign-market entry | Government-backed center |
| **Global Startup Center** | Free coworking + registration/visa support in Gangnam | KISED / Ministry of SMEs and Startups |
| **Start-Biz Online (법인설립시스템)** | Company name reservation & incorporation filing | Korean judiciary |
| **Internet Registry Office (인터넷등기소)** | Official commercial registry, incorporation certificate | Supreme Court of Korea |
| **Hometax (국세청)** | Tax registration, VAT and corporate tax filing | National Tax Service |
| **KOTRA / Invest Korea** | FDI notification, free support for foreign investors | Korea Trade-Investment Promotion Agency |
| **KOSME** | Preferential-rate loans for SMEs and startups | Korea SMEs and Startups Agency |
| **Hi Korea** | Immigration/ARC administration | Ministry of Justice |

### 3.1 Observed gaps

- **Fragmentation**: a founder must navigate 8+ unrelated portals, in a specific order, to complete one journey (visa → registration → tax → banking → funding).
- **Language barrier**: most of these platforms are Korean-first; English support is partial or inconsistent across them.
- **No unified roadmap**: none of these services explains *which step comes before which*, or how a document obtained on one platform (e.g. the KISED recommendation letter) becomes a requirement on the next (company registration).
- **No localized glossary**: Korean administrative/legal terms (본점, 인감증명서, 회계대리인...) are rarely explained in plain English for newcomers.
- **No single source of truth for visa comparison**: the four visa paths (D-8-4, D-8-4S, D-10-2, F-2-7) are described separately, on separate sites, never compared side by side.

### 3.2 Positioning of our project

These gaps directly justify our product: a single, guided, bilingual roadmap that sequences the existing official steps (visa → structure → address → registration → banking → tax → funding → insurance), explains the jargon in context, and links out to the correct official portal at the right time — without replacing or duplicating any government service.

---

## Next steps

This research directly fed into the two remaining Research & Planning tasks (defining app features/user stories and the project timeline) and is already reflected in the current website prototype's 8-step roadmap and step-by-step guides. The next milestone (Week 3–4: Design & Architecture) will translate this research into wireframes, the database schema, and the technical stack decision.
