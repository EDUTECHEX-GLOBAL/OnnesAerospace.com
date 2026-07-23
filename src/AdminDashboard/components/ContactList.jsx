import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DatePicker, Select, Button, Tag, Modal, Drawer } from 'antd';
import {
  DoubleLeftOutlined, LeftOutlined, RightOutlined, DoubleRightOutlined,
  ExportOutlined, FilterOutlined, ReloadOutlined, EyeOutlined, DownloadOutlined,
} from '@ant-design/icons';
import 'antd/dist/reset.css';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

const API = process.env.REACT_APP_API_URL;
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { RangePicker } = DatePicker;
const { Option } = Select;

// Current "Area of Interest" options (per the updated contact form).
const areaOptions = [
  "All",
  "Space Infrastructure",
  "National Security & Defence",
  "Advanced Aerospace Systems",
  "Launch Vehicles",
  "Satellites",
  "Orbital Logistics",
  "Lunar Infrastructure & ISRU",
  "Hydrogen & Clean Energy",
  "Strategic Partnership",
  "Investment",
  "Media",
  "Careers",
  "Other",
];

// Legacy "Interested In" tag colors — kept so older submissions still render correctly.
const interestColors = {
  "Commercial Space":     "#0ea5e9",
  "National Security":    "#ef4444",
  "Industry Partnership": "#8b5cf6",
  "Investment":           "#f59e0b",
  "Careers":              "#10b981",
  "Media & Speaking":     "#ec4899",
};

// Colors for the new "Project Stage" field.
const projectStageColors = {
  "Concept / Early Research": "#64748b",
  "Technology Evaluation":    "#0ea5e9",
  "Prototype Development":    "#8b5cf6",
  "Qualification & Testing":  "#f97316",
  "Production Program":       "#22c55e",
  "Partnership Discussion":   "#ec4899",
  "General Inquiry":          "#94a3b8",
};

const areaColors = {
  // legacy (pre-update) area-of-interest values
  "Global Partnerships":               "#0ea5e9",
  "Space & Defense Applications":      "#ef4444",
  "Advanced Infrastructure Platforms": "#8b5cf6",
  "Deep Space Mission Enablement":     "#f59e0b",
  // current area-of-interest values
  "Space Infrastructure":              "#0ea5e9",
  "National Security & Defence":       "#ef4444",
  "Advanced Aerospace Systems":        "#8b5cf6",
  "Launch Vehicles":                   "#f97316",
  "Satellites":                        "#14b8a6",
  "Orbital Logistics":                 "#6366f1",
  "Lunar Infrastructure & ISRU":       "#eab308",
  "Hydrogen & Clean Energy":           "#22c55e",
  "Strategic Partnership":             "#ec4899",
  "Investment":                        "#f59e0b",
  "Media":                             "#d946ef",
  "Careers":                           "#10b981",
  "Other":                             "#64748b",
};

// inject responsive CSS once
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  .cl-table-wrap { display: block; }
  .cl-cards-wrap { display: none; }
  .cl-filter-inline { display: flex; }
  .cl-filter-btn-mobile { display: none !important; }
  .cl-header h1 { font-size: 24px; }
  @media (max-width: 767px) {
    .cl-table-wrap { display: none !important; }
    .cl-cards-wrap { display: flex !important; }
    .cl-filter-inline { display: none !important; }
    .cl-filter-btn-mobile { display: inline-flex !important; }
    .cl-header h1 { font-size: 18px !important; }
    .cl-export-btn span.full-label { display: none; }
    .cl-export-btn span.short-label { display: inline; }
  }
  @media (min-width: 768px) {
    .cl-export-btn span.short-label { display: none; }
  }
