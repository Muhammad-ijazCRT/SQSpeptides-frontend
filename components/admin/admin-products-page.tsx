"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

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

function displayImageUrl(url: string): string {
  const s = url.trim();
  if (s.startsWith("/images/")) return `/products/images/${s.slice("/images/".length)}`;
  return s;
}

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageInputKey, setImageInputKey] = useState(0);
  const [portalReady, setPortalReady] = useState(false);
  const previewObjectUrlRef = useRef<string | null>(null);

  function clearImagePreview() {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }
    setImagePreview(null);
  }

  function resetImageState(existingUrl?: string) {
    setImageFile(null);
    setImageInputKey((k) => k + 1);
    clearImagePreview();
    if (existingUrl?.trim()) {
      setImagePreview(displayImageUrl(existingUrl));
    }
  }

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
    resetImageState();
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
    resetImageState(p.imageUrl ?? "");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setEditing(null);
    setForm(emptyForm);
    setFormErr(null);
    resetImageState();
  }

  useEffect(() => {
    setPortalReady(true);
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [modalOpen]);

  function removeProductImage() {
    setImageFile(null);
    clearImagePreview();
    setForm((f) => ({ ...f, imageUrl: "" }));
  }

  function onImageFileChange(file: File | null) {
    if (!file) return;
    setImageFile(file);
    clearImagePreview();
    const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!allowed.has(file.type)) {
      setFormErr("Use a JPG, PNG, or WebP image.");
      setImageFile(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormErr("Image must be 5 MB or smaller.");
      setImageFile(null);
      return;
    }
    setFormErr(null);
    const url = URL.createObjectURL(file);
    previewObjectUrlRef.current = url;
    setImagePreview(url);
  }

  async function uploadProductImage(file: File): Promise<string> {
    const up = new FormData();
    up.append("file", file);
    const res = await fetch("/api/admin/products/upload", { method: "POST", body: up });
    const data = (await res.json().catch(() => ({}))) as { message?: string | string[]; url?: string };
    if (!res.ok) {
      throw new Error(formatApiError(data));
    }
    if (!data.url || typeof data.url !== "string") {
      throw new Error("Upload did not return a file URL.");
    }
    return data.url;
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

    setSaving(true);
    try {
      let imageUrl = form.imageUrl.trim();
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile);
      }

      const createBody = {
        name: form.name.trim(),
        ...(form.slug.trim() ? { slug: form.slug.trim() } : {}),
        ...(form.description.trim() ? { description: form.description.trim() } : {}),
        price,
        ...(imageUrl ? { imageUrl } : {}),
        rating,
      };

      const patchBody = {
        name: form.name.trim(),
        ...(form.slug.trim() ? { slug: form.slug.trim() } : {}),
        description: form.description.trim(),
        price,
        imageUrl,
        rating,
      };

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

      {portalReady && modalOpen
        ? createPortal(
            <div
              className="modal show d-block admin-modal-surface admin-product-modal"
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="admin-product-modal-title"
              style={{ backgroundColor: "rgba(15, 23, 42, 0.55)" }}
              onMouseDown={(e) => {
                if (e.target === e.currentTarget && !saving) closeModal();
              }}
            >
              <div className="modal-dialog modal-dialog-centered modal-lg my-3 my-md-4">
                <div className="modal-content rounded-3 border-0 shadow-lg admin-product-modal-content">
                  <div className="modal-header border-0 flex-shrink-0 px-4 pt-4 pb-0">
                    <div>
                      <p className="text-uppercase text-secondary small fw-semibold mb-1">
                        {editing ? "Update catalog item" : "New catalog item"}
                      </p>
                      <h2 id="admin-product-modal-title" className="modal-title h5 fw-bold mb-0">
                        {editing ? "Edit product" : "Add product"}
                      </h2>
                    </div>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={closeModal}
                      disabled={saving}
                    />
                  </div>
                  <form className="admin-product-modal-form" onSubmit={(e) => void onSubmit(e)}>
                    <div className="modal-body overflow-auto flex-grow-1 px-4 pt-3 pb-2">
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
                          disabled={saving}
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
                          disabled={saving}
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
                          disabled={saving}
                        />
                      </div>
                      <div className="row g-3">
                        <div className="col-sm-6">
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
                            disabled={saving}
                          />
                        </div>
                        <div className="col-sm-6">
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
                            disabled={saving}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label small fw-semibold" htmlFor="ap-img">
                            Product image
                          </label>
                          <input
                            key={imageInputKey}
                            id="ap-img"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="form-control"
                            onChange={(e) => onImageFileChange(e.target.files?.[0] ?? null)}
                            disabled={saving}
                          />
                          <p className="form-text small mb-2">
                            {editing
                              ? "JPG, PNG, or WebP — max 5 MB. Pick a new file to replace the image, or save without changing it."
                              : "JPG, PNG, or WebP — max 5 MB. Optional — you can add an image now or later."}
                          </p>
                          {imagePreview ? (
                            <div className="d-flex align-items-center gap-3 rounded-3 border bg-light p-3">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={imagePreview}
                                alt={editing ? "Current product image" : "Selected product image"}
                                className="rounded border bg-white object-fit-cover flex-shrink-0"
                                style={{ width: 88, height: 88 }}
                              />
                              <div className="min-w-0">
                                <p className="small fw-semibold text-dark mb-1">
                                  {imageFile ? "New image selected" : editing ? "Current image" : "Image preview"}
                                </p>
                                <p className="small text-secondary mb-2">
                                  {imageFile?.name ?? (form.imageUrl ? "Saved on this product" : "")}
                                </p>
                                {imageFile || form.imageUrl ? (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    disabled={saving}
                                    onClick={removeProductImage}
                                  >
                                    Remove image
                                  </button>
                                ) : null}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer border-0 flex-shrink-0 px-4 pt-2 pb-4 gap-2">
                      <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={closeModal} disabled={saving}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={saving}>
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" aria-hidden />
                            Saving…
                          </>
                        ) : editing ? (
                          "Save changes"
                        ) : (
                          "Create product"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
