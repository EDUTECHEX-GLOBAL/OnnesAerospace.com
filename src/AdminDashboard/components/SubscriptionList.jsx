// src/AdminDashboard/components/SubscriptionList.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { DatePicker, Select, Button, Drawer } from "antd";
import {
  DoubleLeftOutlined, LeftOutlined, RightOutlined, DoubleRightOutlined,
  ExportOutlined, FilterOutlined, ReloadOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

const API = process.env.REACT_APP_API_URL;
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { RangePicker } = DatePicker;
const { Option } = Select;

// inject responsive CSS once
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  .sl-table-wrap { display: block; }
  .sl-cards-wrap { display: none; }
  .sl-filter-inline { display: flex; }
  .sl-filter-btn-mobile { display: none !important; }
  .sl-header h1 { font-size: 24px; }
  @media (max-width: 767px) {
    .sl-table-wrap { display: none !important; }
    .sl-cards-wrap { display: flex !important; }
    .sl-filter-inline { display: none !important; }
    .sl-filter-btn-mobile { display: inline-flex !important; }
    .sl-header h1 { font-size: 18px !important; }
    .sl-export-btn span.full-label { display: none; }
    .sl-export-btn span.short-label { display: inline; }
  }
  @media (min-width: 768px) {
    .sl-export-btn span.short-label { display: none; }
  }
`;
if (!document.head.querySelector("#sl-styles")) {
  styleTag.id = "sl-styles";
  document.head.appendChild(styleTag);
}

export default function SubscriptionList() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filtered, setFiltered]           = useState([]);
  const [dateRange, setDateRange]         = useState([null, null]);
  const [currentPage, setCurrentPage]     = useState(1);
  const [perPage, setPerPage]             = useState(10);
  const [loading, setLoading]             = useState(true);
  const [filterOpen, setFilterOpen]       = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/admin-subscribe`)
      .then(res => { setSubscriptions(res.data); setFiltered(res.data); setLoading(false); })
      .catch(err => { console.error("Subscription API error:", err); setLoading(false); });
  }, []);

  const exportData = () => {
    const rows = filtered.map((s, i) => ({
      SNo: i + 1,
      Email: s.email,
      SubscribedOn: new Date(s.createdAt).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Subscriptions");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), `Subscription_List_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const applyFilter = () => {
    const [start, end] = dateRange;
    let tmp = [...subscriptions];
    if (start && end) {
      tmp = tmp.filter(s => {
        const d = dayjs(s.createdAt);
        return d.isSameOrAfter(start, "day") && d.isSameOrBefore(end, "day");
      });
    }
    setFiltered(tmp);
    setCurrentPage(1);
    setFilterOpen(false);
  };

  const resetFilter = () => {
    setDateRange([null, null]);
    setFiltered(subscriptions);
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
        <RangePicker
          value={dateRange} onChange={vals => setDateRange(vals)}
          format="DD MMM YYYY" placeholder={["Start date", "End date"]}
          style={{ width: "100%", borderRadius: 8, height: 40 }} allowClear
        />
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Button icon={<FilterOutlined />} onClick={applyFilter}
          style={{ flex: 1, backgroundColor: "#00B5F9", borderColor: "#00B5F9", color: "#fff", borderRadius: 8, height: 40, fontWeight: 600 }}>
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
      <div className="sl-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, gap: 10, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>Subscribed Emails</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
            {total} {total === 1 ? "subscriber" : "subscribers"} found
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Button className="sl-filter-btn-mobile" icon={<FilterOutlined />} onClick={() => setFilterOpen(true)}
            style={{ borderRadius: 8, height: 38, borderColor: "#00B5F9", color: "#00B5F9" }}>
            Filters
          </Button>
          <Button className="sl-export-btn" icon={<ExportOutlined />} onClick={exportData}
            style={{ backgroundColor: "#00B5F9", borderColor: "#00B5F9", color: "#fff", borderRadius: 8, height: 38, fontWeight: 600, paddingInline: 16 }}>
            <span className="full-label">Export to Excel</span>
            <span className="short-label">Export</span>
          </Button>
        </div>
      </div>

      {/* ── Desktop Filter Bar ── */}
      <div className="sl-filter-inline" style={{ background: "#fff", borderRadius: 12, padding: "18px 24px", marginBottom: 24, flexWrap: "wrap", alignItems: "flex-end", gap: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
        <div style={{ flex: "1 1 260px" }}>
          <label style={labelStyle}>Date Range</label>
          <RangePicker
            value={dateRange} onChange={vals => setDateRange(vals)}
            format="DD MMM YYYY" placeholder={["Start date", "End date"]}
            style={{ width: "100%", borderRadius: 8, height: 40 }} allowClear
          />
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
      <div className="sl-table-wrap" style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflow: "hidden", marginBottom: 20 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ backgroundColor: "#00B5F9" }}>
                {["#", "Email", "Subscribed On"].map(h => (
                  <th key={h} style={{ padding: "13px 20px", color: "#fff", fontWeight: 600, textAlign: "left", whiteSpace: "nowrap", fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3} style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>Loading...</td></tr>
              ) : pageSlice.length === 0 ? (
                <tr><td colSpan={3} style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>No subscriptions found.</td></tr>
              ) : pageSlice.map((s, i) => (
                <tr key={s._id} style={{ backgroundColor: i % 2 === 0 ? "#f8fafc" : "#fff", borderBottom: "1px solid #e2e8f0" }}>
                  <td style={tdStyle}>{startIdx + i + 1}</td>
                  <td style={{ ...tdStyle, fontWeight: 500, color: "#0f172a" }}>{s.email}</td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                    {dayjs(s.createdAt).format("DD MMM YYYY")}
                    <br />
                    <span style={{ color: "#94a3b8", fontSize: 12 }}>{dayjs(s.createdAt).format("h:mm A")}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="sl-cards-wrap" style={{ flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>Loading...</div>
        ) : pageSlice.length === 0 ? (
          <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>No subscriptions found.</div>
        ) : pageSlice.map((s, i) => (
          <div key={s._id} style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#0f172a", wordBreak: "break-all" }}>{s.email}</p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8" }}>
                {dayjs(s.createdAt).format("DD MMM YYYY, h:mm A")}
              </p>
            </div>
            <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", backgroundColor: "#e0f7ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#00B5F9" }}>
              {startIdx + i + 1}
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

    </div>
  );
}

const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" };
const tdStyle    = { padding: "12px 20px", color: "#334155", fontSize: 13 };