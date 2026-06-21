# PKPlus17 SEO Build Notes

## Goal

Build a repeatable static SEO site template around the `pkplus17` keyword cluster for the Pakistan market, aiming for useful pages that can compete for Google top positions over time.

## Reference Site Signals

Reference: `https://pkplus17.com/`

Observed signals:

- Mobile-first app-style page.
- Title: `Pkplus.com`.
- Description focuses on registration reward, first deposit bonus, and payout.
- Uses favicon and social preview image.
- Frontend is a Vue/hash app, so static SEO support from generated pages can be improved with crawlable HTML.

## Competitor Structure

Competitor examples surfaced in search:

- `3pattiroom.org/u7777-game/`
- `betrupees.pk/92-pkr-game/`
- APK listing pages such as APKCombo.

Common ranking page sections:

- Keyword-focused H1 with game/app name and download intent.
- APK information card: version, size, OS, developer, category.
- Strong download CTA above the fold.
- Table of contents.
- What is the app/game?
- How to download and install.
- How to register.
- Deposit and withdrawal guide.
- Feature blocks.
- Bonus and promotion explanation.
- FAQ section.
- Similar posts or internal article links.
- Contact, About, sitemap, robots.

## Template Direction

The generated template should behave like a boutique APK SEO landing page:

- Dark mobile-first hero.
- App/APK info card.
- Green download CTA.
- Bonus/promotion line near the top.
- Pakistan payment method blocks.
- Internal article cluster.
- FAQ block.
- JSON-LD `MobileApplication` schema.
- Canonical, Open Graph, Twitter card, keywords, sitemap, and robots.

## All-Site Consistency Rules

- All site-specific content must come from `sites/sites.json`.
- CSV imports must preserve SEO, APK, payment, feature, and article fields.
- Every site should bind at least 5 supporting articles.
- Every generated site should include the same core page set:
  - Home
  - About
  - Contact
  - Blog list
  - Blog detail
  - `sitemap.xml`
  - `robots.txt`

## Continuous Update Mechanism

Weekly or campaign update flow:

1. Check reference site title, description, bonus text, APK version, app size, and offer language.
2. Update `data/sites.csv`.
3. Run `npm run import:sites`.
4. Update or add supporting articles in `content/articles.json`.
5. Run `npm run generate`.
6. Run `npm run build`.
7. Deploy generated output or push to trigger GitHub Actions.

High-impact fields to refresh:

- `title`
- `description`
- `keywords`
- `appVersion`
- `appSize`
- `offerText`
- `paymentMethods`
- `featureBullets`
- article titles and FAQ content

## Content Safety

- Do not copy competitor article text verbatim.
- Do not make unsupported claims about payments, safety, or bonuses.
- Use informational wording and update claims when the reference site changes.