`;
if (!document.head.querySelector("#cl-styles")) {
  styleTag.id = "cl-styles";
  document.head.appendChild(styleTag);
}

// Helper function to get download URL from MongoDB
function getDownloadUrl(c) {
  if (!c || !c._id) return null;
  if (c.fileData || c.fileName) {
    return `${API}/api/admin-contact/file/${c._id}?download=true`;
  }
  return null;
}

// A submission's "Project Stage" tag — falls back to the legacy "interest" field
// for records saved before this field existed.
function getStageValue(c) {
  return c.projectStage || c.interest || '';
}

function getStageColor(c) {
  return projectStageColors[c.projectStage] || interestColors[c.interest] || "#64748b";
}

export default function ContactList() {
  const [contacts, setContacts]       = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [dateRange, setDateRange]     = useState([null, null]);
  const [areaFilter, setAreaFilter]   = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage]         = useState(10);
  const [modalData, setModalData]     = useState(null);
  const [loading, setLoading]         = useState(true);
  const [filterOpen, setFilterOpen]   = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/admin-contact`)
      .then(res => { 
        setContacts(res.data); 
        setFiltered(res.data); 
        setLoading(false); 
      })
      .catch(err => { 
        console.error("Contact API error:", err); 
        setLoading(false); 
      });
  }, []);

  const exportData = () => {
    const rows = filtered.map((c, i) => ({
      SNo: i + 1, 
      Name: c.fullName, 
      Email: c.email,
      Organization: c.organization || '', 
      Country: c.country || '',
      AreaOfInterest: c.product || '', 
      ProjectStage: getStageValue(c),
      Phone: c.mobile || '', 
      Message: c.message,
      Attachment: c.fileName || '',
      CreatedOn: new Date(c.createdAt).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Contacts');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf]), `Contact_List_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const applyFilter = () => {
    const [start, end] = dateRange;
    let tmp = [...contacts];
    if (start && end) tmp = tmp.filter(c => {
      const d = dayjs(c.createdAt);
      return d.isSameOrAfter(start, 'day') && d.isSameOrBefore(end, 'day');
    });
    if (areaFilter !== 'All') tmp = tmp.filter(c =>
      c.product?.toLowerCase().trim() === areaFilter.toLowerCase().trim()
    );
    setFiltered(tmp); 
    setCurrentPage(1); 
    setFilterOpen(false);
  };

  const resetFilter = () => {
    setDateRange([null, null]); 
    setAreaFilter('All');
    setFiltered(contacts); 
    setCurrentPage(1); 
    setFilterOpen(false);
  };

  const total     = filtered.length;
  const lastPage  = Math.max(1, Math.ceil(total / perPage));
  const startIdx  = (currentPage - 1) * perPage;
  const endIdx    = Math.min(startIdx + perPage, total);
  const pageSlice = filtered.slice(startIdx, endIdx);
  const goto      = p => setCurrentPage(Math.max(1, Math.min(lastPage, p)));

  const FilterFields = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={labelStyle}>Date Range</label>
        <RangePicker value={dateRange} onChange={vals => setDateRange(vals)}
          format="DD MMM YYYY" placeholder={['Start date', 'End date']}
          style={{ width: '100%', borderRadius: 8, height: 40 }} allowClear />
      </div>
      <div>
        <label style={labelStyle}>Area of Interest</label>
        <Select value={areaFilter} onChange={v => setAreaFilter(v)} style={{ width: '100%', height: 40 }}>
          {areaOptions.map((opt, i) => <Option key={i} value={opt}>{opt}</Option>)}
        </Select>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Button icon={<FilterOutlined />} onClick={applyFilter}
          style={{ flex: 1, backgroundColor: '#00B5F9', borderColor: '#00B5F9', color: '#fff', borderRadius: 8, height: 40, fontWeight: 600 }}>
          Apply
        </Button>
        <Button icon={<ReloadOutlined />} onClick={resetFilter}
          style={{ flex: 1, borderRadius: 8, height: 40 }}>
          Reset
        </Button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "24px 20px", minHeight: "100vh", backgroundColor: "#f0f4f8", fontFamily: "'Inter', sans-serif", boxSizing: "border-box" }}>

      {/* ── Header ── */}
      <div className="cl-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, gap: 10, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>Contact Submissions</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>{total} {total === 1 ? "entry" : "entries"} found</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Button className="cl-filter-btn-mobile" icon={<FilterOutlined />} onClick={() => setFilterOpen(true)}
            style={{ borderRadius: 8, height: 38, borderColor: "#00B5F9", color: "#00B5F9" }}>
            Filters
          </Button>
          <Button className="cl-export-btn" icon={<ExportOutlined />} onClick={exportData}
            style={{ backgroundColor: "#00B5F9", borderColor: "#00B5F9", color: "#fff", borderRadius: 8, height: 38, fontWeight: 600, paddingInline: 16 }}>
            <span className="full-label">Export to Excel</span>
            <span className="short-label">Export</span>
          </Button>
        </div>
      </div>

      {/* ── Desktop Filter Bar ── */}
      <div className="cl-filter-inline" style={{ background: "#fff", borderRadius: 12, padding: "18px 24px", marginBottom: 24, flexWrap: "wrap", alignItems: "flex-end", gap: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
        <div style={{ flex: "1 1 260px" }}>
          <label style={labelStyle}>Date Range</label>
          <RangePicker value={dateRange} onChange={vals => setDateRange(vals)}
            format="DD MMM YYYY" placeholder={['Start date', 'End date']}
            style={{ width: '100%', borderRadius: 8, height: 40 }} allowClear />
        </div>
        <div style={{ flex: "1 1 220px" }}>
          <label style={labelStyle}>Area of Interest</label>
          <Select value={areaFilter} onChange={v => setAreaFilter(v)} style={{ width: '100%', height: 40 }}>
            {areaOptions.map((opt, i) => <Option key={i} value={opt}>{opt}</Option>)}
          </Select>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Button icon={<FilterOutlined />} onClick={applyFilter}
            style={{ backgroundColor: "#00B5F9", borderColor: "#00B5F9", color: "#fff", borderRadius: 8, height: 40, fontWeight: 600, paddingInline: 20 }}>
            Filter
          </Button>
          <Button icon={<ReloadOutlined />} onClick={resetFilter}
            style={{ borderRadius: 8, height: 40, paddingInline: 20 }}>
            Reset
          </Button>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      <Drawer title="Filters" placement="bottom" height="auto"
        open={filterOpen} onClose={() => setFilterOpen(false)}
        styles={{ body: { padding: 20 } }}>
        <FilterFields />
      </Drawer>

      {/* ── Desktop Table ── */}
      <div className="cl-table-wrap" style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflow: "hidden", marginBottom: 20 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ backgroundColor: "#00B5F9" }}>
                {["#", "Full Name", "Email", "Organization", "Country", "Area of Interest", "Project Stage", "Phone", "Message", "Attachment", "Submitted On", ""].map(h => (
                  <th key={h} style={{ padding: "13px 16px", color: "#fff", fontWeight: 600, textAlign: "left", whiteSpace: "nowrap", fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={12} style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>Loading...</td></tr>
              ) : pageSlice.length === 0 ? (
                <tr><td colSpan={12} style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>No contacts found.</td></tr>
              ) : pageSlice.map((c, i) => (
                <tr key={c._id} style={{ backgroundColor: i % 2 === 0 ? "#f8fafc" : "#fff", borderBottom: "1px solid #e2e8f0" }}>
                  <td style={tdStyle}>{startIdx + i + 1}</td>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap" }}>{c.fullName}</td>
                  <td style={tdStyle}>{c.email}</td>
                  <td style={tdStyle}>{c.organization || <span style={{ color: "#cbd5e1" }}>—</span>}</td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{c.country || <span style={{ color: "#cbd5e1" }}>—</span>}</td>
                  <td style={tdStyle}>
                    {c.product ? <Tag color={areaColors[c.product] || "#64748b"} style={{ borderRadius: 6, fontWeight: 500 }}>{c.product}</Tag> : <span style={{ color: "#cbd5e1" }}>—</span>}
                  </td>
                  <td style={tdStyle}>
                    {getStageValue(c) ? <Tag color={getStageColor(c)} style={{ borderRadius: 6, fontWeight: 500 }}>{getStageValue(c)}</Tag> : <span style={{ color: "#cbd5e1" }}>—</span>}
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{c.mobile || <span style={{ color: "#cbd5e1" }}>—</span>}</td>
                  <td style={{ ...tdStyle, maxWidth: 200 }}>
                    <div style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.5 }}>{c.message}</div>
                  </td>
                  <td style={tdStyle}>
                    {getDownloadUrl(c) ? (
                      <a href={getDownloadUrl(c)} target="_blank" rel="noreferrer" style={{ color: "#00B5F9", display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <DownloadOutlined /> Download
                      </a>
                    ) : <span style={{ color: "#cbd5e1" }}>—</span>}
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap", fontSize: 12 }}>
                    {dayjs(c.createdAt).format("DD MMM YYYY")}<br />
                    <span style={{ color: "#94a3b8" }}>{dayjs(c.createdAt).format("h:mm A")}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <Button shape="circle" icon={<EyeOutlined />} size="small"
                      onClick={() => setModalData(c)}
                      style={{ borderColor: "#00B5F9", color: "#00B5F9" }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="cl-cards-wrap" style={{ flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>Loading...</div>
        ) : pageSlice.length === 0 ? (
          <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>No contacts found.</div>
        ) : pageSlice.map((c) => (
          <div key={c._id} style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ flex: 1, minWidth: 0, paddingRight: 10 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{c.fullName}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b", wordBreak: "break-all" }}>{c.email}</p>
              </div>
              <Button shape="circle" icon={<EyeOutlined />} size="small"
                onClick={() => setModalData(c)}
                style={{ borderColor: "#00B5F9", color: "#00B5F9", flexShrink: 0 }} />
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {c.product && <Tag color={areaColors[c.product] || "#64748b"} style={{ borderRadius: 6, fontSize: 11 }}>{c.product}</Tag>}
              {getStageValue(c) && <Tag color={getStageColor(c)} style={{ borderRadius: 6, fontSize: 11 }}>{getStageValue(c)}</Tag>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", fontSize: 12, marginBottom: 10 }}>
              {c.organization && (
                <div><span style={mobileLabel}>Organization</span><span style={mobileVal}>{c.organization}</span></div>
              )}
              {c.country && (
                <div><span style={mobileLabel}>Country</span><span style={mobileVal}>{c.country}</span></div>
              )}
              {c.mobile && (
                <div><span style={mobileLabel}>Phone</span><span style={mobileVal}>{c.mobile}</span></div>
              )}
              <div>
                <span style={mobileLabel}>Submitted</span>
                <span style={mobileVal}>{dayjs(c.createdAt).format("DD MMM YYYY")}</span>
              </div>
              {getDownloadUrl(c) && (
                <div>
                  <span style={mobileLabel}>Attachment</span>
                  <a href={getDownloadUrl(c)} target="_blank" rel="noreferrer" style={{ ...mobileVal, color: "#00B5F9" }}>
                    <DownloadOutlined /> Download
                  </a>
                </div>
              )}
            </div>

            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 8 }}>
              <span style={{ ...mobileLabel, marginBottom: 4, display: "block" }}>Message</span>
              <p style={{ margin: 0, fontSize: 12, color: "#475569", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.6 }}>
                {c.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Pagination ── */}
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: "#64748b" }}>Rows:</span>
          <Select value={perPage} onChange={v => { setPerPage(v); setCurrentPage(1); }} style={{ width: 68 }} size="small">
            {[5, 10, 25, 50, 100].map(n => <Option key={n} value={n}>{n}</Option>)}
          </Select>
        </div>
        <span style={{ fontSize: 13, color: "#64748b" }}>
          {total === 0 ? "0 results" : `${startIdx + 1}–${endIdx} of ${total}`}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          <Button shape="circle" icon={<DoubleLeftOutlined />}  size="small" disabled={currentPage === 1}        onClick={() => goto(1)} />
          <Button shape="circle" icon={<LeftOutlined />}        size="small" disabled={currentPage === 1}        onClick={() => goto(currentPage - 1)} />
          <Button shape="circle" icon={<RightOutlined />}       size="small" disabled={currentPage === lastPage} onClick={() => goto(currentPage + 1)} />
          <Button shape="circle" icon={<DoubleRightOutlined />} size="small" disabled={currentPage === lastPage} onClick={() => goto(lastPage)} />
        </div>
      </div>

      {/* ── Detail Modal ── */}
      <Modal open={!!modalData} onCancel={() => setModalData(null)} footer={null}
        title={<span style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Submission Detail</span>}
        style={{ top: 20 }}
        styles={{ body: { paddingTop: 8 } }}
      >
        {modalData && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              ["Full Name",        modalData.fullName],
              ["Email",            modalData.email],
              ["Organization",     modalData.organization || "—"],
              ["Country",          modalData.country      || "—"],
              ["Phone",            modalData.mobile       || "—"],
              ["Area of Interest", modalData.product      || "—"],
              ["Project Stage",    getStageValue(modalData) || "—"],
              ["Submitted On",     dayjs(modalData.createdAt).format("DD MMM YYYY, h:mm A")],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", gap: 12, fontSize: 13, flexWrap: "wrap" }}>
                <span style={{ minWidth: 130, fontWeight: 600, color: "#475569" }}>{label}</span>
                <span style={{ color: "#0f172a", flex: 1, wordBreak: "break-word" }}>{value}</span>
              </div>
            ))}
            {getDownloadUrl(modalData) && (
              <div style={{ display: "flex", gap: 12, fontSize: 13, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ minWidth: 130, fontWeight: 600, color: "#475569" }}>Attachment</span>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <a href={getDownloadUrl(modalData)} target="_blank" rel="noreferrer" style={{ color: "#00B5F9", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <DownloadOutlined /> Download {modalData.fileName || 'File'}
                  </a>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>
                    {modalData.fileName} ({(modalData.fileSize / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              </div>
            )}
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 12 }}>
              <p style={{ margin: "0 0 6px", fontWeight: 600, fontSize: 13, color: "#475569" }}>Message</p>
              <p style={{ margin: 0, fontSize: 13, color: "#0f172a", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{modalData.message}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

const labelStyle  = { display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" };
const tdStyle     = { padding: "12px 16px", color: "#334155", fontSize: 13 };
const mobileLabel = { fontSize: 11, color: "#94a3b8", fontWeight: 500 };
const mobileVal   = { display: "block", color: "#0f172a", fontWeight: 500, marginTop: 2 };