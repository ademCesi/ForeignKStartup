-- Reference data used by the demo. Coordinates are indicative (city-block
-- level), good enough for the office finder map/distance UI; refine with
-- real geocoding before shipping.

TRUNCATE user_documents, user_progress, documents, roadmap_steps, visas, services,
  funding_programs, glossary_terms RESTART IDENTITY CASCADE;

INSERT INTO roadmap_steps (step_order, title, description, official_url, details) VALUES
  (1, 'Get the right visa', 'Compare D-8-4, D-8-4S, D-10-2, and F-2-7 and choose the path that fits your situation.', 'https://www.hikorea.go.kr',
    'Choosing your visa is the very first strategic decision of your project: it determines how quickly you can get set up, the steps you''ll need to complete, and how much freedom you''ll have to grow your business.' || E'\n\n' ||
    'Four main visas are available to foreign founders in Korea. Find the situation that best matches your project to discover the most suitable path, compare the options in detail, then follow the typical journey to the D-8-4 visa.'),
  (2, 'Choose your structure', 'Most founders pick a Chusik Hoesa (joint-stock) or a Yuhan Hoesa (limited liability).', 'https://www.startbiz.go.kr',
    'Your company''s legal status determines your level of financial liability, your tax regime, your credibility with banks and investors, and how burdensome your day-to-day administration will be. Changing it after registration remains possible, but proves costly and time-consuming - better to choose well from the start.' || E'\n\n' ||
    'Two statuses account for the vast majority of foreign startup formations in Korea: the Chusik Hoesa (joint-stock company) and the Yuhan Hoesa (limited liability company). Compare them based on your project, then review the key points common to both before registration.'),
  (3, 'Register your address', 'Secure a registered head office (bonjeom) address for the company.', NULL,
    'This address is not a mere administrative detail: recorded in the articles of incorporation filed with the commercial court, it becomes your 본점 (official head office) and determines where your company may legally operate. Changing it after registration requires updating the articles of incorporation and completing new registry formalities - so it''s best to make the right choice from the start.' || E'\n\n' ||
    'Four main options are available to foreign founders, from virtual offices to personal addresses. Compare them based on cost, what''s included, and the founder profile they suit, then check the points below before signing a lease or accepting a spot in an incubator.'),
  (4, 'Register the company', 'File the incorporation with the commercial registry.', 'https://www.iros.go.kr',
    'This step is the administrative core of your project: without registration, you cannot open a corporate bank account, hire staff, or legally issue invoices. The procedure involves several different authorities - the bank, KOTRA, the commercial court - and each document obtained serves as supporting evidence for the next step.' || E'\n\n' ||
    'Three phases follow one another, from depositing capital to filing the articles of incorporation with the court. Follow them in order, prepare the required documents in advance, and find out what you receive at the end of the process.'),
  (5, 'Open bank account', 'Open a corporate bank account with your incorporation certificate.', NULL,
    'Opening a corporate bank account turns the capital held in the temporary account into actual company cash flow. Korean banks apply strict anti-money-laundering checks - an in-branch visit is often required, along with a substantial set of documents - and then impose deadlines you must meet to finalize your foreign-invested company status with KOTRA, with penalties if you miss them.' || E'\n\n' ||
    'Some Korean banks are markedly more experienced with foreign founders'' applications than others: compare them before choosing your branch, then follow the timeline of deadlines to meet once your account is open.'),
  (6, 'Register for tax', 'Register for business and corporate tax with the National Tax Service.', 'https://www.hometax.go.kr',
    'Without a business registration certificate (사업자등록증), your company can neither issue tax invoices nor fully operate its corporate bank account - it''s the last administrative gate before normal operations. Foreign-invested companies must also appoint a Korean tax agent, responsible for preparing and filing all their returns in Korean with the NTS.' || E'\n\n' ||
    'Once these formalities are complete, your company enters the standard tax regime: progressive corporate income tax, 10% VAT, and, under certain conditions, a significant tax reduction for young companies.'),
  (7, 'Apply for funding', 'Apply to accelerators, grants, or preferential-rate loans.', NULL,
    'Between accelerator grants, R&D funding, and preferential public loans, the Korean government injects several billion KRW into its startup ecosystem every year. But most of this funding flows through selective programs: a company''s age, industry, and foreign-investor status determine access to each of them.' || E'\n\n' ||
    'Below are three entry points designed for foreign founders, followed by the criteria to check before putting together your application.'),
  (8, 'Get insurance', 'Enroll in the required national insurance schemes for employees.', NULL,
    'Enrollment in the 4 major social insurances (4대보험) must be completed within 14 days of hiring for health insurance, and by the 15th of the following month at the latest for the other three programs - missing this exposes you to retroactive contribution claims and, for some programs, penalties.' || E'\n\n' ||
    'Here''s how each of the four contributions is split between employer and employee, followed by three labor law benchmarks to know before your first hire.');

