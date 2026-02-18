import { useEffect, useMemo, useState } from "react";
import "./App.css";

type Result = {
  homegrown_name: string;
  snomed_code: string;
  snomed_name: string;
  score: number;
};

// Single-origin routing: browser calls /api/... on the UI domain.
const API_BASE = "";

function useDebounce<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export default function App() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [selected, setSelected] = useState<Result | null>(null);

  const canSearch = useMemo(() => debouncedQuery.trim().length >= 2, [debouncedQuery]);

  useEffect(() => {
    const run = async () => {
      setError(null);

      if (!canSearch) {
        setResults([]);
        setSelected(null);
        return;
      }

      setLoading(true);
      try {
        const url = `${API_BASE}/api/mappings/search?q=${encodeURIComponent(debouncedQuery.trim())}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();
        const r: Result[] = data?.results ?? [];
        setResults(r);
        setSelected(r[0] ?? null);
      } catch (e: any) {
        setError(e?.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [debouncedQuery, canSearch]);

  return (
    <div className="page">
      <header className="header">
        <div>
          <h2>Fabric SNOMED Search</h2>
          <div className="sub">Type a homegrown procedure name to retrieve SNOMED code + standard name</div>
        </div>
      </header>

      <div className="searchBar">
        <input
          className="searchInput"
          type="text"
          placeholder="e.g., COLONOSCOPY, BIOPSY, DENTURE..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="hint">Minimum 2 characters • Search is auto (debounced)</div>
      </div>

      {error && <div className="error">❌ {error}</div>}
      {loading && <div className="loading">Searching…</div>}
      {!loading && canSearch && results.length === 0 && <div className="empty">No matches found.</div>}

      <div className="grid">
        <section className="results">
          <div className="sectionTitle">Results</div>
          <div className="list">
            {results.map((r, idx) => (
              <button
                key={`${r.snomed_code}-${idx}`}
                className={`row ${selected?.snomed_code === r.snomed_code ? "active" : ""}`}
                onClick={() => setSelected(r)}
              >
                <div className="rowTitle">{r.homegrown_name}</div>
                <div className="rowMeta">
                  <span className="pill">SNOMED: {r.snomed_code}</span>
                  <span className="pill score">Score: {r.score.toFixed(2)}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="details">
          <div className="sectionTitle">Details</div>
          {!selected ? (
            <div className="empty">Select a result to view details.</div>
          ) : (
            <div className="card">
              <div className="label">Homegrown name</div>
              <div className="value">{selected.homegrown_name}</div>

              <div className="label">SNOMED code</div>
              <div className="value mono">
                {selected.snomed_code}{" "}
                <button className="copyBtn" onClick={() => navigator.clipboard.writeText(selected.snomed_code)}>
                  Copy
                </button>
              </div>

              <div className="label">SNOMED standard name</div>
              <div className="value">{selected.snomed_name}</div>
            </div>
          )}
        </section>
      </div>

      <footer className="footer">Powered by Azure Container Apps + Fabric Lakehouse SQL endpoint</footer>
    </div>
  );
}