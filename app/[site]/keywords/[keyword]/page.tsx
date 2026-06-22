import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSite, getSiteArticles, siteConfigs } from "@/lib/site-data";

function keywordSlug(keyword: string) {
  return keyword
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findKeyword(siteSlug: string, keywordSlugParam: string) {
  const site = getSite(siteSlug);
  if (!site) return null;

  const keyword = site.keywords.find((item) => keywordSlug(item) === keywordSlugParam);
  return keyword ? { site, keyword } : null;
}

export function generateStaticParams() {
  return siteConfigs.flatMap((site) =>
    site.keywords.map((keyword) => ({
      site: site.slug,
      keyword: keywordSlug(keyword)
    }))
  );
}

export function generateMetadata({ params }: { params: { site: string; keyword: string } }): Metadata {
  const result = findKeyword(params.site, params.keyword);
  if (!result) return {};

  return {
    title: `${result.keyword} Pakistan Guide - ${result.site.siteName}`,
    description: `${result.site.siteName} keyword guide for ${result.keyword}, APK download, registration, payment methods, and Pakistan user questions.`,
    keywords: [result.keyword, ...result.site.keywords],
    alternates: {
      canonical: `https://${result.site.domain}/keywords/${params.keyword}/`
    }
  };
}

export default function KeywordPage({ params }: { params: { site: string; keyword: string } }) {
  const result = findKeyword(params.site, params.keyword);
  if (!result) notFound();

  const { site, keyword } = result;
  const articles = getSiteArticles(site).slice(0, 4);
  const authUrl = site.authUrl || site.downloadUrl;

  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-5 py-10">
      <section className="rounded-lg border border-line bg-white p-6">
        <p className="mb-3 text-sm font-black uppercase text-slate-500">Keyword Landing Page</p>
        <h1 className="text-5xl font-black">{keyword} Pakistan Guide</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{site.description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={authUrl} className="rounded-lg bg-emerald-400 px-5 py-3 font-black text-slate-950" rel="nofollow">
            Register
          </a>
          <Link href={`/${site.slug}/blog`} className="rounded-lg border border-line px-5 py-3 font-bold text-ink">
            Read Guides
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {["Download Intent", "Account Intent", "Payment Intent"].map((intent) => (
          <div key={intent} className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-xl font-black">{intent}</h2>
            <p className="mt-2 text-slate-600">
              {site.siteName} content supports {keyword} searches with APK, registration, payment, and FAQ context.
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-line bg-white p-6">
        <h2 className="text-3xl font-black">Recommended Articles</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {articles.map((article) => (
            <Link key={article.slug} href={`/${site.slug}/blog/${article.slug}`} className="rounded-lg border border-line p-5">
              <h3 className="text-xl font-bold">{article.title}</h3>
              <p className="mt-2 text-slate-600">{article.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