INSERT INTO documents (step_id, name, needs_apostille, needs_translation) VALUES
  (1, 'Passport', true, false),
  (1, 'Business plan', false, true),
  (2, 'Articles of incorporation', false, true),
  (2, 'Shareholder list', false, true),
  (2, 'Passport (apostilled)', true, false),
  (3, 'Lease agreement', false, true),
  (3, 'Proof of address', true, false),
  (4, 'Corporate seal (inkan) registration', false, false),
  (4, 'Incorporation filing form', false, false),
  (5, 'Incorporation certificate', false, false),
  (5, 'Corporate seal certificate (ingam jeungmyeongseo)', false, false),
  (6, 'Business registration certificate', false, false),
  (7, 'Business plan', false, true),
  (7, 'Financial statements', false, true),
  (8, 'Employee roster', false, false);

INSERT INTO visas (code, name, duration, best_for) VALUES
  ('D-8-4', 'Corporate Investment Visa', '2 years, renewable', 'Founders who already have a registered company and at least 100,000,000 KRW to invest.'),
  ('D-8-4S', 'OASIS Points-Based Startup Visa', '2 years, renewable', 'Founders with a registered patent, working prototype, or accelerator selection who score well on the OASIS points system.'),
  ('D-10-2', 'Startup Preparation Visa', '6 months, renewable', 'Founders still validating their idea who do not yet have a company or capital in place.'),
  ('F-2-7', 'Points-Based Long-Term Residence', '3 years, renewable', 'Founders who already hold long-term residence status in Korea and want a stable base to found a company.');

INSERT INTO services (name, role, operator, url, category, address, lat, lng) VALUES
  ('OASIS', 'Points-based visa assessment platform for D-8-4', 'Korea Institute of Startup & Entrepreneurship Development', 'https://oasis.kised.or.kr', 'visa', 'Eumseong, Chungcheongbuk-do', 36.9397, 127.6903),
  ('K-Startup Grand Challenge', 'Government accelerator program, can fast-track to D-8-4S', 'Korean government', 'https://www.k-startupgc.org', 'funding', 'Pangyo, Seongnam', 37.4009, 127.1120),
  ('TIPS', 'Investment and technical support for deep-tech startups', 'KISED', 'https://www.jointips.or.kr', 'funding', 'Yangjae-dong, Seocho-gu, Seoul', 37.4783, 127.0396),
  ('Born2Global', 'International acceleration center for foreign-market entry', 'Government-backed center', 'https://www.born2global.com', 'funding', 'Pangyo, Seongnam', 37.4004, 127.1086),
  ('Global Startup Center', 'Free coworking with registration and visa support in Gangnam', 'KISED / Ministry of SMEs and Startups', 'https://www.gsc.kr', 'coworking', 'Yeoksam-dong, Gangnam-gu, Seoul', 37.5006, 127.0364),
  ('Start-Biz Online (법인설립시스템)', 'Company name reservation and incorporation filing', 'Korean judiciary', 'https://www.startbiz.go.kr', 'registration', 'Seocho-gu, Seoul', 37.4936, 127.0028),
  ('Internet Registry Office (인터넷등기소)', 'Official commercial registry, incorporation certificate', 'Supreme Court of Korea', 'https://www.iros.go.kr', 'registration', 'Seocho-gu, Seoul', 37.4936, 127.0028),
  ('Hometax (국세청)', 'Tax registration, VAT and corporate tax filing', 'National Tax Service', 'https://www.hometax.go.kr', 'tax', 'Jongno-gu, Seoul', 37.5730, 126.9794),
  ('KOTRA / Invest Korea', 'FDI notification, free support for foreign investors', 'Korea Trade-Investment Promotion Agency', 'https://www.investkorea.org', 'support', 'Yeongdong-daero, Gangnam-gu, Seoul', 37.5089, 127.0632),
  ('KOSME', 'Preferential-rate loans for SMEs and startups', 'Korea SMEs and Startups Agency', 'https://www.kosmes.or.kr', 'funding', 'Jinju, Gyeongsangnam-do', 35.1968, 128.0980),
  ('Hi Korea', 'Immigration and ARC administration', 'Ministry of Justice', 'https://www.hikorea.go.kr', 'visa', 'Mokdong, Yangcheon-gu, Seoul', 37.5251, 126.8650);

