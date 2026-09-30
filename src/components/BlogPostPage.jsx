import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import "../styles/media.css";
import "../styles/blogpost.css";

const API = process.env.REACT_APP_API_URL;

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Splits plain textarea text into paragraphs the same way the email
// template does — blank line = new paragraph, single newline = <br/>.
function IntroSection({ introText, introImage }) {
  const paragraphs = (introText || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0 && !introImage) return null;

  return (
    <section className={`blog-post-intro${introImage ? " has-image" : ""}`}>
      {paragraphs.length > 0 && (
        <div className="blog-post-intro-text">
          {paragraphs.map((p, i) => (
            <p key={i}>
              {p.split("\n").map((line, j, arr) => (
                <span key={j}>
                  {line}
                  {j < arr.length - 1 && <br />}
                </span>
              ))}
            </p>
          ))}
        </div>
      )}
      {introImage && (
        <div className="blog-post-intro-image-wrap">
          <img className="blog-post-intro-image" src={introImage} alt="" />
        </div>
      )}
    </section>
  );
}

function HighlightsBox({ title, highlights }) {
  const list = Array.isArray(highlights) ? highlights.filter((h) => h && h.trim()) : [];
  if (list.length === 0) return null;

  return (
    <div className="blog-post-highlights">
      {title && <p className="blog-post-highlights-title">{title}</p>}
      <ul>
        {list.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function CtaButton({ ctaText, ctaLink }) {
  if (!ctaText || !ctaLink) return null;
  const isExternal = /^https?:\/\//i.test(ctaLink);
  return (
    <div className="blog-post-cta">
      {isExternal ? (
        <a href={ctaLink} target="_blank" rel="noopener noreferrer">
          {ctaText} <span aria-hidden="true">→</span>
        </a>
      ) : (
        <Link to={ctaLink}>
          {ctaText} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}

function AuthorNote({ authorNote }) {
  if (!authorNote || !authorNote.trim()) return null;
  return (
    <div className="blog-post-author-note">
      <p className="blog-post-author-note-label">Author's Note</p>
      <p className="blog-post-author-note-text">
        {authorNote.split("\n").map((line, i, arr) => (
          <span key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </span>
        ))}
      </p>
    </div>
  );
}

function Contributors({ contributors }) {
  const list = Array.isArray(contributors) ? contributors.filter((c) => c && c.name) : [];
  if (list.length === 0) return null;

  return (
    <div className="blog-post-contributors">
      {list.map((c, i) => (
        <div className="blog-post-contributor" key={i}>
          {c.photo && <img src={c.photo} alt={c.name} />}
          <p>{c.name}</p>
        </div>
      ))}
    </div>
  );
}

function SocialLinks({ socialLinks }) {
  const entries = [
    ["Website", socialLinks?.website],
    ["Contact", socialLinks?.contact],
    ["LinkedIn", socialLinks?.linkedin],
    ["YouTube", socialLinks?.youtube],
  ].filter(([, url]) => url && url.trim());

  if (entries.length === 0) return null;

  return (
    <div className="blog-post-social-links">
      {entries.map(([label, url], i) => (
        <span key={label}>
          {i > 0 && <span className="blog-post-social-dot">•</span>}
          <a href={url} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        </span>
      ))}
    </div>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | not-found | error

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
        else setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <>
      <Helmet>
        <title>{post ? `${post.title} | Onnes Aerospace` : "Blog | Onnes Aerospace"}</title>
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
            <p className="media-eyebrow">Not Found</p>
            <h1>This article isn't available.</h1>
            <p>It may have been removed, or the link may be incorrect.</p>
            <Link className="media-link" to="/blogs">Back to Blog</Link>
          </div>
        )}

        {status === "error" && (
          <div className="blog-post-status">
            <p>Something went wrong loading this article. Please try again shortly.</p>
          </div>
        )}

        {status === "ready" && post && (
          <>
            {post.tagline && (
              <div className="blog-post-tagline-bar">
                <p>{post.tagline}</p>
              </div>
            )}

            <section className="blog-post-hero">
              <div className="blog-post-hero-inner">
                <Link className="media-link blog-post-back" to="/blogs">← Back to Blog</Link>
                <p className="media-eyebrow">
                  {post.type === "project_updates" ? "Project Update" : "Company Update"}
                </p>
                <h1>{post.title}</h1>
                <p className="media-date">{formatDate(post.date)}</p>
              </div>
            </section>

            <article className="blog-post-body-wrap">
              <IntroSection introText={post.introText} introImage={post.introImage} />

              {post.subheading && <h2 className="blog-post-subheading">{post.subheading}</h2>}

              {post.bodyHtml && post.bodyHtml.trim() && post.bodyHtml.trim() !== "<p></p>" && (
                <div
                  className="blog-article-body"
                  dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
                />
              )}

              <HighlightsBox title={post.highlightsTitle} highlights={post.highlights} />
              <CtaButton ctaText={post.ctaText} ctaLink={post.ctaLink} />
              <AuthorNote authorNote={post.authorNote} />
              <Contributors contributors={post.contributors} />
            </article>

            <div className="blog-post-footer-meta">
              <p className="blog-post-footer-brand">Onnes Aerospace</p>
              <SocialLinks socialLinks={post.socialLinks} />
            </div>
          </>
        )}

        <Footer />
      </main>
    </>
  );
}