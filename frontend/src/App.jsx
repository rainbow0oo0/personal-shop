import { useEffect, useMemo, useState } from "react";

export default function App() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const [mode, setMode] = useState("create"); // create | edit
    const [editingId, setEditingId] = useState(null);

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);

    const isEdit = mode === "edit";
    const canSubmit = useMemo(() => name.trim().length > 0 && price >= 0 && stock >= 0, [name, price, stock]);

    async function api(path, options = {}) {
        const res = await fetch(path, {
            headers: { "Content-Type": "application/json" },
            ...options,
        });

        if (!res.ok) {
            // Spring이 에러를 text/json 어느쪽으로 내릴지 몰라서 둘 다 대응
            const text = await res.text().catch(() => "");
            throw new Error(`${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`);
        }
        if (res.status === 204) return null;
        return res.json();
    }

    async function load() {
        setLoading(true);
        setMsg("");
        try {
            const list = await api("/api/products");
            setProducts(Array.isArray(list) ? list : []);
        } catch (e) {
            setMsg(String(e.message ?? e));
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setMode("create");
        setEditingId(null);
        setName("");
        setPrice(0);
        setStock(0);
    }

    function startEdit(p) {
        setMode("edit");
        setEditingId(p.id);
        setName(p.name);
        setPrice(p.price);
        setStock(p.stock);
        setMsg("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function onSubmit(e) {
        e.preventDefault();
        if (!canSubmit) return;

        setMsg("");
        try {
            const body = { name: name.trim(), price: Number(price), stock: Number(stock) };

            if (!isEdit) {
                await api("/api/products", { method: "POST", body: JSON.stringify(body) });
                setMsg("✅ 등록 완료");
            } else {
                await api(`/api/products/${editingId}`, { method: "PUT", body: JSON.stringify(body) });
                setMsg("✅ 수정 완료");
            }

            resetForm();
            await load();
        } catch (e2) {
            setMsg(`❌ ${String(e2.message ?? e2)}`);
        }
    }

    async function onDelete(id) {
        if (!confirm(`상품 ${id} 삭제할까요?`)) return;

        setMsg("");
        try {
            await api(`/api/products/${id}`, { method: "DELETE" });
            setMsg("🗑️ 삭제 완료");
            await load();
            if (editingId === id) resetForm();
        } catch (e) {
            setMsg(`❌ ${String(e.message ?? e)}`);
        }
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div>
                    <h1 style={styles.h1}>Personal Shop</h1>
                    <p style={styles.sub}>상품 등록/수정/삭제 · React(Vite) + Spring API</p>
                </div>
                <button style={styles.refreshBtn} onClick={load} disabled={loading}>
                    {loading ? "Loading..." : "Refresh"}
                </button>
            </header>

            <section style={styles.grid}>
                <div style={styles.card}>
                    <div style={styles.cardTitleRow}>
                        <h2 style={styles.h2}>{isEdit ? "상품 수정" : "상품 등록"}</h2>
                        {isEdit && (
                            <span style={styles.badge}>ID: {editingId}</span>
                        )}
                    </div>

                    <form onSubmit={onSubmit} style={styles.form}>
                        <label style={styles.label}>
                            상품명
                            <input
                                style={styles.input}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="예: 후드티"
                            />
                        </label>

                        <div style={styles.row3}>
                            <label style={styles.label}>
                                가격
                                <input
                                    style={styles.input}
                                    type="number"
                                    min="0"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </label>

                            <label style={styles.label}>
                                재고
                                <input
                                    style={styles.input}
                                    type="number"
                                    min="0"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                />
                            </label>
                        </div>

                        <div style={styles.actions}>
                            <button style={{ ...styles.primaryBtn, opacity: canSubmit ? 1 : 0.6 }} disabled={!canSubmit}>
                                {isEdit ? "수정하기" : "등록하기"}
                            </button>
                            <button
                                type="button"
                                style={styles.ghostBtn}
                                onClick={resetForm}
                                disabled={!isEdit && name === "" && Number(price) === 0 && Number(stock) === 0}
                            >
                                초기화
                            </button>
                        </div>

                        {msg && <div style={styles.msg}>{msg}</div>}
                    </form>

                    <div style={styles.tip}>
                        <b>팁</b> · 목록에서 “수정”을 누르면 폼이 채워지고, “삭제”로 지울 수 있어.
                    </div>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.h2}>상품 목록</h2>

                    <div style={styles.tableWrap}>
                        <table style={styles.table}>
                            <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>상품명</th>
                                <th style={styles.th}>가격</th>
                                <th style={styles.th}>재고</th>
                                <th style={styles.thRight}>액션</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td style={styles.td} colSpan={5}>
                                        {loading ? "불러오는 중..." : "상품이 없습니다. 왼쪽에서 하나 등록해봐."}
                                    </td>
                                </tr>
                            ) : (
                                products.map((p) => (
                                    <tr key={p.id}>
                                        <td style={styles.tdMono}>{p.id}</td>
                                        <td style={styles.td}>{p.name}</td>
                                        <td style={styles.td}>{p.price.toLocaleString()}</td>
                                        <td style={styles.td}>{p.stock}</td>
                                        <td style={styles.tdRight}>
                                            <button style={styles.smallBtn} onClick={() => startEdit(p)}>수정</button>
                                            <button style={styles.smallDangerBtn} onClick={() => onDelete(p.id)}>삭제</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>

                    <div style={styles.footerNote}>
                        총 <b>{products.length}</b>개
                    </div>
                </div>
            </section>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#0b1020",
        color: "#e9eefc",
        padding: 24,
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    },
    header: {
        maxWidth: 1100,
        margin: "0 auto 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    h1: { margin: 0, fontSize: 28 },
    sub: { margin: "6px 0 0", opacity: 0.8 },
    refreshBtn: {
        border: "1px solid rgba(255,255,255,0.2)",
        background: "rgba(255,255,255,0.06)",
        color: "#e9eefc",
        padding: "10px 12px",
        borderRadius: 12,
        cursor: "pointer",
    },
    grid: {
        maxWidth: 1100,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1.2fr",
        gap: 16,
    },
    card: {
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
    },
    cardTitleRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
    h2: { margin: 0, fontSize: 18 },
    badge: {
        fontSize: 12,
        padding: "4px 8px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.16)",
    },
    form: { marginTop: 12, display: "flex", flexDirection: "column", gap: 12 },
    label: { display: "flex", flexDirection: "column", gap: 6, fontSize: 13, opacity: 0.95 },
    input: {
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(10,14,28,0.6)",
        color: "#e9eefc",
        outline: "none",
    },
    row3: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    actions: { display: "flex", gap: 10, marginTop: 4 },
    primaryBtn: {
        flex: 1,
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid rgba(0,0,0,0)",
        background: "#e9eefc",
        color: "#0b1020",
        fontWeight: 700,
        cursor: "pointer",
    },
    ghostBtn: {
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.16)",
        background: "transparent",
        color: "#e9eefc",
        cursor: "pointer",
    },
    msg: {
        marginTop: 6,
        padding: "10px 12px",
        borderRadius: 12,
        background: "rgba(0,0,0,0.25)",
        border: "1px solid rgba(255,255,255,0.12)",
        fontSize: 13,
        whiteSpace: "pre-wrap",
    },
    tip: {
        marginTop: 12,
        padding: 12,
        borderRadius: 12,
        background: "rgba(255,255,255,0.05)",
        border: "1px dashed rgba(255,255,255,0.18)",
        fontSize: 13,
        opacity: 0.9,
    },
    tableWrap: { marginTop: 12, overflow: "auto", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)" },
    table: { width: "100%", borderCollapse: "collapse", minWidth: 520 },
    th: { textAlign: "left", fontSize: 12, padding: "10px 10px", opacity: 0.75, background: "rgba(0,0,0,0.22)" },
    thRight: { textAlign: "right", fontSize: 12, padding: "10px 10px", opacity: 0.75, background: "rgba(0,0,0,0.22)" },
    td: { padding: "10px 10px", borderTop: "1px solid rgba(255,255,255,0.10)", fontSize: 13 },
    tdMono: { padding: "10px 10px", borderTop: "1px solid rgba(255,255,255,0.10)", fontSize: 13, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" },
    tdRight: { padding: "10px 10px", borderTop: "1px solid rgba(255,255,255,0.10)", textAlign: "right", whiteSpace: "nowrap" },
    smallBtn: {
        padding: "8px 10px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.16)",
        background: "rgba(255,255,255,0.08)",
        color: "#e9eefc",
        cursor: "pointer",
        marginRight: 8,
    },
    smallDangerBtn: {
        padding: "8px 10px",
        borderRadius: 10,
        border: "1px solid rgba(255,120,120,0.35)",
        background: "rgba(255,120,120,0.16)",
        color: "#ffd7d7",
        cursor: "pointer",
    },
    footerNote: { marginTop: 10, fontSize: 13, opacity: 0.85 },
};