INSERT INTO funding_programs (name, type, description, eligibility, url) VALUES
  ('K-Startup Grand Challenge', 'grant',
    'The Korean government''s flagship program for startups founded by non-Koreans: about a hundred teams selected each edition, including a track reserved for foreign students. Winners receive on average 50,000,000 KRW (up to 80,000,000) for product development, localization, and marketing, with 8 months of support through to COMEUP''s Demo Day.',
    'Non-Korean startup less than 7 years old (10 years for deep tech). Priority sectors: AI, biotech, fintech, mobility, energy. Winners get privileged access to the D-8-4S visa.',
    'https://www.k-startupgc.org'),
  ('TIPS', 'rnd',
    'An R&D and commercialization grant that can exceed 100,000,000 KRW per company, within a national pool raised to 5,000,000,000 KRW. Access isn''t direct: you need a recommendation from an approved TIPS operator - an investment fund or accelerator partnered with the program.',
    'Startup less than 7 years old, recommended by an approved TIPS operator. Foreign startups need at least USD 1 million already raised from foreign investors. Can be combined with other sector-specific grants.',
    'https://www.jointips.or.kr'),
  ('KOSME loans (정책자금)', 'loan',
    'Public funds (정책자금) from the Korea SMEs and Startups Agency finance cash flow, investment, and exports at below-market rates. For 2026 the national pool exceeds 4,400,000,000,000 KRW, geared toward manufacturing, productive investment, and international expansion.',
    'Company registered in Korea, generally for less than 7 years. Apply through the Policy Fund Navigator, which directs you to the right program based on your profile. Can be combined with grants.',
    'https://www.kosme.or.kr'),
  ('Born2Global Acceleration', 'accelerator',
    'A government-backed acceleration track for foreign-market entry: mentoring, investor matching, and access to a network of over a thousand partner organizations for startups looking to expand beyond Korea.',
    'Startup registered in Korea, at any stage, with an interest in international expansion.',
    'https://www.born2global.com');

