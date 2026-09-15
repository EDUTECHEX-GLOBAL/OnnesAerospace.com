import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { ArrowUpRight } from "lucide-react";

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import "../styles/media.css";

// Used only as a fallback hero image for the page itself and for any post
// that doesn't have an inline image of its own — not per-post content.
import heroBg from "../assets/MediaPageMain.webp";

const API = process.env.REACT_APP_API_URL;

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PostLink({ slug }) {
  return (
    <Link className="media-link" to={`/blogs/${slug}`}>
      Read More <ArrowUpRight />
    </Link>
  );
}

export default function BlogsPage() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API}/api/blog`)
      .then((res) => {
        if (cancelled) return;
        setPosts(res.data.posts || []);
        setStatus("ready");
      })
      .catch((err) => {
        console.error("Failed to fetch blog posts:", err.message);
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const [featured, ...rest] = posts;

  return (
    <>
      <Helmet>
        <title>Blogs | Onnes Aerospace</title>
        <meta
          name="description"
          content="Perspectives, engineering deep-dives, and updates from Onnes Aerospace on building the infrastructure layer for humanity's future beyond Earth."
        />
      </Helmet>
      <main className="site-shell media-page">
        <Header />

        <section className="media-hero" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="media-hero-copy">
            <p className="media-eyebrow">Blog</p>
            <h1>Perspectives From The Team Building Beyond Earth</h1>
            <p>
              Engineering deep-dives, mission thinking, and updates from Onnes Aerospace on what it takes to build
              lasting infrastructure across orbit, the Moon, and deep space.
            </p>
          </div>
        </section>

        <section className="media-tabs" id="articles">
          <nav aria-label="Blog sections">
            <a className="active" href="#articles">Articles</a>
          </nav>
        </section>

        {status === "loading" && (
          <p style={{ color: "#94a3b8", padding: "0 clamp(20px, 3vw, 36px) 80px" }}>Loading articles…</p>
        )}

        {status === "error" && (
          <p style={{ color: "#94a3b8", padding: "0 clamp(20px, 3vw, 36px) 80px" }}>
            Couldn't load articles right now — please check back shortly.
          </p>
        )}

        {status === "ready" && posts.length === 0 && (
          <p style={{ color: "#94a3b8", padding: "0 clamp(20px, 3vw, 36px) 80px" }}>
            No articles published yet — check back soon.
          </p>
        )}

        {status === "ready" && posts.length > 0 && (
          <section className="media-news-grid">
            <article className="media-feature-card">
              <div
                className="media-card-image"
                style={{ backgroundImage: `url(${featured.heroImage || heroBg})` }}
              >
                <span>Featured</span>
              </div>
              <div className="media-card-copy">
                <p className="media-date">{formatDate(featured.date)}</p>
                <h2>{featured.title}</h2>
                <p>{featured.excerpt}</p>
                <PostLink slug={featured.slug} />
              </div>
            </article>

            <div className="media-news-list">
              {rest.map((post) => (
                <article className="media-list-item" key={post.slug}>
                  <div>
                    <p className="media-date">{formatDate(post.date)}</p>
                    <h3>{post.title}</h3>
                    <PostLink slug={post.slug} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <Footer />
      </main>
    </>
  );
}