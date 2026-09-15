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
            <section className="blog-post-hero">
              <div className="blog-post-hero-inner">
                <Link className="media-link blog-post-back" to="/blogs">← Back to Blog</Link>
                <p className="media-eyebrow">Company Update</p>
                <h1>{post.title}</h1>
                <p className="media-date">{formatDate(post.date)}</p>
              </div>
            </section>

            {post.heroImage && (
              <div className="blog-post-image-wrap">
                <img className="blog-post-image" src={post.heroImage} alt="" />
              </div>
            )}

            <article
              className="blog-article-body"
              dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
            />
          </>
        )}

        <Footer />
      </main>
    </>
  );
}