INSERT INTO glossary_terms (term_kr, romanization, definition_en, definition_fr, definition_kr) VALUES
  ('본점', 'bonjeom', 'The registered head office of the company, recorded in the articles of incorporation. It determines where the company may legally operate and its tax jurisdiction.', 'Le siège social enregistré de la société, inscrit dans les statuts. Il détermine où la société peut légalement opérer et sa juridiction fiscale.', '정관에 기재된 회사의 등록된 본사 주소로, 회사의 법적 활동 장소와 관할 세무서를 결정합니다.'),
  ('정관', 'jeonggwan', 'The articles of incorporation: the founding legal document filed with the commercial court, defining the company''s structure, capital, and head office.', 'Les statuts : le document juridique fondateur déposé au tribunal de commerce, définissant la structure, le capital et le siège social de la société.', '회사의 구조, 자본, 본점을 정하여 법원에 제출하는 설립 근거 문서입니다.'),
  ('인감증명서', 'ingam jeungmyeongseo', 'The certificate of the corporate seal (inkan). Used together with the seal to authenticate the company''s legal and banking documents.', 'Le certificat du sceau de la société (inkan), utilisé avec le sceau pour authentifier les documents juridiques et bancaires de l''entreprise.', '법인 인감과 함께 사용되어 회사의 법적, 금융 문서를 인증하는 데 쓰이는 증명서입니다.'),
  ('법인등록번호', 'beobin deungnok beonho', 'The corporate registration number issued by the commercial court, officially certifying the company''s legal existence.', 'Le numéro d''immatriculation de la société délivré par le tribunal de commerce, certifiant officiellement son existence juridique.', '상업등기소가 발급하는 법인 등록 번호로, 회사의 법적 존재를 공식적으로 증명합니다.'),
  ('사업자등록증', 'saeopja deungnokjeung', 'The business registration certificate, required to issue tax invoices and fully operate the corporate bank account. Apply within 20 days of starting operations.', 'Le certificat d''immatriculation professionnelle, nécessaire pour émettre des factures fiscales et utiliser pleinement le compte bancaire de l''entreprise.', '세금계산서를 발행하고 법인 계좌를 정상적으로 사용하기 위해 필요한 사업자 등록 증명서입니다.'),
  ('회계대리인', 'hoegye daeriin', 'The mandatory Korean tax agent that foreign-invested companies must appoint to prepare and file their VAT and corporate tax returns in Korean.', 'L''agent fiscal coréen obligatoire que les sociétés à investissement étranger doivent mandater pour préparer et déposer leurs déclarations de TVA et d''impôt sur les sociétés.', '외국인 투자 기업이 부가가치세 및 법인세 신고를 위해 반드시 선임해야 하는 한국 세무 대리인입니다.'),
  ('외국환거래신고필증', 'oegukhwan georae singo piljeung', 'The foreign exchange transaction certificate confirming that a foreign direct investment has been notified to a bank or KOTRA.', 'Le certificat de déclaration de change confirmant qu''un investissement direct étranger a été notifié à une banque ou à KOTRA.', '외국인 직접투자를 은행이나 KOTRA에 신고했음을 확인하는 외국환거래 신고필증입니다.'),
  ('외국인투자기업등록증', 'oegugin tuja gieop deungnokjeung', 'The foreign-invested company certificate issued by KOTRA once the declared capital has been deposited, within 60 days of the deposit.', 'Le certificat de société à investissement étranger délivré par KOTRA une fois le capital déclaré déposé, dans les 60 jours suivant le dépôt.', '신고된 자본금 납입 후 60일 이내에 KOTRA가 발급하는 외국인투자기업 등록증입니다.'),
  ('세금계산서', 'segeum gyesanseo', 'The tax invoice issued for VAT-liable sales. A business registration certificate is required before a company can issue one.', 'La facture fiscale émise pour les ventes soumises à la TVA. Un certificat d''immatriculation professionnelle est requis avant de pouvoir en émettre.', '부가가치세 과세 대상 거래에 대해 발행하는 세금계산서로, 발행 전에 사업자등록증이 필요합니다.'),
  ('부가가치세', 'buga gachise', 'VAT: the standard 10% value-added tax applied to most goods and services, filed quarterly with the National Tax Service.', 'La TVA : la taxe sur la valeur ajoutée standard de 10 % appliquée à la plupart des biens et services, déclarée trimestriellement.', '대부분의 재화와 용역에 적용되는 표준 10% 부가가치세로, 국세청에 분기별로 신고합니다.'),
  ('법인세', 'beobinse', 'Corporate income tax: a progressive tax on a company''s annual taxable profit, from 10% up to 25% depending on the bracket.', 'L''impôt sur les sociétés : un impôt progressif sur le bénéfice imposable annuel de l''entreprise, de 10 % à 25 % selon la tranche.', '회사의 연간 과세 소득에 대해 구간별로 10%에서 25%까지 부과되는 누진 법인세입니다.'),
  ('퇴직금', 'toejikgeum', 'Severance pay owed to any employee with at least one year of continuous service, regardless of the reason for departure.', 'L''indemnité de départ due à tout employé ayant au moins un an d''ancienneté continue, quelle que soit la raison du départ.', '퇴사 사유와 관계없이 1년 이상 계속 근무한 근로자에게 지급해야 하는 퇴직금입니다.'),
  ('국민연금', 'gungmin yeongeum', 'National Pension: a mandatory contribution split equally (50/50) between employer and employee.', 'La retraite nationale : une cotisation obligatoire répartie à parts égales (50/50) entre employeur et employé.', '고용주와 근로자가 50대 50으로 부담하는 의무 국민연금 보험료입니다.'),
  ('국민건강보험', 'gungmin geongang boheom', 'National Health Insurance: a mandatory contribution split equally between employer and employee, plus a long-term care surcharge.', 'L''assurance maladie nationale : une cotisation obligatoire répartie à parts égales entre employeur et employé, avec une surtaxe pour les soins de longue durée.', '고용주와 근로자가 균등하게 부담하며 장기요양보험료가 추가되는 의무 건강보험입니다.'),
  ('고용보험', 'goyong boheom', 'Employment Insurance: funds unemployment benefits (split equally) plus an employer-only contribution for skills development.', 'L''assurance emploi : finance les allocations chômage (réparties également) ainsi qu''une cotisation additionnelle à la charge exclusive de l''employeur pour le développement des compétences.', '실업급여(균등 분담)와 고용주가 단독 부담하는 직업능력개발 비용을 포함하는 고용보험입니다.'),
  ('산재보험', 'sanjae boheom', 'Industrial Accident Compensation Insurance: paid entirely by the employer, at a rate that varies by industry and risk level.', 'L''assurance accidents du travail : entièrement à la charge de l''employeur, à un taux variable selon le secteur et le niveau de risque.', '업종과 위험도에 따라 요율이 달라지며 전액 고용주가 부담하는 산재보험입니다.'),
  ('4대보험', 'sadae boheom', 'The four mandatory social insurances combined: national pension, health insurance, employment insurance, and industrial accident insurance.', 'Les quatre assurances sociales obligatoires réunies : retraite nationale, assurance maladie, assurance emploi et assurance accidents du travail.', '국민연금, 건강보험, 고용보험, 산재보험을 합쳐서 부르는 4대 의무 사회보험입니다.'),
  ('주식회사', 'jusik hoesa', 'Chusik Hoesa, a joint-stock company: the structure best recognized by VCs, accelerators, and public programs, favored for fundraising.', 'La Chusik Hoesa, société par actions : la structure la mieux reconnue par les fonds de capital-risque, les accélérateurs et les programmes publics, privilégiée pour lever des fonds.', '벤처캐피탈과 액셀러레이터가 가장 선호하는 주식회사 형태로, 투자 유치에 유리합니다.'),
  ('유한회사', 'yuhan hoesa', 'Yuhan Hoesa, a limited liability company: simpler to set up and run day-to-day, well suited for solo founders or small teams.', 'La Yuhan Hoesa, société à responsabilité limitée : plus simple à créer et à gérer au quotidien, bien adaptée aux fondateurs solos ou aux petites équipes.', '설립과 운영이 더 간단하여 1인 창업자나 소규모 팀에 적합한 유한회사입니다.'),
  ('본점이전', 'bonjeom ijeon', 'The formal registry procedure to change a company''s registered head office address, requiring an amendment to the articles of incorporation.', 'La procédure d''immatriculation formelle pour changer l''adresse du siège social d''une société, nécessitant une modification des statuts.', '정관 변경이 필요한, 회사의 등록된 본점 주소를 변경하는 공식 등기 절차입니다.');
