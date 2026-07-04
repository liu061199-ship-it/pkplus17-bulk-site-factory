import type { Article, SiteConfig } from "@/lib/site-types";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    };
    return map[char];
  });
}

function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

const lastModified = "2026-07-04";

export function keywordSlug(keyword: string) {
  return keyword
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function keywordLinks(site: SiteConfig) {
  return site.keywords
    .map((keyword) => `<a href="/keywords/${escapeHtml(keywordSlug(keyword))}/">${escapeHtml(keyword)}</a>`)
    .join("");
}

function keywordClusterSection(site: SiteConfig) {
  return `<section class="band">
      <h2>${escapeHtml(site.siteName)} Keyword Focus</h2>
      <p>This page is mapped around Pakistan search intent for ${escapeHtml(site.siteName)}, with supporting pages for each keyword cluster.</p>
      <div class="toc keyword-cloud">${keywordLinks(site)}</div>
    </section>`;
}

function primaryKeywordSection(site: SiteConfig) {
  const primaryKeyword = site.keywords[0];
  if (!primaryKeyword) return "";

  return `<section class="band">
      <h2>Main ${escapeHtml(site.siteName)} Keyword Hub</h2>
      <p>Use the primary keyword page when you need the most direct summary for ${escapeHtml(primaryKeyword)}, APK checks, account setup, Pakistan payment notes, and related tutorials.</p>
      <p><a class="button" href="/keywords/${escapeHtml(keywordSlug(primaryKeyword))}/">Open ${escapeHtml(primaryKeyword)} guide</a></p>
    </section>`;
}

function breadcrumbSchema(site: SiteConfig, path: string, pageTitle: string) {
  const baseUrl = `https://${site.domain}`;
  const items = [
    { "@type": "ListItem", position: 1, name: site.siteName, item: baseUrl }
  ];

  if (path !== "/") {
    items.push({ "@type": "ListItem", position: 2, name: pageTitle, item: `${baseUrl}${path}` });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items
  };
}

function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

function layout(
  site: SiteConfig,
  path: string,
  body: string,
  pageTitle = site.title,
  pageDescription = site.description,
  extraSchemas: unknown[] = []
) {
  const baseUrl = `https://${site.domain}`;
  const canonical = `${baseUrl}${path}`;
  const authUrl = site.authUrl || site.downloadUrl;
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      name: site.siteName,
      operatingSystem: "Android",
      applicationCategory: "GameApplication",
      softwareVersion: site.appVersion,
      fileSize: site.appSize,
      dateModified: lastModified,
      offers: { "@type": "Offer", price: "0", priceCurrency: "PKR" },
      url: baseUrl,
      description: pageDescription
    },
    breadcrumbSchema(site, path, pageTitle),
    ...extraSchemas
  ];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(pageDescription)}" />
  <meta name="keywords" content="${escapeHtml(site.keywords.join(", "))}" />
  <meta name="robots" content="index, follow" />
  <meta name="last-modified" content="${lastModified}" />
  <meta property="og:title" content="${escapeHtml(pageTitle)}" />
  <meta property="og:description" content="${escapeHtml(pageDescription)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${baseUrl}${escapeHtml(site.logo)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" href="${escapeHtml(site.logo)}" />
  <script type="application/ld+json">${jsonLd(schemas)}</script>
  <style>
    :root { --brand: ${site.themeColor}; --ink: #10141f; --muted: #5b6475; --line: #dfe5ef; --soft: #f4f7fb; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: var(--ink); background: var(--soft); }
    a { color: var(--brand); font-weight: 700; }
    header { background: linear-gradient(135deg, #0f172a 0%, #172033 58%, var(--brand) 160%); color: #fff; }
    nav { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 16px min(5vw, 56px); max-width: 1180px; margin: 0 auto; }
    nav a { color: #fff; text-decoration: none; }
    .brand { display: flex; align-items: center; gap: 10px; font-size: 19px; font-weight: 900; }
    .logo { width: 42px; height: 42px; border-radius: 10px; background: #fff; display: grid; place-items: center; overflow: hidden; color: var(--brand); }
    .logo img { width: 100%; height: 100%; object-fit: cover; }
    .nav-actions { display: flex; align-items: center; gap: 18px; }
    .nav-links { display: flex; align-items: center; gap: 16px; font-size: 14px; }
    .auth-links { display: flex; align-items: center; gap: 8px; }
    .auth-link { min-height: 38px; padding: 9px 13px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, .28); font-size: 14px; font-weight: 900; }
    .auth-link.register { background: #22c55e; border-color: #22c55e; color: #062111; }
    .hero { max-width: 1180px; margin: 0 auto; padding: 42px min(5vw, 56px) 48px; display: grid; grid-template-columns: minmax(0, 1.2fr) 360px; gap: 26px; align-items: center; }
    .eyebrow { color: #b9f7d0; font-size: 13px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
    h1 { font-size: clamp(36px, 7vw, 68px); line-height: .98; margin: 12px 0 18px; letter-spacing: 0; }
    h2 { font-size: 30px; margin: 0 0 14px; }
    h3 { font-size: 21px; margin: 0 0 8px; }
    p { font-size: 17px; line-height: 1.7; color: var(--muted); }
    .hero p { color: #e7edf7; max-width: 700px; }
    .cta-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 22px; }
    .button { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 13px 18px; border-radius: 8px; background: #22c55e; color: #062111; text-decoration: none; font-weight: 900; box-shadow: 0 14px 32px rgba(34, 197, 94, .28); }
    .button.secondary { background: rgba(255, 255, 255, .12); color: #fff; border: 1px solid rgba(255, 255, 255, .24); box-shadow: none; }
    .apk-card { background: #fff; color: var(--ink); border-radius: 8px; padding: 20px; box-shadow: 0 20px 60px rgba(0, 0, 0, .22); }
    .apk-card dl { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 18px 0 0; }
    .apk-card dt { font-size: 12px; text-transform: uppercase; color: var(--muted); font-weight: 800; }
    .apk-card dd { margin: 4px 0 0; font-weight: 900; }
    main { max-width: 1180px; margin: 0 auto; padding: 34px min(5vw, 56px) 60px; }
    .band { background: #fff; border: 1px solid var(--line); border-radius: 8px; padding: 24px; margin-bottom: 20px; }
    .toc { display: flex; flex-wrap: wrap; gap: 10px; }
    .toc a { padding: 9px 12px; border-radius: 8px; background: var(--soft); text-decoration: none; }
    .keyword-cloud a { color: var(--ink); }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 16px; }
    .split { display: grid; grid-template-columns: minmax(0, 1.1fr) 320px; gap: 18px; align-items: start; }
    .card { border: 1px solid var(--line); background: #fff; border-radius: 8px; padding: 20px; }
    .content-list { display: grid; gap: 12px; padding-left: 20px; color: var(--muted); line-height: 1.7; font-size: 17px; }
    .content-list li strong { color: var(--ink); }
    .pill { display: inline-flex; padding: 7px 10px; border-radius: 999px; background: var(--soft); color: var(--muted); font-size: 13px; font-weight: 800; }
    .score { font-size: 44px; font-weight: 900; color: var(--brand); line-height: 1; }
    .timeline { display: grid; gap: 12px; border-left: 3px solid var(--brand); padding-left: 18px; }
    .steps { counter-reset: step; display: grid; gap: 12px; }
    .step { position: relative; padding-left: 48px; }
    .step:before { counter-increment: step; content: counter(step); position: absolute; left: 0; top: 3px; width: 32px; height: 32px; border-radius: 8px; background: var(--brand); color: #fff; display: grid; place-items: center; font-weight: 900; }
    .faq details { border-top: 1px solid var(--line); padding: 14px 0; }
    .faq summary { cursor: pointer; font-weight: 900; }
    footer { padding: 28px min(5vw, 56px); text-align: center; color: var(--muted); background: #fff; border-top: 1px solid var(--line); }
    @media (max-width: 820px) {
      .hero { grid-template-columns: 1fr; padding-top: 26px; }
      .split { grid-template-columns: 1fr; }
      .nav-links { display: none; }
      .auth-links { gap: 6px; }
      .auth-link { min-height: 36px; padding: 8px 10px; }
      .apk-card dl { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <header>
    <nav>
      <a class="brand" href="/"><span class="logo">${site.logo ? `<img src="${escapeHtml(site.logo)}" alt="${escapeHtml(site.siteName)} logo" />` : escapeHtml(site.siteName.charAt(0))}</span>${escapeHtml(site.siteName)}</a>
      <span class="nav-actions">
        <span class="nav-links"><a href="/about/">About</a><a href="/blog/">Blog</a><a href="/contact/">Contact</a></span>
        <span class="auth-links"><a class="auth-link" href="${escapeHtml(authUrl)}" rel="nofollow">Login</a><a class="auth-link register" href="${escapeHtml(authUrl)}" rel="nofollow">Register</a></span>
      </span>
    </nav>
    <section class="hero">
      <div>
        <div class="eyebrow">${escapeHtml(site.offerText)}</div>
        <h1>${escapeHtml(site.heroTitle)}</h1>
        <p>${escapeHtml(site.heroSubtitle)}</p>
        <div class="cta-row">
          <a class="button" href="${escapeHtml(site.downloadUrl)}">Download APK</a>
          <a class="button secondary" href="#install">Install Guide</a>
          <a class="button secondary" href="${escapeHtml(authUrl)}" rel="nofollow">Login</a>
          <a class="button" href="${escapeHtml(authUrl)}" rel="nofollow">Register</a>
        </div>
      </div>
      <aside class="apk-card">
        <h2>${escapeHtml(site.siteName)} APK</h2>
        <p>${escapeHtml(site.description)}</p>
        <p><span class="pill">${escapeHtml(site.contentFramework)}</span></p>
        <dl>
          <div><dt>Version</dt><dd>${escapeHtml(site.appVersion)}</dd></div>
          <div><dt>Size</dt><dd>${escapeHtml(site.appSize)}</dd></div>
          <div><dt>OS</dt><dd>Android</dd></div>
          <div><dt>Market</dt><dd>Pakistan</dd></div>
        </dl>
      </aside>
    </section>
  </header>
  <main>${path === "/" ? `${keywordClusterSection(site)}${body}` : body}</main>
  <footer>(c) ${new Date().getFullYear()} ${escapeHtml(site.siteName)}. Informational guide for Pakistan users.</footer>
</body>
</html>`;
}

export function renderHome(site: SiteConfig, articles: Article[]) {
  if (site.template === "review-magazine") {
    return renderReviewMagazine(site, articles);
  }
  if (site.template === "bonus-guide") {
    return renderBonusGuide(site, articles);
  }
  if (site.template === "howto-tutorial") {
    return renderHowToTutorial(site, articles);
  }
  if (site.template === "updates-hub") {
    return renderUpdatesHub(site, articles);
  }
  return renderDownloadLanding(site, articles);
}

function articleCards(articles: Article[], linkText = "Read guide") {
  return articles.map((article) => `<article class="card"><h3>${escapeHtml(article.title)}</h3><p>${escapeHtml(article.description)}</p><a href="/blog/${escapeHtml(article.slug)}/">${linkText}</a></article>`).join("");
}

function featureCards(site: SiteConfig) {
  return site.featureBullets.map((feature) => `<div class="card"><h3>${escapeHtml(feature)}</h3><p>${escapeHtml(site.siteName)} content is structured for Pakistan search intent and fast mobile reading.</p></div>`).join("");
}

function localIntentSection(site: SiteConfig) {
  return `<section class="band">
      <h2>Pakistan User Checklist</h2>
      <ul class="content-list">
        <li><strong>APK details:</strong> confirm version ${escapeHtml(site.appVersion)}, file size ${escapeHtml(site.appSize)}, Android compatibility, and source before installing.</li>
        <li><strong>Account setup:</strong> prepare a mobile number, choose a secure password, save login details, and review verification prompts carefully.</li>
        <li><strong>Payment context:</strong> compare ${escapeHtml(site.paymentMethods.join(", "))} and check current limits, timing, and wallet details inside the app.</li>
        <li><strong>Bonus terms:</strong> read promotion dates, eligibility, turnover terms, and withdrawal rules before expecting rewards.</li>
        <li><strong>Safety:</strong> avoid random APK mirrors, keep app updates current, and never share account credentials with third parties.</li>
      </ul>
    </section>`;
}

function articleExpansion(site: SiteConfig, article: Article) {
  return `<section class="band">
      <h2>What This Guide Covers</h2>
      <p>${escapeHtml(article.title)} is written for Pakistan users comparing ${escapeHtml(site.siteName)} information before registration, download, deposit, or update decisions. The goal is to keep the page practical: first explain the user intent, then show the checks that matter before clicking any app or payment button.</p>
      <div class="grid">
        <div class="card"><h3>Before You Start</h3><p>Check the app name, domain, APK version, and file size. If the information does not match the expected ${escapeHtml(site.siteName)} details, pause and verify again.</p></div>
        <div class="card"><h3>During Setup</h3><p>Use accurate account details, protect your password, and review any verification prompt. This is especially important when using local payment methods.</p></div>
        <div class="card"><h3>After Login</h3><p>Review bonus terms, payment limits, support options, and update notices before using wallet features or promotions.</p></div>
      </div>
    </section>
    ${localIntentSection(site)}
    <section class="band faq">
      <h2>${escapeHtml(article.title)} FAQ</h2>
      <details open><summary>Is this guide for Pakistan users?</summary><p>Yes. It references Pakistan payment methods, Android APK details, account setup, and common local search questions.</p></details>
      <details><summary>Should users check the latest version?</summary><p>Yes. Version, size, offer text, and payment notes can change, so users should compare the current page details with in-app information.</p></details>
      <details><summary>Where should beginners continue?</summary><p>Beginners should return to the home page, read the related guides, and use the register button only after understanding setup and payment notes.</p></details>
    </section>`;
}

function renderDownloadLanding(site: SiteConfig, articles: Article[]) {
  return layout(
    site,
    "/",
    `<section class="band">
      <h2>Table of Contents</h2>
      <div class="toc">
        <a href="#overview">Overview</a>
        <a href="#install">Install</a>
        <a href="#register">Register</a>
        <a href="#payments">Payments</a>
        <a href="#features">Features</a>
        <a href="#faq">FAQ</a>
      </div>
    </section>
    <section id="overview" class="band">
      <h2>${escapeHtml(site.siteName)} Overview</h2>
      <p>${escapeHtml(site.description)}</p>
      <div class="grid">
        ${featureCards(site)}
      </div>
    </section>
    <section id="install" class="band">
      <h2>How to Download and Install ${escapeHtml(site.siteName)}</h2>
      <div class="steps">
        <div class="step"><h3>Check the APK details</h3><p>Review version ${escapeHtml(site.appVersion)} and file size ${escapeHtml(site.appSize)} before downloading.</p></div>
        <div class="step"><h3>Open the official download page</h3><p>Use the download button and confirm the page matches the expected brand and domain.</p></div>
        <div class="step"><h3>Install on Android</h3><p>Allow trusted APK installation only when you understand the source and then complete the setup.</p></div>
      </div>
    </section>
    <section id="register" class="band">
      <h2>Registration and Bonus</h2>
      <p>${escapeHtml(site.offerText)}</p>
      <p>New users should prepare a mobile number, create a secure password, and verify account details before using payment features.</p>
    </section>
    <section id="payments" class="band">
      <h2>Pakistan Payment Methods</h2>
      <div class="grid">
        ${site.paymentMethods.map((method) => `<div class="card"><h3>${escapeHtml(method)}</h3><p>Check current deposit and withdrawal rules inside the app before making a transaction.</p></div>`).join("")}
      </div>
    </section>
    <section id="features" class="band">
      <h2>Guides and Articles</h2>
      <div class="grid">
        ${articleCards(articles)}
      </div>
    </section>
    ${localIntentSection(site)}
    <section id="faq" class="band faq">
      <h2>${escapeHtml(site.siteName)} FAQ</h2>
      <details open><summary>Is ${escapeHtml(site.siteName)} available for Android?</summary><p>The template presents ${escapeHtml(site.siteName)} as an Android APK guide with version and install information.</p></details>
      <details><summary>Which payment methods are covered?</summary><p>This site covers ${escapeHtml(site.paymentMethods.join(", "))} for Pakistan-focused search intent.</p></details>
      <details><summary>How often should this page be updated?</summary><p>Update version, size, bonus text, payment notes, and FAQ whenever the reference app or offer changes.</p></details>
    </section>`
  );
}

function renderReviewMagazine(site: SiteConfig, articles: Article[]) {
  return layout(
    site,
    "/",
    `<section class="band split">
      <div>
        <span class="pill">${escapeHtml(site.contentFramework)}</span>
        <h2>Editorial Review</h2>
        <p>${escapeHtml(site.description)}</p>
        <div class="grid">
          <div class="card"><div class="score">8.6</div><p>Review score based on content completeness, mobile clarity, APK information, and Pakistan search intent coverage.</p></div>
          <div class="card"><h3>Best For</h3><p>Users comparing ${escapeHtml(site.siteName)} features, Android APK details, payment methods, and account flow.</p></div>
        </div>
      </div>
      <aside class="card"><h3>Quick Facts</h3><p>Version: ${escapeHtml(site.appVersion)}</p><p>Size: ${escapeHtml(site.appSize)}</p><p>Offer: ${escapeHtml(site.offerText)}</p></aside>
    </section>
    <section class="band"><h2>Pros and Cons Framework</h2><div class="grid">${featureCards(site)}</div></section>
    ${localIntentSection(site)}
    <section class="band"><h2>Review Articles</h2><div class="grid">${articleCards(articles, "Read review")}</div></section>`
  );
}

function renderBonusGuide(site: SiteConfig, articles: Article[]) {
  return layout(
    site,
    "/",
    `<section class="band">
      <span class="pill">${escapeHtml(site.contentFramework)}</span>
      <h2>Bonus Snapshot</h2>
      <p>${escapeHtml(site.offerText)}</p>
      <div class="grid">
        <div class="card"><h3>Welcome Reward</h3><p>Explain the current welcome reward, account requirements, and key terms in plain language.</p></div>
        <div class="card"><h3>First Deposit</h3><p>Cover first deposit checks, local methods, and why users should verify in-app details.</p></div>
        <div class="card"><h3>Eligibility</h3><p>Help users review region, account, and promotion requirements before expecting rewards.</p></div>
      </div>
    </section>
    <section class="band"><h2>Payment Methods</h2><div class="grid">${site.paymentMethods.map((method) => `<div class="card"><h3>${escapeHtml(method)}</h3><p>Bonus users should confirm method availability and promotion terms before depositing.</p></div>`).join("")}</div></section>
    ${localIntentSection(site)}
    <section class="band"><h2>Bonus Guides</h2><div class="grid">${articleCards(articles, "Read bonus guide")}</div></section>`
  );
}

function renderHowToTutorial(site: SiteConfig, articles: Article[]) {
  return layout(
    site,
    "/",
    `<section class="band">
      <span class="pill">${escapeHtml(site.contentFramework)}</span>
      <h2>Step-by-Step Tutorial</h2>
      <div class="steps">
        <div class="step"><h3>Download</h3><p>Check version ${escapeHtml(site.appVersion)}, size ${escapeHtml(site.appSize)}, and open the trusted download page.</p></div>
        <div class="step"><h3>Register</h3><p>Create an account with accurate details and keep login information secure.</p></div>
        <div class="step"><h3>Deposit and Withdraw</h3><p>Review ${escapeHtml(site.paymentMethods.join(", "))} and confirm current rules in the app.</p></div>
        <div class="step"><h3>Start Playing</h3><p>Read game rules, start small, and review promotion terms before using rewards.</p></div>
      </div>
    </section>
    ${localIntentSection(site)}
    <section class="band"><h2>Tutorial Library</h2><div class="grid">${articleCards(articles, "Open tutorial")}</div></section>`
  );
}

function renderUpdatesHub(site: SiteConfig, articles: Article[]) {
  return layout(
    site,
    "/",
    `<section class="band split">
      <div>
        <span class="pill">${escapeHtml(site.contentFramework)}</span>
        <h2>Latest Update Hub</h2>
        <p>${escapeHtml(site.description)}</p>
        <div class="timeline">
          <div><h3>Current APK Version</h3><p>${escapeHtml(site.appVersion)} / ${escapeHtml(site.appSize)}</p></div>
          <div><h3>Offer Watch</h3><p>${escapeHtml(site.offerText)}</p></div>
          <div><h3>Payment Watch</h3><p>${escapeHtml(site.paymentMethods.join(", "))}</p></div>
        </div>
      </div>
      <aside class="card"><h3>Refresh Checklist</h3><p>Update version, size, bonus text, feature notes, FAQ, sitemap, and robots after each campaign change.</p></aside>
    </section>
    ${localIntentSection(site)}
    <section class="band"><h2>Update Articles</h2><div class="grid">${articleCards(articles, "Read update")}</div></section>`
  );
}

export function renderAbout(site: SiteConfig) {
  return layout(
    site,
    "/about/",
    `<section class="band"><h1>About ${escapeHtml(site.siteName)}</h1><p>${escapeHtml(site.description)}</p><p>${escapeHtml(site.siteName)} is built as a focused Pakistan APK information site with download guidance, bonus notes, payment information, and supporting articles.</p></section>`,
    `About ${site.siteName}`,
    site.description
  );
}

export function renderContact(site: SiteConfig) {
  return layout(
    site,
    "/contact/",
    `<section class="band"><h1>Contact</h1><p>Email us at <a href="mailto:${escapeHtml(site.contactEmail)}">${escapeHtml(site.contactEmail)}</a>.</p><p>Use this page for correction requests, update notices, and partnership inquiries.</p></section>`,
    `Contact ${site.siteName}`,
    `Contact ${site.siteName} for updates and content corrections.`
  );
}

export function renderBlogList(site: SiteConfig, articles: Article[]) {
  return layout(
    site,
    "/blog/",
    `<section class="band"><h1>${escapeHtml(site.siteName)} Guides</h1><p>Supporting articles for APK download, registration, payment methods, features, and FAQ content.</p></section>${primaryKeywordSection(site)}<section class="grid">${articles.map((article) => `<article class="card"><h2>${escapeHtml(article.title)}</h2><p>${escapeHtml(article.description)}</p><a href="/blog/${escapeHtml(article.slug)}/">Read guide</a></article>`).join("")}</section>`,
    `${site.siteName} Guides and APK Tutorials`,
    `Read ${site.siteName} APK download, registration, payment, feature, and FAQ guides.`
  );
}

export function renderBlogPost(site: SiteConfig, article: Article) {
  return layout(
    site,
    `/blog/${article.slug}/`,
    `<article class="band"><p><strong>Updated ${escapeHtml(lastModified)}</strong></p><h1>${escapeHtml(article.title)}</h1><p>${escapeHtml(article.description)}</p><p>${escapeHtml(article.content)}</p><p><a class="button" href="/">Back to ${escapeHtml(site.siteName)}</a></p></article>${primaryKeywordSection(site)}${articleExpansion(site, article)}`,
    `${article.title} - ${site.siteName}`,
    article.description,
    [
      faqSchema([
        {
          question: `Is ${article.title} for Pakistan users?`,
          answer: `Yes. The guide is written around Pakistan APK, account, payment, and update search intent for ${site.siteName}.`
        },
        {
          question: `Should users check current ${site.siteName} details?`,
          answer: "Yes. Version, file size, promotion, and payment details can change, so users should compare the page with current in-app information."
        }
      ])
    ]
  );
}

export function renderKeywordPage(site: SiteConfig, keyword: string, articles: Article[]) {
  const slug = keywordSlug(keyword);
  const relatedArticles = articles.slice(0, 4);

  return layout(
    site,
    `/keywords/${slug}/`,
    `<section class="band">
      <span class="pill">Keyword Landing Page</span>
      <h1>${escapeHtml(keyword)} Pakistan Guide</h1>
      <p>${escapeHtml(site.description)}</p>
      <p>This page targets users searching for <strong>${escapeHtml(keyword)}</strong> and connects them to the most relevant ${escapeHtml(site.siteName)} APK, registration, payment, and update guides.</p>
      <div class="cta-row">
        <a class="button" href="${escapeHtml(site.authUrl || site.downloadUrl)}" rel="nofollow">Register</a>
        <a class="button secondary" href="/blog/">Read Guides</a>
      </div>
    </section>
    <section class="band">
      <h2>Search Intent for ${escapeHtml(keyword)}</h2>
      <div class="grid">
        <div class="card"><h3>Download Intent</h3><p>Users want APK version, Android size, install notes, and safe source checks before opening the app.</p></div>
        <div class="card"><h3>Account Intent</h3><p>Users need login, registration, verification, password, and account setup information in a clear order.</p></div>
        <div class="card"><h3>Payment Intent</h3><p>Pakistan users compare EasyPaisa, JazzCash, bank transfer, withdrawal timing, and promotion rules.</p></div>
      </div>
    </section>
    <section class="band">
      <h2>How to Use This ${escapeHtml(keyword)} Page</h2>
      <p>Most Pakistan users searching for ${escapeHtml(keyword)} want a direct answer first, then proof that the page is current. This page highlights the app version, Android setup path, registration flow, local payment context, and bonus checks so users do not have to jump between unrelated pages.</p>
      <div class="steps">
        <div class="step"><h3>Check app details</h3><p>Compare ${escapeHtml(site.siteName)} version ${escapeHtml(site.appVersion)}, file size ${escapeHtml(site.appSize)}, Android support, and the official-looking download path.</p></div>
        <div class="step"><h3>Review account setup</h3><p>Use a secure password, keep login details private, and confirm that any mobile verification screen matches your expected account flow.</p></div>
        <div class="step"><h3>Read payment notes</h3><p>For Pakistan users, payment intent usually includes ${escapeHtml(site.paymentMethods.join(", "))}. Always check current limits and timing before deposit or withdrawal.</p></div>
        <div class="step"><h3>Verify bonus terms</h3><p>Promotion text can change quickly. Confirm welcome rewards, first deposit rules, referral bonuses, and withdrawal requirements before relying on an offer.</p></div>
      </div>
    </section>
    ${localIntentSection(site)}
    <section class="band">
      <h2>Recommended ${escapeHtml(site.siteName)} Articles</h2>
      <div class="grid">
        ${articleCards(relatedArticles)}
      </div>
    </section>
    <section class="band faq">
      <h2>${escapeHtml(keyword)} FAQ</h2>
      <details open><summary>What is the best page for ${escapeHtml(keyword)}?</summary><p>This keyword page gives a focused summary and links to deeper ${escapeHtml(site.siteName)} guides.</p></details>
      <details><summary>Is this page updated for Pakistan users?</summary><p>Yes. The content references Pakistan payment methods, Android APK information, and local account setup questions.</p></details>
      <details><summary>Where should new users start?</summary><p>Start with the register button, then review the supporting guides before using payment features.</p></details>
    </section>`,
    `${keyword} Pakistan Guide - ${site.siteName}`,
    `${site.siteName} keyword guide for ${keyword}, APK download, registration, payment methods, and Pakistan user questions.`,
    [
      faqSchema([
        {
          question: `What is the best page for ${keyword}?`,
          answer: `This page summarizes ${site.siteName} APK, registration, payment, update, and Pakistan user intent for ${keyword}.`
        },
        {
          question: `Is ${keyword} updated for Pakistan users?`,
          answer: `Yes. It references Pakistan payment methods, Android APK details, local account setup, and ${site.siteName} update information.`
        },
        {
          question: `Where should new ${site.siteName} users start?`,
          answer: "New users should review setup and payment notes first, then use the register button only after understanding account and bonus terms."
        }
      ])
    ]
  );
}

export function renderSitemap(site: SiteConfig, articles: Article[]) {
  const baseUrl = `https://${site.domain}`;
  const urls = [
    "/",
    "/about/",
    "/contact/",
    "/blog/",
    ...articles.map((article) => `/blog/${article.slug}/`),
    ...site.keywords.map((keyword) => `/keywords/${keywordSlug(keyword)}/`)
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${baseUrl}${url}</loc><lastmod>${lastModified}</lastmod></url>`).join("\n")}
</urlset>`;
}

export function renderRobots(site: SiteConfig) {
  return `User-agent: *
Allow: /
Sitemap: https://${site.domain}/sitemap.xml
`;
}
