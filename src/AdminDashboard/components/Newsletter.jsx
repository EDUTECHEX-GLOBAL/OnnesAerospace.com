import React, { useEffect, useState, useCallback, useRef } from "react";
import api from "../../api";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  FaPaperPlane, FaUserPlus, FaTrash, FaHistory, FaUsers,
  FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash, FaExclamationTriangle,
  FaBold, FaItalic, FaStrikethrough, FaListUl, FaListOl, FaQuoteRight,
  FaLink, FaImage, FaUndo, FaRedo, FaTimes, FaRedoAlt, FaExternalLinkAlt,
  FaPlus,
} from "react-icons/fa";

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
});

const TABS = [
  { key: "compose", label: "Compose", icon: FaPaperPlane },
  { key: "recipients", label: "Recipients", icon: FaUsers },
  { key: "history", label: "History", icon: FaHistory },
];

const PREVIEW_RECIPIENT_EMAIL = "you@example.com";

function escapeHTML(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function textToParagraphs(text = "") {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;color:#333940;font-family:'Segoe UI',Arial,sans-serif;">${escapeHTML(
          p
        ).replace(/\n/g, "<br/>")}</p>`
    )
    .join("");
}

function buildIntroHtmlPreview(introText, introImageSrc) {
  const paragraphs = textToParagraphs(introText);
  if (!paragraphs && !introImageSrc) return "";

  if (paragraphs && introImageSrc) {
    return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 6px 0;">
      <tr>
        <td valign="middle" style="width:58%;padding:0 20px 16px 0;">${paragraphs}</td>
        <td valign="middle" align="center" style="width:42%;padding:0 0 16px 0;">
          <img src="${introImageSrc}" width="220" height="220" alt="" style="display:block;width:220px;height:220px;object-fit:cover;border-radius:6px;border:0;margin:0 auto;" />
        </td>
      </tr>
    </table>`;
  }

  if (introImageSrc) {
    return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px 0;">
      <tr><td><img src="${introImageSrc}" width="600" alt="" style="display:block;width:100%;max-width:600px;height:auto;border-radius:6px;border:0;" /></td></tr>
    </table>`;
  }

  return paragraphs;
}

function buildHighlightsHtmlPreview(title, items) {
  const list = Array.isArray(items) ? items.filter((i) => i && i.trim()) : [];
  if (list.length === 0) return "";
  const rows = list
    .map(
      (item) => `
      <tr>
        <td style="padding:0 8px 10px 0;vertical-align:top;width:14px;">
          <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background-color:#00B5F9;margin-top:8px;"></span>
        </td>
        <td style="padding:0 0 10px 0;font-size:14.5px;line-height:1.6;color:#333940;font-family:'Segoe UI',Arial,sans-serif;">${escapeHTML(
          item
        )}</td>
      </tr>`
    )
    .join("");
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px 0;background-color:#f7fafc;border-radius:8px;">
      <tr><td style="padding:18px 20px;">
        ${title ? `<p style="margin:0 0 12px 0;font-size:14.5px;font-weight:700;color:#0f1115;font-family:'Segoe UI',Arial,sans-serif;">${escapeHTML(title)}</p>` : ""}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>
      </td></tr>
    </table>`;
}

function buildCtaHtmlPreview(ctaText, ctaLink) {
  if (!ctaText || !ctaLink) return "";
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 8px 0;">
      <tr><td align="center">
        <a href="${escapeHTML(ctaLink)}" style="font-size:15px;font-weight:700;color:#00B5F9;text-decoration:underline;font-family:'Segoe UI',Arial,sans-serif;">${escapeHTML(ctaText)} &rarr;</a>
      </td></tr>
    </table>`;
}

function buildAuthorNoteHtmlPreview(authorNote) {
  if (!authorNote || !authorNote.trim()) return "";
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 22px 0;border-top:1px solid #eef0f3;">
      <tr><td style="padding-top:20px;">
        <p style="margin:0 0 8px 0;font-size:13px;font-weight:700;font-style:italic;color:#0f1115;font-family:'Segoe UI',Arial,sans-serif;">Author's Note</p>
        <p style="margin:0;font-size:14px;line-height:1.7;font-style:italic;color:#5b6472;font-family:'Segoe UI',Arial,sans-serif;">${escapeHTML(authorNote).replace(/\n/g, "<br/>")}</p>
      </td></tr>
    </table>`;
}

