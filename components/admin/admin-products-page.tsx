"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  rating: number;
};

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  imageUrl: "",
  rating: "5",
};

function formatApiError(data: unknown): string {
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (typeof o.message === "string") return o.message;
    if (Array.isArray(o.message)) return o.message.join(", ");
    if (Array.isArray(o.errors)) return o.errors.map(String).join(", ");
  }
  return "Request failed";
}

export function AdminProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q")?.trim().toLowerCase() ?? "";

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/products", { cache: "no-store" });
      if (res.status === 401) {
        setErr("Session expired — sign in again.");
        setProducts([]);
        return;
      }
      if (!res.ok) {
        setErr("Could not load products.");
        setProducts([]);
        return;
      }
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setErr("Network error — check API_URL / backend.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!qParam) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(qParam) ||
        p.slug.toLowerCase().includes(qParam) ||
        p.id.toLowerCase().includes(qParam)
    );
  }, [products, qParam]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormErr(null);
    setModalOpen(true);
  }

  function openEdit(p: AdminProduct) {
    setEditing(p);
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description ?? "",
      price: String(p.price),
      imageUrl: p.imageUrl ?? "",
      rating: String(p.rating),
    });
    setFormErr(null);
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setEditing(null);
    setForm(emptyForm);
    setFormErr(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErr(null);
    const price = Number(form.price);
    const rating = Number(form.rating);
    if (!form.name.trim()) {
      setFormErr("Name is required.");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setFormErr("Enter a valid price.");
      return;
    }
    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      setFormErr("Rating must be between 0 and 5.");
      return;
    }

    const createBody = {
      name: form.name.trim(),
      ...(form.slug.trim() ? { slug: form.slug.trim() } : {}),
      ...(form.description.trim() ? { description: form.description.trim() } : {}),
      price,
      ...(form.imageUrl.trim() ? { imageUrl: form.imageUrl.trim() } : {}),
      rating,
    };

    const patchBody = {
      name: form.name.trim(),
      ...(form.slug.trim() ? { slug: form.slug.trim() } : {}),
      description: form.description.trim(),
      price,
      imageUrl: form.imageUrl.trim(),
      rating,
    };

    setSaving(true);
    try {
      if (editing) {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (editing.slug) headers["x-previous-product-slug"] = editing.slug;
        const res = await fetch(`/api/admin/products/${encodeURIComponent(editing.id)}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify(patchBody),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setFormErr(formatApiError(data));
          return;
        }
      } else {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createBody),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setFormErr(formatApiError(data));
          return;
        }
      }
      closeModal();
      await load();
      router.refresh();
    } catch {
      setFormErr("Network error.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(p: AdminProduct) {
    if (!window.confirm(`Delete “${p.name}”? This cannot be undone if the product has no orders or wishlist links.`)) {
      return;
    }
    setErr(null);
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(p.id)}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(formatApiError(data));
        return;
      }
      await load();
      router.refresh();
    } catch {
      setErr("Delete failed — network error.");
    }
  }

  return (
    <>
      <div className="row align-items-start g-2 mb-4">
        <div className="col-12 col-lg">
          <p className="text-secondary small mb-1">
            Create, edit, or remove catalog items. Changes appear on the storefront after save. Storefront:{" "}
            <Link href="/products-catalog" className="fw-semibold text-dark" target="_blank" rel="noreferrer">
              catalog
            </Link>
            {" · "}
            <Link href="/popular-peptides" className="fw-semibold text-dark" target="_blank" rel="noreferrer">
              popular peptides
            </Link>
          </p>
          {qParam ? (
            <p className="text-secondary small mb-0">
              Filtered by search: <span className="fw-semibold text-dark">&quot;{qParam}&quot;</span>
            </p>
          ) : null}
        </div>
        <div className="col-12 col-lg-auto d-flex flex-wrap gap-2 justify-content-lg-end">
          <button type="button" className="btn btn-primary btn-sm px-3" onClick={openCreate}>
            <i className="bi bi-plus-lg me-1" aria-hidden />
            Add product
          </button>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => void load()}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden />
            Refresh
          </button>
        </div>
      </div>

      {err ? (
        <div className="alert alert-danger border-0 admin-card-elevated rounded-3 mb-4" role="alert">
          {err}
        </div>
      ) : null}

      <div className="card border-0 admin-card-elevated rounded-3 overflow-hidden bg-white">
        {loading ? (
          <div className="p-5 text-center text-secondary small">Loading products…</div>
        ) : filtered.length === 0 ? (
          <div className="p-5 text-center text-secondary small">No products match this view.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-admin mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Product</th>
                  <th>Slug</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th className="pe-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="ps-4 fw-medium text-dark">{p.name}</td>
                    <td>
                      <span className="font-monospace small text-secondary">{p.slug}</span>
                    </td>
                    <td className="fw-semibold">${Number(p.price).toFixed(2)}</td>
                    <td className="text-secondary small">{Number(p.rating).toFixed(1)}</td>
                    <td className="pe-4 text-end">
                      <div className="d-inline-flex flex-wrap gap-1 justify-content-end">
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => openEdit(p)}>
                          Edit
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => void onDelete(p)}>
                          Delete
                        </button>
                        <Link
                          href={`/products-catalog/${p.slug}`}
                          className="btn btn-sm btn-outline-primary"
                          target="_blank"
                          rel="noreferrer"
                        >
                          View live
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen ? (
        <div className="modal show d-block" tabIndex={-1} role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title h5 mb-0">{editing ? "Edit product" : "Add product"}</h2>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} disabled={saving} />
              </div>
              <form onSubmit={(e) => void onSubmit(e)}>
                <div className="modal-body">
                  {formErr ? (
                    <div className="alert alert-danger py-2 small" role="alert">
                      {formErr}
                    </div>
                  ) : null}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold" htmlFor="ap-name">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      id="ap-name"
                      className="form-control"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      required
                      maxLength={200}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold" htmlFor="ap-slug">
                      Slug
                    </label>
                    <input
                      id="ap-slug"
                      className="form-control font-monospace"
                      value={form.slug}
                      onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                      placeholder="Leave blank to auto-generate from name"
                      maxLength={120}
                    />
                    <p className="form-text small mb-0">URL segment: /products-catalog/your-slug</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold" htmlFor="ap-desc">
                      Description
                    </label>
                    <textarea
                      id="ap-desc"
                      className="form-control"
                      rows={4}
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      maxLength={8000}
                    />
                  </div>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold" htmlFor="ap-price">
                        Price (USD) <span className="text-danger">*</span>
                      </label>
                      <input
                        id="ap-price"
                        type="number"
                        className="form-control"
                        min={0}
                        step="0.01"
                        value={form.price}
                        onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold" htmlFor="ap-rating">
                        Rating (0–5)
                      </label>
                      <input
                        id="ap-rating"
                        type="number"
                        className="form-control"
                        min={0}
                        max={5}
                        step="0.1"
                        value={form.rating}
                        onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label small fw-semibold" htmlFor="ap-img">
                        Image URL
                      </label>
                      <input
                        id="ap-img"
                        className="form-control font-monospace small"
                        value={form.imageUrl}
                        onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                        placeholder="https://… or /path from public"
                        maxLength={2000}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={closeModal} disabled={saving}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving…" : editing ? "Save changes" : "Create product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
      {modalOpen ? <div className="modal-backdrop fade show" aria-hidden onClick={closeModal} /> : null}
    </>
  );
}
