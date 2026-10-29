"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from "@/lib/api/categories";
import type { Category } from "@/lib/store/types";
import { notify } from "@/lib/notifications/notify";

type CategoryForm = {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
};

const emptyForm: CategoryForm = {
  name: "",
  slug: "",
  description: "",
  sortOrder: 0,
};

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminCategories();
      setCategories(data);
    } catch (e) {
      notify.error((e as Error).message || "Could not load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormErr(null);
    setModalOpen(true);
  }

  function openEdit(c: Category) {
    setEditing(c);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      sortOrder: c.sortOrder ?? 0,
    });
    setFormErr(null);
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setEditing(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErr(null);
    setSaving(true);
    try {
      if (editing) {
        await updateAdminCategory(editing.id, {
          name: form.name.trim(),
          slug: form.slug.trim() || undefined,
          description: form.description.trim() || undefined,
          sortOrder: Number(form.sortOrder) || 0,
        });
        notify.success("Category updated.");
      } else {
        await createAdminCategory({
          name: form.name.trim(),
          slug: form.slug.trim() || undefined,
          description: form.description.trim() || undefined,
          sortOrder: Number(form.sortOrder) || 0,
        });
        notify.success("Category created.");
      }
      closeModal();
      void load();
    } catch (err) {
      setFormErr((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(c: Category) {
    if (!confirm(`Delete category "${c.name}"? Products linked to this category will become Uncategorized.`)) {
      return;
    }
    try {
      await deleteAdminCategory(c.id);
      notify.success("Category deleted.");
      void load();
    } catch (err) {
      notify.error((err as Error).message || "Delete failed.");
    }
  }

  return (
    <div className="container-fluid px-0">
      <div className="row g-3 align-items-center justify-content-between mb-4">
        <div className="col-12 col-lg">
          <h1 className="h4 fw-bold text-dark mb-1">Categories</h1>
          <p className="text-secondary small mb-0">
            Organize products into database categories for catalog filtering and navigation.
          </p>
        </div>
        <div className="col-12 col-lg-auto d-flex flex-wrap gap-2 justify-content-lg-end">
          <button type="button" className="btn btn-primary btn-sm px-3" onClick={openCreate}>
            <i className="bi bi-plus-lg me-1" aria-hidden />
            Add category
          </button>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => void load()}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden />
            Refresh
          </button>
        </div>
      </div>

      <div className="card border-0 admin-card-elevated rounded-3 overflow-hidden bg-white">
        {loading ? (
          <div className="p-5 text-center text-secondary small">Loading categories…</div>
        ) : categories.length === 0 ? (
          <div className="p-5 text-center text-secondary small">
            No categories defined yet. Click &quot;Add category&quot; to create your first one.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-admin mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Sort</th>
                  <th>Category Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th className="text-center">Products</th>
                  <th className="pe-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td className="ps-4 text-secondary small">{c.sortOrder ?? 0}</td>
                    <td className="fw-medium text-dark">{c.name}</td>
                    <td>
                      <code className="text-secondary small">{c.slug}</code>
                    </td>
                    <td className="text-secondary small text-truncate" style={{ maxWidth: 260 }}>
                      {c.description || "—"}
                    </td>
                    <td className="text-center">
                      <span className="badge bg-light text-dark border">
                        {c.productCount ?? 0}
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => openEdit(c)}
                        >
                          <i className="bi bi-pencil me-1" aria-hidden />
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => void onDelete(c)}
                        >
                          <i className="bi bi-trash" aria-hidden />
                        </button>
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
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header border-bottom px-4 py-3">
                <h5 className="modal-title fw-bold">
                  {editing ? "Edit category" : "Add category"}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal} disabled={saving} />
              </div>
              <form onSubmit={(e) => void onSubmit(e)}>
                <div className="modal-body px-4 py-3">
                  {formErr ? <div className="alert alert-danger py-2 small">{formErr}</div> : null}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold" htmlFor="cat-name">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      id="cat-name"
                      className="form-control"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      maxLength={100}
                      disabled={saving}
                      placeholder="e.g. GLPs, Cellular Research"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold" htmlFor="cat-slug">
                      Slug
                    </label>
                    <input
                      id="cat-slug"
                      className="form-control font-monospace"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="Leave blank to auto-generate from name"
                      maxLength={120}
                      disabled={saving}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold" htmlFor="cat-sort">
                      Sort Order
                    </label>
                    <input
                      id="cat-sort"
                      type="number"
                      className="form-control"
                      value={form.sortOrder}
                      onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })}
                      disabled={saving}
                    />
                    <div className="form-text small">Lower numbers appear first in the catalog navigation.</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold" htmlFor="cat-desc">
                      Description
                    </label>
                    <textarea
                      id="cat-desc"
                      className="form-control"
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      maxLength={1000}
                      disabled={saving}
                      placeholder="Optional brief description of this category…"
                    />
                  </div>
                </div>
                <div className="modal-footer border-top px-4 py-2">
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={closeModal} disabled={saving}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm px-3" disabled={saving}>
                    {saving ? "Saving…" : editing ? "Save changes" : "Create category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