function buildContributorsHtmlPreview(contributors) {
  const list = Array.isArray(contributors) ? contributors.filter((c) => c && c.name) : [];
  if (list.length === 0) return "";
  const colWidth = Math.floor(100 / list.length);
  const cols = list
    .map(
      (c) => `
      <td align="center" valign="top" style="padding:0 10px 6px;width:${colWidth}%;">
        ${c.photo ? `<img src="${c.photo}" width="64" height="64" alt="${escapeHTML(c.name)}" style="display:block;margin:0 auto 8px;border-radius:50%;width:64px;height:64px;object-fit:cover;border:0;" />` : ""}
        <p style="margin:0;font-size:12.5px;font-weight:600;color:#0f1115;font-family:'Segoe UI',Arial,sans-serif;">${escapeHTML(c.name)}</p>
      </td>`
    )
    .join("");
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 4px 0;">
      <tr>${cols}</tr>
    </table>`;
}

function buildSocialLinksHtmlPreview(socialLinks = {}) {
  const entries = [
    ["Website", socialLinks.website],
    ["Contact", socialLinks.contact],
    ["LinkedIn", socialLinks.linkedin],
    ["YouTube", socialLinks.youtube],
  ].filter(([, url]) => url && url.trim());
  if (entries.length === 0) return "";
  const linksHtml = entries
    .map(([label, url]) => `<a href="${escapeHTML(url.trim())}" style="color:#00B5F9;text-decoration:none;font-weight:600;">${label}</a>`)
    .join(`<span style="color:#c2c9d3;padding:0 8px;">&bull;</span>`);
  return `<p style="margin:0 0 12px 0;font-size:12px;font-family:'Segoe UI',Arial,sans-serif;">${linksHtml}</p>`;
}

// Mirrors Backend/Admin/utils/newsletterTemplate.js — used only for the
// live preview in the compose tab.
function buildPreviewHTML({
  subject, type, headline, tagline, introText, introImage, subheading,
  bodyHtml, highlightsTitle, highlights, ctaText, ctaLink, authorNote,
  contributors, socialLinks,
}) {
  const eyebrow = type === "generic" ? "Company Update" : "Project Update";
  const isEmptyBody = !bodyHtml || bodyHtml.trim() === "" || bodyHtml.trim() === "<p></p>";
  const contentHtml = isEmptyBody
    ? (introText || "").trim()
      ? ""
      : `<p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:#c2c9d3;font-family:'Segoe UI',Arial,sans-serif;">Your message will appear here…</p>`
    : `<div class="nl-content">${bodyHtml}</div>`;

  const taglineHtml = tagline && tagline.trim()
    ? `<tr><td align="center" style="padding:14px 24px;background-color:#f7fafc;border-bottom:1px solid #eef0f3;"><p style="margin:0;font-size:12.5px;font-style:italic;font-weight:600;color:#00B5F9;font-family:'Segoe UI',Arial,sans-serif;">${escapeHTML(tagline)}</p></td></tr>`
    : "";

  return `<!DOCTYPE html><html><head><meta charset="utf-8" />
  <style>
    .nl-content h1, .nl-content h2, .nl-content h3 {
      margin: 24px 0 10px 0; color: #0f1115; font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.3;
    }
    .nl-content h1 { font-size: 21px; }
    .nl-content h2 { font-size: 18px; }
    .nl-content h3 { font-size: 16px; font-weight: 700; }
    .nl-content p { margin: 0 0 16px 0; font-size: 15px; line-height: 1.7; color: #333940; font-family: 'Segoe UI', Arial, sans-serif; }
    .nl-content ul, .nl-content ol { margin: 0 0 16px 0; padding-left: 22px; color: #333940; font-size: 15px; line-height: 1.7; font-family: 'Segoe UI', Arial, sans-serif; }
    .nl-content li { margin-bottom: 6px; }
    .nl-content a { color: #00B5F9; text-decoration: underline; }
    .nl-content strong { color: #0f1115; }
    .nl-content img { max-width: 100%; height: auto; border-radius: 4px; margin: 14px 0; display: block; }
    .nl-content blockquote { margin: 0 0 16px 0; padding-left: 14px; border-left: 3px solid #00B5F9; color: #5b6472; font-style: italic; }
    .nl-content p:last-child { margin-bottom: 0; }
  </style>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI', Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f5f7;">
      <tr><td align="center" style="padding:0;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background-color:#ffffff;">

          ${taglineHtml}

          <tr>
            <td align="center" style="padding:28px 24px 22px;">
              <div style="color:#0488f2;font-size:22px;font-weight:800;letter-spacing:0.5px;font-family:'Segoe UI',Arial,sans-serif;">⊙NNES</div>
              <div style="color:#0f1115;font-size:9px;letter-spacing:4px;font-weight:600;margin-top:4px;font-family:'Segoe UI',Arial,sans-serif;">AEROSPACE</div>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 24px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td>
                  <p style="margin:0 0 10px 0;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#00B5F9;font-family:'Segoe UI',Arial,sans-serif;">${eyebrow}</p>
                  <h1 style="margin:0 0 20px 0;font-size:25px;font-weight:800;color:#00B5F9;line-height:1.3;font-family:'Segoe UI',Arial,sans-serif;">${escapeHTML(headline) || '<span style="color:#c2c9d3;">Your headline will appear here</span>'}</h1>
                  ${buildIntroHtmlPreview(introText, introImage)}
                  ${subheading && subheading.trim() ? `<h2 style="margin:6px 0 14px 0;font-size:17px;font-weight:800;color:#0f1115;line-height:1.4;font-family:'Segoe UI',Arial,sans-serif;">${escapeHTML(subheading)}</h2>` : ""}
                  ${contentHtml}
                  ${buildHighlightsHtmlPreview(highlightsTitle, highlights)}
                  ${buildCtaHtmlPreview(ctaText, ctaLink)}
                  ${buildAuthorNoteHtmlPreview(authorNote)}
                  ${buildContributorsHtmlPreview(contributors)}
                </td></tr>
              </table>
            </td>
          </tr>

          <tr><td style="height:16px;line-height:16px;font-size:0;">&nbsp;</td></tr>

          <tr>
            <td align="center" style="padding:22px 24px 32px;border-top:1px solid #eef0f3;">
              <p style="margin:0 0 10px 0;font-size:12px;font-weight:700;color:#0f1115;font-family:'Segoe UI',Arial,sans-serif;">Onnes Aerospace</p>
              ${buildSocialLinksHtmlPreview(socialLinks)}
              <p style="margin:0 0 8px 0;font-size:11px;color:#8a94a3;font-family:'Segoe UI',Arial,sans-serif;">
                &copy; ${new Date().getFullYear()} Onnes Aerospace. All Rights Reserved.
              </p>
              <p style="margin:0;font-size:11px;color:#8a94a3;font-family:'Segoe UI',Arial,sans-serif;">
                <span style="text-decoration:underline;color:#00B5F9;font-weight:600;">Unsubscribe</span> your email address ( ${escapeHTML(PREVIEW_RECIPIENT_EMAIL)} ) from our newsletter.
              </p>
            </td>
          </tr>

        </table>
      </td></tr>
    </table>
  </body></html>`;
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Newsletter() {
  const [activeTab, setActiveTab] = useState("compose");
  const [counts, setCounts] = useState({ general: 0, client: 0, investor: 0 });

  const fetchCounts = useCallback(async () => {
    try {
      const res = await api.get("/api/admin-newsletter/recipients/counts", authHeaders());
      setCounts(res.data);
    } catch (err) {
      console.error("Failed to fetch recipient counts:", err);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  return (
    <div style={{ padding: "28px 28px 40px", backgroundColor: "#f0f4f8", minHeight: "100vh" }}>
      <style>{editorGlobalStyles}</style>

      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: "1.45rem", fontWeight: 700, color: "#1a365d", letterSpacing: "-0.3px" }}>
          Newsletter
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94a3b8" }}>
          Compose and send newsletters to your General, Client, and Investor mailing lists
        </p>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 24, borderBottom: "1px solid #e2e8f0" }}>
        {TABS.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 18px",
                border: "none",
                borderBottom: isActive ? "2px solid #00B5F9" : "2px solid transparent",
                background: "transparent",
                color: isActive ? "#00B5F9" : "#64748b",
                fontWeight: isActive ? 600 : 500,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              <Icon size={13} />
              {label}
            </button>
          );
        })}
      </div>

      {activeTab === "compose" && <ComposeTab counts={counts} onSent={fetchCounts} />}
      {activeTab === "recipients" && <RecipientsTab counts={counts} onChange={fetchCounts} />}
      {activeTab === "history" && <HistoryTab />}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// COMPOSE TAB
