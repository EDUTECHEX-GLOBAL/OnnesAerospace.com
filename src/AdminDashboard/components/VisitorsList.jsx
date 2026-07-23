// src/AdminDashboard/components/VisitorsList.jsx

import React, { useEffect, useState } from 'react';
import api from '../../api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DatePicker, Select, Button, Drawer } from 'antd';
import {
  DoubleLeftOutlined, LeftOutlined, RightOutlined, DoubleRightOutlined,
  ExportOutlined, FilterOutlined, ReloadOutlined,
} from '@ant-design/icons';
import 'antd/dist/reset.css';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { RangePicker } = DatePicker;
const { Option } = Select;

// inject responsive CSS once
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  .vl-table-wrap { display: block; }
  .vl-cards-wrap { display: none; }
  .vl-filter-inline { display: flex; }
  .vl-filter-btn-mobile { display: none !important; }
  .vl-header h1 { font-size: 24px; }
  @media (max-width: 767px) {
    .vl-table-wrap { display: none !important; }
    .vl-cards-wrap { display: flex !important; }
    .vl-filter-inline { display: none !important; }
    .vl-filter-btn-mobile { display: inline-flex !important; }
    .vl-header h1 { font-size: 18px !important; }
    .vl-export-btn span.full-label { display: none; }
    .vl-export-btn span.short-label { display: inline; }
  }
  @media (min-width: 768px) {
    .vl-export-btn span.short-label { display: none; }
  }
`;
if (!document.head.querySelector("#vl-styles")) {
  styleTag.id = "vl-styles";
  document.head.appendChild(styleTag);
}

export default function VisitorsList() {
  const [visitors, setVisitors]       = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [dateRange, setDateRange]     = useState([null, null]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage]         = useState(10);
  const [loading, setLoading]         = useState(true);
  const [filterOpen, setFilterOpen]   = useState(false);

  useEffect(() => {
    api.get('/api/admin-visitors?limit=500')
      .then(res => { setVisitors(res.data); setFiltered(res.data); setLoading(false); })
      .catch(err => { console.error("Visitors API error:", err); setLoading(false); });
  }, []);

  const exportData = () => {
    const rows = filtered.map((v, i) => ({
      SNo: i + 1,
      IP: v.ip,
      City: v.city,
      Region: v.region,
      PostalCode: v.postalCode,
      Country: v.country,
      CreatedOn: new Date(v.createdAt).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Visitors');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf]), `Visitors_List_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const applyFilter = () => {
    const [start, end] = dateRange;
    let tmp = [...visitors];
    if (start && end) {
      tmp = tmp.filter(v => {
        const d = dayjs(v.createdAt);
        return d.isSameOrAfter(start, 'day') && d.isSameOrBefore(end, 'day');
      });
    }
    setFiltered(tmp);
    setCurrentPage(1);
    setFilterOpen(false);
  };

  const resetFilter = () => {
    setDateRange([null, null]);
    setFiltered(visitors);
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
          format="DD MMM YYYY" placeholder={['Start date', 'End date']}
          style={{ width: '100%', borderRadius: 8, height: 40 }} allowClear
        />
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
      <div className="vl-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, gap: 10, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>Visitors List</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
            {total} {total === 1 ? "visitor" : "visitors"} found
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Button className="vl-filter-btn-mobile" icon={<FilterOutlined />} onClick={() => setFilterOpen(true)}
            style={{ borderRadius: 8, height: 38, borderColor: "#00B5F9", color: "#00B5F9" }}>
            Filters
          </Button>
          <Button className="vl-export-btn" icon={<ExportOutlined />} onClick={exportData}
            style={{ backgroundColor: "#00B5F9", borderColor: "#00B5F9", color: "#fff", borderRadius: 8, height: 38, fontWeight: 600, paddingInline: 16 }}>
            <span className="full-label">Export to Excel</span>
            <span className="short-label">Export</span>
          </Button>
        </div>
      </div>

      {/* ── Desktop Filter Bar ── */}
      <div className="vl-filter-inline" style={{ background: "#fff", borderRadius: 12, padding: "18px 24px", marginBottom: 24, flexWrap: "wrap", alignItems: "flex-end", gap: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
        <div style={{ flex: "1 1 260px" }}>
          <label style={labelStyle}>Date Range</label>
          <RangePicker
            value={dateRange} onChange={vals => setDateRange(vals)}
            format="DD MMM YYYY" placeholder={['Start date', 'End date']}
            style={{ width: '100%', borderRadius: 8, height: 40 }} allowClear
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
      <div className="vl-table-wrap" style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflow: "hidden", marginBottom: 20 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ backgroundColor: "#00B5F9" }}>
                {["#", "IP Address", "City", "Region", "Postal Code", "Country", "Visited On"].map(h => (
                  <th key={h} style={{ padding: "13px 16px", color: "#fff", fontWeight: 600, textAlign: "left", whiteSpace: "nowrap", fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>Loading...</td></tr>
              ) : pageSlice.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>No visitors found.</td></tr>
              ) : pageSlice.map((v, i) => (
                <tr key={v._id} style={{ backgroundColor: i % 2 === 0 ? "#f8fafc" : "#fff", borderBottom: "1px solid #e2e8f0" }}>
                  <td style={tdStyle}>{startIdx + i + 1}</td>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontWeight: 500, color: "#0f172a", whiteSpace: "nowrap" }}>{v.ip}</td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{v.city || <span style={{ color: "#cbd5e1" }}>—</span>}</td>
                  <td style={tdStyle}>{v.region || <span style={{ color: "#cbd5e1" }}>—</span>}</td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{v.postalCode || <span style={{ color: "#cbd5e1" }}>—</span>}</td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{v.country || <span style={{ color: "#cbd5e1" }}>—</span>}</td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap", fontSize: 12 }}>
                    {dayjs(v.createdAt).format("DD MMM YYYY")}
                    <br />
                    <span style={{ color: "#94a3b8" }}>{dayjs(v.createdAt).format("h:mm:ss A")}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="vl-cards-wrap" style={{ flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>Loading...</div>
        ) : pageSlice.length === 0 ? (
          <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>No visitors found.</div>
        ) : pageSlice.map((v, i) => (
          <div key={v._id} style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>

            {/* IP + index badge */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#0f172a", fontFamily: "monospace" }}>{v.ip}</p>
              <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", backgroundColor: "#e0f7ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#00B5F9" }}>
                {startIdx + i + 1}
              </div>
            </div>

            {/* Location grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", fontSize: 12, marginBottom: 10 }}>
              {v.city && (
                <div><span style={mobileLabel}>City</span><span style={mobileVal}>{v.city}</span></div>
              )}
              {v.region && (
                <div><span style={mobileLabel}>Region</span><span style={mobileVal}>{v.region}</span></div>
              )}
              {v.postalCode && (
                <div><span style={mobileLabel}>Postal Code</span><span style={mobileVal}>{v.postalCode}</span></div>
              )}
              {v.country && (
                <div><span style={mobileLabel}>Country</span><span style={mobileVal}>{v.country}</span></div>
              )}
            </div>

            {/* Date */}
            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 8 }}>
              <span style={mobileLabel}>Visited On</span>
              <span style={mobileVal}>{dayjs(v.createdAt).format("DD MMM YYYY, h:mm:ss A")}</span>
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

const labelStyle  = { display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" };
const tdStyle     = { padding: "12px 16px", color: "#334155", fontSize: 13 };
const mobileLabel = { fontSize: 11, color: "#94a3b8", fontWeight: 500, display: "block" };
const mobileVal   = { display: "block", color: "#0f172a", fontWeight: 500, marginTop: 2 };