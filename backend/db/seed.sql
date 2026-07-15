-- Reference data used by the demo. Coordinates are indicative (city-block
-- level), good enough for the office finder map/distance UI; refine with
-- real geocoding before shipping.

TRUNCATE user_documents, user_progress, documents, roadmap_steps, visas, services RESTART IDENTITY CASCADE;

INSERT INTO roadmap_steps (step_order, title, description, official_url) VALUES
  (1, 'Get the right visa', 'Compare D-8-4, D-8-4S, D-10-2, and F-2-7 and choose the path that fits your situation.', 'https://www.hikorea.go.kr'),
  (2, 'Choose your structure', 'Most founders pick a Chusik Hoesa (joint-stock) or a Yuhan Hoesa (limited liability).', 'https://www.startbiz.go.kr'),
  (3, 'Register your address', 'Secure a registered head office (bonjeom) address for the company.', NULL),
  (4, 'Register the company', 'File the incorporation with the commercial registry.', 'https://www.iros.go.kr'),
  (5, 'Open bank account', 'Open a corporate bank account with your incorporation certificate.', NULL),
  (6, 'Register for tax', 'Register for business and corporate tax with the National Tax Service.', 'https://www.hometax.go.kr'),
  (7, 'Apply for funding', 'Apply to accelerators, grants, or preferential-rate loans.', NULL),
  (8, 'Get insurance', 'Enroll in the required national insurance schemes for employees.', NULL);

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
