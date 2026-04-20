"use client";

import Link from "next/link";

type Cta = { label: string; href: string };

export function AdminStaticPage({
  title,
  description,
  bullets,
  ctas,
}: {
  title: string;
  description: string;
  bullets: string[];
  ctas?: Cta[];
}) {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <h2 className="visually-hidden">{title}</h2>
        <div className="card border-0 admin-card-elevated rounded-3 bg-white">
          <div className="card-body p-4 p-md-5">
            <p className="text-secondary small lh-lg mb-4">{description}</p>
            <ul className="small text-dark ps-3 mb-0">
              {bullets.map((b) => (
                <li key={b} className="mb-2">
                  {b}
                </li>
              ))}
            </ul>
            {ctas?.length ? (
              <div className="d-flex flex-wrap gap-2 mt-4 pt-2">
                {ctas.map((c) => (
                  <Link key={c.href} href={c.href} className="btn btn-outline-secondary btn-sm">
                    {c.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
