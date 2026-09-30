import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import DOMPurify from "dompurify"; // npm i dompurify

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import "../styles/media.css";
import "../styles/blogpost.css";

const API = process.env.REACT_APP_API_URL;

// Fallback if the API doesn't send `eyebrow` yet.
const EYEBROWS = {
  generic: "Company Update",
  project_updates: "Project Update",
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Blank line = new paragraph, single newline = <br/> (same rule as the email).
function splitParagraphs(text = "") {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function withLineBreaks(text = "") {
  return text.split("\n").map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}

// Fallback if the API doesn't send `readMinutes` yet.
function estimateReadMinutes(html = "") {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// Only http(s)/mailto links are allowed. A bare "example.com" gets https://.
function safeExternal(url) {
  if (!url || typeof url !== "string") return null;
  const v = url.trim();
  if (!v) return null;
  const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withProtocol);
    return ["http:", "https:", "mailto:"].includes(u.protocol) ? u.href : null;
  } catch {
    return null;
  }
}

// Resolves the CTA into { href, external }, or null when it shouldn't render:
// invalid/unsafe URL, or a link that points at this very article.
function resolveCta(link, slug) {
  if (!link || typeof link !== "string") return null;
  const v = link.trim();

  if (v.startsWith("/") && !v.startsWith("//")) {
    if (v.replace(/\/$/, "") === `/blogs/${slug}`) return null;
    return { href: v, external: false };
  }

  try {
    const u = new URL(v);
    if (!["http:", "https:"].includes(u.protocol)) return null;
    if (u.pathname.replace(/\/$/, "") === `/blogs/${slug}`) return null;
    if (u.origin === window.location.origin) {
      return { href: u.pathname + u.search + u.hash, external: false };
    }
    return { href: u.href, external: true };
  } catch {
    return null;
  }
}

function Lede({ introText, introImage }) {
  const paragraphs = splitParagraphs(introText);
  if (paragraphs.length === 0 && !introImage) return null;

  const single = paragraphs.length === 0 || !introImage;

  return (
    <section className={`blog-post-lede${single ? " is-single" : ""}`}>
      {paragraphs.length > 0 && (
        <div className="blog-post-lede-text">
          {paragraphs.map((p, i) => (
            <p key={i}>{withLineBreaks(p)}</p>
          ))}
        </div>
      )}
      {introImage && <img className="blog-post-lede-image" src={introImage} alt="" />}
    </section>
  );
}

function HighlightsBox({ title, highlights }) {
  const list = Array.isArray(highlights) ? highlights.filter((h) => h && h.trim()) : [];
  if (list.length === 0) return null;

  return (
    <aside className="blog-post-highlights">
      {title && <p className="blog-post-highlights-title">{title}</p>}
      <ul>
        {list.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}

function Cta({ ctaText, ctaLink, slug }) {
  const target = ctaText ? resolveCta(ctaLink, slug) : null;
  if (!target) return null;

  return (
    <div className="blog-post-cta">
      {target.external ? (
        <a
          className="outline-button small"
          href={target.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {ctaText} <span aria-hidden="true">↗</span>
        </a>
      ) : (
        <Link className="outline-button small" to={target.href}>
          {ctaText}
        </Link>
      )}
    </div>
  );
}

function AuthorNote({ authorNote }) {
  if (!authorNote || !authorNote.trim()) return null;
  return (
    <section className="blog-post-author-note">
      <p className="blog-post-author-note-label">Author's note</p>
      <p className="blog-post-author-note-text">{withLineBreaks(authorNote)}</p>
    </section>
  );
}

function Contributors({ contributors }) {
  const list = Array.isArray(contributors) ? contributors.filter((c) => c && c.name) : [];
  if (list.length === 0) return null;

  return (
    <section className="blog-post-contributors-section">
      <p className="blog-post-section-label">Contributors</p>
      <div className="blog-post-contributors">
        {list.map((c, i) => (
          <div className="blog-post-contributor" key={i}>
            {c.photo && <img src={c.photo} alt="" />}
            <p>{c.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SocialLinks({ socialLinks }) {
  const entries = [
    ["Website", socialLinks?.website],
    ["Contact", socialLinks?.contact],
    ["LinkedIn", socialLinks?.linkedin],
    ["YouTube", socialLinks?.youtube],
  ]
    .map(([label, url]) => [label, safeExternal(url)])
    .filter(([, href]) => href);

  if (entries.length === 0) return null;

  return (
    <nav className="blog-post-social-links" aria-label="Onnes Aerospace links">
      {entries.map(([label, href]) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      ))}
    </nav>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | not-found | expired | error

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setPost(null);

    axios
      .get(`${API}/api/blog/${slug}`)
      .then((res) => {
        if (cancelled) return;
        setPost(res.data);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.response?.status === 404) setStatus("not-found");
        else if (err.response?.status === 410) setStatus("expired");
        else setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Sanitized once per post. Base64 <img> tags are kept; scripts, inline
  // handlers and javascript: URLs are stripped.
  const cleanBody = useMemo(() => {
    const html = post?.bodyHtml || "";
    if (!html.trim() || html.trim() === "<p></p>") return "";
    return DOMPurify.sanitize(html);
  }, [post]);

  const eyebrow = post ? post.eyebrow || EYEBROWS[post.type] || "Company Update" : "";
  const readMinutes = post ? post.readMinutes || estimateReadMinutes(post.bodyHtml) : 0;

  const metaDescription = post
    ? (post.introText || "").replace(/\s+/g, " ").trim().slice(0, 160)
    : "";

  return (
    <>
      <Helmet>
        <title>{post ? `${post.title} | Onnes Aerospace` : "Blog | Onnes Aerospace"}</title>
        {metaDescription && post?.type !== "project_updates" && (
          <meta name="description" content={metaDescription} />
        )}
        {post?.type === "project_updates" && <meta name="robots" content="noindex, nofollow" />}
      </Helmet>

      <main className="site-shell media-page blog-post-page">
        <Header />

        {status === "loading" && (
          <div className="blog-post-status">
            <p>Loading article…</p>
          </div>
        )}

        {status === "not-found" && (
          <div className="blog-post-status">
            <p className="media-eyebrow">Not found</p>
            <h1>This article isn't available.</h1>
            <p>It may have been removed, or the link may be incorrect.</p>
            <Link className="media-link" to="/blogs">Back to Blog</Link>
          </div>
        )}

        {status === "expired" && (
          <div className="blog-post-status">
            <p className="media-eyebrow">Link expired</p>
            <h1>This link is no longer active.</h1>
            <p>
              This update was only available for a limited time. Please reach out to us if you need
              it again.
            </p>
            <Link className="media-link" to="/blogs">Back to Blog</Link>
          </div>
        )}

        {status === "error" && (
          <div className="blog-post-status">
            <p>Something went wrong loading this article. Please try again shortly.</p>
          </div>
        )}

        {status === "ready" && post && (
          <article className="blog-post-article">
            <section className="blog-post-hero">
              <div className="blog-post-container">
                <Link className="media-link blog-post-back" to="/blogs">← Back to Blog</Link>
                <p className="media-eyebrow">{eyebrow}</p>
                <h1>{post.title}</h1>
                {post.tagline && <p className="blog-post-tagline">{post.tagline}</p>}
                <p className="blog-post-meta">
                  <span>{formatDate(post.date)}</span>
                  {cleanBody && <span>{readMinutes} min read</span>}
                </p>
              </div>
            </section>

            <div className="blog-post-container blog-post-content">
              <Lede introText={post.introText} introImage={post.introImage} />
              <HighlightsBox title={post.highlightsTitle} highlights={post.highlights} />

              {post.subheading && <h2 className="blog-post-subheading">{post.subheading}</h2>}

              {cleanBody && (
                <div
                  className="blog-article-body"
                  dangerouslySetInnerHTML={{ __html: cleanBody }}
                />
              )}

              <Cta ctaText={post.ctaText} ctaLink={post.ctaLink} slug={post.slug || slug} />
              <AuthorNote authorNote={post.authorNote} />
              <Contributors contributors={post.contributors} />
              <SocialLinks socialLinks={post.socialLinks} />
            </div>
          </article>
        )}

        <Footer />
      </main>
    </>
  );
}