// ────────────────────────────────────────────────────────────
function ComposeTab({ counts, onSent }) {
  const [type, setType] = useState("generic");
  const [subject, setSubject] = useState("");
  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [introText, setIntroText] = useState("");
  const [introImage, setIntroImage] = useState(null);
  const [subheading, setSubheading] = useState("");
  const [highlightsTitle, setHighlightsTitle] = useState("In this article, discover:");
  const [highlights, setHighlights] = useState([""]);
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [authorNote, setAuthorNote] = useState("");
  const [contributors, setContributors] = useState([]);
  const [socialLinks, setSocialLinks] = useState({
    website: "https://onnesaerospace.com",
    contact: "",
    linkedin: "",
    youtube: "",
  });
  const [bodyHtml, setBodyHtml] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const imageInputRef = useRef(null);
  const introImageInputRef = useRef(null);

  const [audienceList, setAudienceList] = useState([]);
  const [loadingAudience, setLoadingAudience] = useState(true);
  const [selectedEmails, setSelectedEmails] = useState(new Set());

  useEffect(() => {
    let cancelled = false;
    setLoadingAudience(true);
    (async () => {
      try {
        const res = await api.get(
          `/api/admin-newsletter/audience?type=${type}`,
          authHeaders()
        );
        if (cancelled) return;
        const list = res.data.recipients || [];
        setAudienceList(list);
        setSelectedEmails(new Set(list.map((r) => r.email)));
      } catch (err) {
        console.error("Failed to fetch audience:", err);
        if (!cancelled) {
          setAudienceList([]);
          setSelectedEmails(new Set());
        }
      } finally {
        if (!cancelled) setLoadingAudience(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [type]);

  const toggleRecipient = (email) => {
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  };

  const allSelected = audienceList.length > 0 && selectedEmails.size === audienceList.length;
  const toggleSelectAll = () => {
    setSelectedEmails(allSelected ? new Set() : new Set(audienceList.map((r) => r.email)));
  };

  const CATEGORY_LABELS = { general: "General Subscribers", client: "Clients", investor: "Investors" };
  const CATEGORY_ORDER = ["general", "client", "investor"];
  const groupedAudience = CATEGORY_ORDER.map((key) => ({
    key,
    label: CATEGORY_LABELS[key],
    items: audienceList.filter((r) => r.category === key),
  })).filter((g) => g.items.length > 0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      ImageExtension.configure({
        HTMLAttributes: { style: "max-width:100%;border-radius:8px;" },
      }),
      LinkExtension.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({
        placeholder: "Optional — more paragraphs, images, or lists below the intro.",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setBodyHtml(editor.getHTML());
    },
  });

  const audienceLabel =
    type === "generic"
      ? "General subscribers, Clients & Investors"
      : "Clients & Investors only";

  const isBodyEmpty = !editor || editor.isEmpty;
  const canSend =
    subject.trim() &&
    headline.trim() &&
    (introText.trim() || !isBodyEmpty) &&
    selectedEmails.size > 0;

  const handleAddImage = (e) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result }).run();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSetLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter URL", previousUrl);
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const handleIntroImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await readFileAsBase64(file);
    setIntroImage(base64);
    e.target.value = "";
  };

  const updateHighlight = (i, val) => {
    setHighlights((prev) => prev.map((h, idx) => (idx === i ? val : h)));
  };
  const addHighlight = () => setHighlights((prev) => [...prev, ""]);
  const removeHighlight = (i) => setHighlights((prev) => prev.filter((_, idx) => idx !== i));

  const addContributor = () => setContributors((prev) => [...prev, { name: "", photo: null }]);
  const updateContributorName = (i, val) => {
    setContributors((prev) => prev.map((c, idx) => (idx === i ? { ...c, name: val } : c)));
  };
  const updateContributorPhoto = async (i, file) => {
    if (!file) return;
    const base64 = await readFileAsBase64(file);
    setContributors((prev) => prev.map((c, idx) => (idx === i ? { ...c, photo: base64 } : c)));
  };
  const removeContributor = (i) => setContributors((prev) => prev.filter((_, idx) => idx !== i));

  const resetForm = () => {
    setSubject("");
    setTagline("");
    setHeadline("");
    setIntroText("");
    setIntroImage(null);
    setSubheading("");
    setHighlightsTitle("In this article, discover:");
    setHighlights([""]);
    setCtaText("");
    setCtaLink("");
    setAuthorNote("");
    setContributors([]);
    if (editor) editor.commands.clearContent();
    setBodyHtml("");
  };

  const handleSend = async () => {
    if (!editor) return;
    setSending(true);
    setFeedback(null);
    try {
      const res = await api.post(
        "/api/admin-newsletter/send",
        {
          type,
          subject,
          tagline,
          headline,
          introText,
          introImage,
          subheading,
          bodyHtml: editor.getHTML(),
          highlightsTitle,
          highlights: highlights.filter((h) => h.trim()),
          ctaText,
          ctaLink,
          authorNote,
          contributors: contributors.filter((c) => c.name.trim()),
          socialLinks,
          selectedEmails: [...selectedEmails],
        },
        authHeaders()
      );
      setFeedback({ type: "success", message: res.data.message });
      resetForm();
      onSent();
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.response?.data?.message || "Failed to send newsletter.",
      });
    } finally {
      setSending(false);
      setConfirming(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 20, alignItems: "start" }}>
      <div style={cardStyle}>
        <label style={labelStyle}>Newsletter Type</label>
        <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
          <TypeOption
            selected={type === "generic"}
            onClick={() => setType("generic")}
            title="Generic Information"
            desc="Sent to everyone — General subscribers, Clients, and Investors."
          />
          <TypeOption
            selected={type === "project_updates"}
            onClick={() => setType("project_updates")}
            title="Updates on Current & Future Projects"
            desc="Sent only to Clients and Investors."
          />
        </div>

        <div style={{
          display: "flex", alignItems: "flex-start", gap: 8,
          background: type === "generic" ? "#eff6ff" : "#f8fafc",
          border: `1px solid ${type === "generic" ? "#bfdbfe" : "#e2e8f0"}`,
          borderRadius: 8, padding: "10px 12px", marginBottom: 20,
          fontSize: 12.5, color: type === "generic" ? "#1d4ed8" : "#64748b", lineHeight: 1.5,
        }}>
          {type === "generic"
            ? "This will also publish a public article at onnesaerospace.com/blogs — the \"Read More\" button defaults to that page unless you set a custom link below."
            : "Project Updates stay private. No public article page is created, and no default \"Read More\" link is added."}
        </div>

        <label style={labelStyle}>Email Subject Line</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Onnes Aerospace — Monthly Update, August 2026"
          style={inputStyle}
        />

        <label style={labelStyle}>Tagline (optional)</label>
        <input
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="e.g. Your monthly hit of breakthrough innovation in Aerospace"
          style={inputStyle}
        />

        <label style={labelStyle}>Headline</label>
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="e.g. What's new at Onnes this month"
          style={inputStyle}
        />

        <SectionDivider label="Intro" />

        <label style={labelStyle}>Intro Text</label>
        <textarea
          value={introText}
          onChange={(e) => setIntroText(e.target.value)}
          placeholder="Opening paragraph(s) that sit beside the intro image. Leave a blank line between paragraphs."
          style={{ ...inputStyle, minHeight: 90, resize: "vertical", fontFamily: "'Inter', sans-serif" }}
        />

        <label style={labelStyle}>Intro Image (optional)</label>
        {introImage ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <img src={introImage} alt="Intro" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 6, border: "1px solid #e2e8f0" }} />
            <button onClick={() => setIntroImage(null)} style={secondaryBtnStyle}>Remove</button>
          </div>
        ) : (
          <button onClick={() => introImageInputRef.current?.click()} style={secondaryBtnStyle}>
            Upload Image
          </button>
        )}
        <input
          ref={introImageInputRef}
          type="file"
          accept="image/*"
          onChange={handleIntroImageChange}
          style={{ display: "none" }}
        />

        <label style={labelStyle}>Subheading (optional)</label>
        <input
          type="text"
          value={subheading}
          onChange={(e) => setSubheading(e.target.value)}
          placeholder="e.g. What this means for our clients"
          style={inputStyle}
        />

        <SectionDivider label="Additional Content" />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <label style={{ ...labelStyle, marginBottom: 0, marginTop: 0 }}>Message (optional)</label>
          <button
            onClick={() => setShowPreview((p) => !p)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "none", border: "1px solid #e2e8f0", borderRadius: 8,
              padding: "5px 10px", fontSize: 12, color: "#475569", cursor: "pointer",
            }}
          >
            {showPreview ? <FaEyeSlash size={11} /> : <FaEye size={11} />}
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>

        <div style={{ display: showPreview ? "none" : "block" }}>
          <EditorToolbar
            editor={editor}
            onAddImage={() => imageInputRef.current?.click()}
            onSetLink={handleSetLink}
          />
          <div style={editorWrapperStyle}>
            <EditorContent editor={editor} />
          </div>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleAddImage}
            style={{ display: "none" }}
          />

          <SectionDivider label="Highlights (optional)" />

          <label style={labelStyle}>Highlights Title</label>
          <input
            type="text"
            value={highlightsTitle}
            onChange={(e) => setHighlightsTitle(e.target.value)}
            placeholder="e.g. In this article, discover:"
            style={inputStyle}
          />
          {highlights.map((h, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input
                type="text"
                value={h}
                onChange={(e) => updateHighlight(i, e.target.value)}
                placeholder={`Highlight ${i + 1}`}
                style={{ ...inputStyle, marginTop: 0 }}
              />
              {highlights.length > 1 && (
                <button onClick={() => removeHighlight(i)} style={iconBtnStyle} title="Remove">
                  <FaTrash size={12} />
                </button>
              )}
            </div>
          ))}
          <button onClick={addHighlight} style={{ ...secondaryBtnStyle, marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <FaPlus size={10} /> Add Highlight
          </button>

          <SectionDivider label="Call to Action" />

          <label style={labelStyle}>Button Text (optional)</label>
          <input
            type="text"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            placeholder="e.g. Read our latest article"
            style={inputStyle}
          />

          <label style={labelStyle}>Button Link (optional)</label>
          <input
            type="text"
            value={ctaLink}
            onChange={(e) => setCtaLink(e.target.value)}
            placeholder="https://onnesaerospace.com"
            style={inputStyle}
          />

          <SectionDivider label="Author's Note (optional)" />

          <textarea
            value={authorNote}
            onChange={(e) => setAuthorNote(e.target.value)}
            placeholder="A closing reflection from the author, shown in italics."
            style={{ ...inputStyle, minHeight: 80, resize: "vertical", fontFamily: "'Inter', sans-serif" }}
          />

          <SectionDivider label="Contributors (optional)" />

          {contributors.map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              {c.photo ? (
                <img src={c.photo} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: "50%", border: "1px solid #e2e8f0" }} />
              ) : (
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f1f5f9" }} />
              )}
              <input
                type="text"
                value={c.name}
                onChange={(e) => updateContributorName(i, e.target.value)}
                placeholder="Name"
                style={{ ...inputStyle, marginTop: 0, flex: 1 }}
              />
              <label style={{ ...secondaryBtnStyle, cursor: "pointer" }}>
                Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => updateContributorPhoto(i, e.target.files?.[0])}
                  style={{ display: "none" }}
                />
              </label>
              <button onClick={() => removeContributor(i)} style={iconBtnStyle} title="Remove">
                <FaTrash size={12} />
              </button>
            </div>
          ))}
          <button onClick={addContributor} style={{ ...secondaryBtnStyle, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <FaPlus size={10} /> Add Contributor
          </button>

          <SectionDivider label="Social Links (optional)" />

          <label style={labelStyle}>Website</label>
          <input
            type="text"
            value={socialLinks.website}
            onChange={(e) => setSocialLinks((s) => ({ ...s, website: e.target.value }))}
            placeholder="https://onnesaerospace.com"
            style={inputStyle}
          />
          <label style={labelStyle}>Contact</label>
          <input
            type="text"
            value={socialLinks.contact}
            onChange={(e) => setSocialLinks((s) => ({ ...s, contact: e.target.value }))}
            placeholder="https://onnesaerospace.com/contact"
            style={inputStyle}
          />
          <label style={labelStyle}>LinkedIn</label>
          <input
            type="text"
            value={socialLinks.linkedin}
            onChange={(e) => setSocialLinks((s) => ({ ...s, linkedin: e.target.value }))}
            placeholder="https://linkedin.com/company/..."
            style={inputStyle}
          />
          <label style={labelStyle}>YouTube</label>
          <input
            type="text"
            value={socialLinks.youtube}
            onChange={(e) => setSocialLinks((s) => ({ ...s, youtube: e.target.value }))}
            placeholder="https://youtube.com/@..."
            style={inputStyle}
          />
        </div>

        {showPreview && (
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", marginTop: 4 }}>
            <iframe
              title="newsletter-preview"
              srcDoc={buildPreviewHTML({
                subject, type, headline, tagline, introText, introImage, subheading,
                bodyHtml, highlightsTitle, highlights, ctaText, ctaLink, authorNote,
                contributors, socialLinks,
              })}
              style={{ width: "100%", height: 700, border: "none", display: "block" }}
            />
          </div>
        )}

        {feedback && (
          <div
            style={{
              marginTop: 16,
              padding: "10px 14px",
              borderRadius: 8,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: feedback.type === "success" ? "#f0fdf4" : "#fef2f2",
              color: feedback.type === "success" ? "#16a34a" : "#dc2626",
              border: `1px solid ${feedback.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            }}
          >
            {feedback.type === "success" ? <FaCheckCircle size={13} /> : <FaTimesCircle size={13} />}
            {feedback.message}
          </div>
        )}

        <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
          {!confirming ? (
            <button
              disabled={!canSend}
              onClick={() => setConfirming(true)}
              style={{
                ...primaryBtnStyle,
                opacity: canSend ? 1 : 0.5,
                cursor: canSend ? "pointer" : "not-allowed",
              }}
            >
              <FaPaperPlane size={12} style={{ marginRight: 8 }} />
              Send Newsletter
            </button>
          ) : (
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10,
              padding: "10px 16px", width: "100%", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 13, color: "#92400e", display: "flex", alignItems: "center", gap: 8 }}>
                <FaExclamationTriangle size={13} />
                Send to {selectedEmails.size} recipient{selectedEmails.size !== 1 ? "s" : ""}? This can't be undone.
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setConfirming(false)} style={secondaryBtnStyle}>Cancel</button>
                <button onClick={handleSend} disabled={sending} style={primaryBtnStyle}>
                  {sending ? "Sending…" : "Confirm & Send"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1a365d" }}>Recipients</p>
          {audienceList.length > 0 && (
            <button
              onClick={toggleSelectAll}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 600, color: "#00B5F9", padding: 0,
              }}
            >
              {allSelected ? "Deselect all" : "Select all"}
            </button>
          )}
        </div>
        <p style={{ margin: "2px 0 12px", fontSize: 12, color: "#94a3b8" }}>{audienceLabel}</p>

        <p style={{ margin: "0 0 10px", fontSize: 12.5, fontWeight: 600, color: "#1a365d" }}>
          {selectedEmails.size} of {audienceList.length} selected
        </p>

        {loadingAudience ? (
          <p style={{ fontSize: 13, color: "#94a3b8" }}>Loading recipients…</p>
        ) : audienceList.length === 0 ? (
          <p style={{ fontSize: 13, color: "#94a3b8" }}>No recipients found for this audience.</p>
        ) : (
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, maxHeight: 380, overflowY: "auto" }}>
            {groupedAudience.map((group) => (
              <div key={group.key}>
                <div style={{
                  padding: "6px 10px", background: "#f8fafc",
                  fontSize: 11, fontWeight: 700, color: "#94a3b8",
                  textTransform: "uppercase", letterSpacing: 0.4,
                  position: "sticky", top: 0,
                }}>
                  {group.label} ({group.items.length})
                </div>
                {group.items.map((r) => (
                  <label
                    key={r.email}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 8,
                      padding: "7px 10px", borderTop: "1px solid #f1f5f9",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmails.has(r.email)}
                      onChange={() => toggleRecipient(r.email)}
                      style={{ marginTop: 2 }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: 12.5, fontWeight: 600, color: "#1a365d",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {r.name || r.email}
                      </div>
                      {r.name && (
                        <div style={{
                          fontSize: 11, color: "#94a3b8",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>
                          {r.email}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionDivider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "22px 0 4px" }}>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.6, whiteSpace: "nowrap" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: "#eef2f6" }} />
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// RICH TEXT EDITOR TOOLBAR
// ────────────────────────────────────────────────────────────
function EditorToolbar({ editor, onAddImage, onSetLink }) {
  if (!editor) return null;

  const ToolBtn = ({ onClick, active, disabled, title, children }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minWidth: 30, height: 30, padding: "0 6px",
        border: "1px solid " + (active ? "#00B5F9" : "#e2e8f0"),
        background: active ? "#e0f7ff" : "#fff",
        color: active ? "#00B5F9" : "#475569",
        borderRadius: 6,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {children}
    </button>
  );

  return (
    <div style={{
      display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6,
      border: "1px solid #e2e8f0", borderBottom: "none",
      borderRadius: "8px 8px 0 0", padding: "8px 10px", background: "#f8fafc",
    }}>
      <ToolBtn title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <FaBold size={12} />
      </ToolBtn>
      <ToolBtn title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <FaItalic size={12} />
      </ToolBtn>
      <ToolBtn title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <FaStrikethrough size={12} />
      </ToolBtn>

      <div style={toolbarDividerStyle} />

      <ToolBtn title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </ToolBtn>
      <ToolBtn title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        H3
      </ToolBtn>
      <ToolBtn title="Paragraph" active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()}>
        ¶
      </ToolBtn>

      <div style={toolbarDividerStyle} />

      <ToolBtn title="Bullet List" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <FaListUl size={12} />
      </ToolBtn>
      <ToolBtn title="Numbered List" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <FaListOl size={12} />
      </ToolBtn>
      <ToolBtn title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <FaQuoteRight size={12} />
      </ToolBtn>

      <div style={toolbarDividerStyle} />

      <ToolBtn title="Add / Edit Link" active={editor.isActive("link")} onClick={onSetLink}>
        <FaLink size={12} />
      </ToolBtn>
      <ToolBtn title="Insert Image" onClick={onAddImage}>
        <FaImage size={12} />
      </ToolBtn>

      <div style={toolbarDividerStyle} />

      <ToolBtn title="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
        <FaUndo size={12} />
      </ToolBtn>
      <ToolBtn title="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
        <FaRedo size={12} />
      </ToolBtn>
    </div>
  );
}

function TypeOption({ selected, onClick, title, desc }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: `1.5px solid ${selected ? "#00B5F9" : "#e2e8f0"}`,
        background: selected ? "#e0f7ff" : "#fff",
        borderRadius: 10,
        padding: "12px 14px",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: "#1a365d" }}>{title}</p>
      <p style={{ margin: "3px 0 0", fontSize: 12, color: "#64748b" }}>{desc}</p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// RECIPIENTS TAB (Clients & Investors management)
// ────────────────────────────────────────────────────────────
function RecipientsTab({ onChange }) {
  const [filter, setFilter] = useState("client");
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", category: "client", status: "existing" });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const fetchRecipients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin-newsletter/recipients?category=${filter}`, authHeaders());
      setRecipients(res.data);
    } catch (err) {
      console.error("Failed to fetch recipients:", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchRecipients();
  }, [fetchRecipients]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }
    setAdding(true);
    try {
      await api.post("/api/admin-newsletter/recipients", form, authHeaders());
      setForm({ name: "", email: "", category: filter, status: "existing" });
      fetchRecipients();
      onChange();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add recipient.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this recipient?")) return;
    try {
      await api.delete(`/api/admin-newsletter/recipients/${id}`, authHeaders());
      fetchRecipients();
      onChange();
    } catch (err) {
      console.error("Failed to delete recipient:", err);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px minmax(0, 1fr)", gap: 20, alignItems: "start" }}>
      <div style={cardStyle}>
        <p style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: "#1a365d" }}>Add Recipient</p>
        <form onSubmit={handleAdd}>
          <label style={labelStyle}>Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Optional"
            style={inputStyle}
          />

          <label style={labelStyle}>Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="name@company.com"
            style={inputStyle}
          />

          <label style={labelStyle}>Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={inputStyle}
          >
            <option value="client">Client</option>
            <option value="investor">Investor</option>
          </select>

          <label style={labelStyle}>Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            style={inputStyle}
          >
            <option value="existing">Existing</option>
            <option value="future">Future</option>
          </select>

          {error && <p style={{ color: "#dc2626", fontSize: 12, margin: "8px 0 0" }}>{error}</p>}

          <button type="submit" disabled={adding} style={{ ...primaryBtnStyle, width: "100%", marginTop: 16, justifyContent: "center" }}>
            <FaUserPlus size={12} style={{ marginRight: 8 }} />
            {adding ? "Adding…" : "Add Recipient"}
          </button>
        </form>
      </div>

      <div style={cardStyle}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["client", "investor"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: "1px solid " + (filter === cat ? "#00B5F9" : "#e2e8f0"),
                background: filter === cat ? "#e0f7ff" : "#fff",
                color: filter === cat ? "#00B5F9" : "#64748b",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {cat}s
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ fontSize: 13, color: "#94a3b8" }}>Loading…</p>
        ) : recipients.length === 0 ? (
          <p style={{ fontSize: 13, color: "#94a3b8" }}>No {filter}s added yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#94a3b8", fontSize: 12 }}>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {recipients.map((r) => (
                  <tr key={r._id} style={{ borderTop: "1px solid #eef2f6" }}>
                    <td style={tdStyle}>{r.name || "—"}</td>
                    <td style={tdStyle}>{r.email}</td>
                    <td style={tdStyle}>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 12,
                        background: r.status === "existing" ? "#f0fdf4" : "#eff6ff",
                        color: r.status === "existing" ? "#16a34a" : "#2563eb",
                        textTransform: "capitalize",
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      <button
                        onClick={() => handleDelete(r._id)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: 4 }}
                        title="Remove"
                      >
                        <FaTrash size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// HISTORY TAB
// ────────────────────────────────────────────────────────────
function HistoryTab() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);
  const [viewLoadingId, setViewLoadingId] = useState(null);
  const [resendingId, setResendingId] = useState(null);
  const [resendFeedback, setResendFeedback] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await api.get("/api/admin-newsletter/history", authHeaders());
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleView = async (id) => {
    setViewLoadingId(id);
    try {
      const res = await api.get(`/api/admin-newsletter/history/${id}`, authHeaders());
      setViewing(res.data);
    } catch (err) {
      console.error("Failed to fetch newsletter:", err);
    } finally {
      setViewLoadingId(null);
    }
  };

  const handleResendFailed = async (id) => {
    setResendingId(id);
    setResendFeedback(null);
    try {
      const res = await api.post(`/api/admin-newsletter/history/${id}/resend-failed`, {}, authHeaders());
      setResendFeedback({ id, type: "success", message: res.data.message });
      setTimeout(fetchHistory, 4000);
    } catch (err) {
      setResendFeedback({
        id,
        type: "error",
        message: err.response?.data?.message || "Failed to resend.",
      });
    } finally {
      setResendingId(null);
    }
  };

  const statusBadge = (status) => {
    const map = {
      sending: { bg: "#fffbeb", color: "#92400e", label: "Sending" },
      completed: { bg: "#f0fdf4", color: "#16a34a", label: "Completed" },
      completed_with_errors: { bg: "#fff7ed", color: "#c2410c", label: "Completed (errors)" },
      failed: { bg: "#fef2f2", color: "#dc2626", label: "Failed" },
    };
    const s = map[status] || map.sending;
    return (
      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 12, background: s.bg, color: s.color }}>
        {s.label}
      </span>
    );
  };

  return (
    <div style={cardStyle}>
      {loading ? (
        <p style={{ fontSize: 13, color: "#94a3b8" }}>Loading…</p>
      ) : history.length === 0 ? (
        <p style={{ fontSize: 13, color: "#94a3b8" }}>No newsletters sent yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#94a3b8", fontSize: 12 }}>
                <th style={thStyle}>Subject</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Recipients</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => {
                const canResend =
                  (h.status === "completed_with_errors" || h.status === "failed") &&
                  h.failedEmails?.length > 0;
                const rowFeedback = resendFeedback?.id === h._id ? resendFeedback : null;

                return (
                  <React.Fragment key={h._id}>
                    <tr style={{ borderTop: "1px solid #eef2f6" }}>
                      <td style={tdStyle}>{h.subject}</td>
                      <td style={tdStyle}>
                        {h.type === "generic" ? "Generic Information" : "Project Updates"}
                      </td>
                      <td style={tdStyle}>{h.sentCount} / {h.totalRecipients}</td>
                      <td style={tdStyle}>{statusBadge(h.status)}</td>
                      <td style={tdStyle}>{new Date(h.createdAt).toLocaleString("en-IN")}</td>
                      <td style={{ ...tdStyle, textAlign: "right", whiteSpace: "nowrap" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          {h.slug && (
                              <a
                              href={`${window.location.origin}/blogs/${h.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View the published article"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                background: "none",
                                border: "1px solid #bfdbfe",
                                borderRadius: 6,
                                padding: "5px 10px",
                                fontSize: 12,
                                color: "#1d4ed8",
                                textDecoration: "none",
                              }}
                            >
                              <FaExternalLinkAlt size={10} />
                              Article
                            </a>
                          )}
                          {canResend && (
                            <button
                              onClick={() => handleResendFailed(h._id)}
                              disabled={resendingId === h._id}
                              title={`Resend to the ${h.failedEmails.length} recipient(s) that failed`}
                              style={{
                                display: "inline-flex", alignItems: "center", gap: 6,
                                background: "none", border: "1px solid #fecaca", borderRadius: 6,
                                padding: "5px 10px", fontSize: 12, color: "#dc2626",
                                cursor: resendingId === h._id ? "not-allowed" : "pointer",
                                opacity: resendingId === h._id ? 0.6 : 1,
                              }}
                            >
                              <FaRedoAlt size={11} />
                              {resendingId === h._id
                                ? "Resending…"
                                : `Resend (${h.failedEmails.length})`}
                            </button>
                          )}
                          <button
                            onClick={() => handleView(h._id)}
                            disabled={viewLoadingId === h._id}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 6,
                              background: "none", border: "1px solid #e2e8f0", borderRadius: 6,
                              padding: "5px 10px", fontSize: 12, color: "#00B5F9", cursor: "pointer",
                            }}
                          >
                            <FaEye size={11} />
                            {viewLoadingId === h._id ? "Loading…" : "View"}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {rowFeedback && (
                      <tr>
                        <td colSpan={6} style={{ padding: "0 10px 10px" }}>
                          <div
                            style={{
                              fontSize: 12,
                              padding: "6px 10px",
                              borderRadius: 6,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              background: rowFeedback.type === "success" ? "#f0fdf4" : "#fef2f2",
                              color: rowFeedback.type === "success" ? "#16a34a" : "#dc2626",
                              border: `1px solid ${rowFeedback.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                            }}
                          >
                            {rowFeedback.type === "success" ? <FaCheckCircle size={11} /> : <FaTimesCircle size={11} />}
                            {rowFeedback.message}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {viewing && (
        <div
          onClick={() => setViewing(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(15, 38, 71, 0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: 14, width: "100%", maxWidth: 640,
              maxHeight: "88vh", display: "flex", flexDirection: "column", overflow: "hidden",
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 18px", borderBottom: "1px solid #e2e8f0",
            }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1a365d" }}>{viewing.subject}</p>
              <button
                onClick={() => setViewing(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <FaTimes size={16} />
              </button>
            </div>
            <iframe
              title="newsletter-view"
              srcDoc={viewing.htmlContent}
              style={{ width: "100%", flex: 1, border: "none", minHeight: 500 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  borderRadius: 16,
  padding: "22px 24px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  border: "1px solid #e9eef4",
};

const labelStyle = {
  display: "block",
  fontSize: 12.5,
  fontWeight: 600,
  color: "#475569",
  marginBottom: 6,
  marginTop: 12,
};

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  fontSize: 13.5,
  color: "#1a365d",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'Inter', sans-serif",
};

const primaryBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  background: "#00B5F9",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "10px 18px",
  fontSize: 13.5,
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryBtnStyle = {
  background: "#fff",
  color: "#475569",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  padding: "8px 14px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const iconBtnStyle = {
  background: "#fff",
  color: "#ef4444",
  border: "1px solid #fecaca",
  borderRadius: 8,
  padding: "0 12px",
  fontSize: 13,
  cursor: "pointer",
};

const thStyle = { padding: "8px 10px", fontWeight: 600 };
const tdStyle = { padding: "10px 10px", color: "#334155" };

const toolbarDividerStyle = {
  width: 1,
  alignSelf: "stretch",
  background: "#e2e8f0",
  margin: "2px 4px",
};

const editorWrapperStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: "0 0 8px 8px",
  minHeight: 200,
  maxHeight: 420,
  overflowY: "auto",
  padding: "12px 14px",
  fontSize: 13.5,
  color: "#1a365d",
  fontFamily: "'Inter', sans-serif",
  marginBottom: 4,
};

const editorGlobalStyles = `
  .ProseMirror { outline: none; }
  .ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #94a3b8;
    pointer-events: none;
    height: 0;
  }
  .ProseMirror h2 { font-size: 18px; font-weight: 700; color: #1a365d; margin: 14px 0 8px; }
  .ProseMirror h3 { font-size: 15px; font-weight: 700; color: #1a365d; margin: 12px 0 6px; }
  .ProseMirror p { margin: 0 0 10px; line-height: 1.6; }
  .ProseMirror ul, .ProseMirror ol { padding-left: 22px; margin: 0 0 10px; }
  .ProseMirror li { margin-bottom: 4px; }
  .ProseMirror blockquote {
    border-left: 3px solid #00B5F9;
    margin: 0 0 10px;
    padding-left: 12px;
    color: #64748b;
    font-style: italic;
  }
  .ProseMirror a { color: #00B5F9; text-decoration: underline; }
  .ProseMirror img { max-width: 100%; border-radius: 8px; margin: 8px 0; display: block; }
`;