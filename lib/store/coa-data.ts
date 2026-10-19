/** Static certificate library entries for the COA / batch docs page design. */

export type CoaCertificate = {
  id: string;
  productName: string;
  strength: string;
  batch: string;
  lot: string;
  tested: string;
  /** ISO date for sorting */
  testedIso: string;
  imageSrc: string;
  verified: boolean;
};

export const COA_CERTIFICATES: CoaCertificate[] = [
  {
    id: "bpc-157-5mg",
    productName: "BPC-157",
    strength: "5 MG",
    batch: "BPC5-0824",
    lot: "L2408-A12",
    tested: "Aug 12, 2024",
    testedIso: "2024-08-12",
    imageSrc: "/products/images/1.jpg",
    verified: true,
  },
  {
    id: "tb-500-5mg",
    productName: "TB-500",
    strength: "5 MG",
    batch: "TB5-0914",
    lot: "L2409-B07",
    tested: "Sep 14, 2024",
    testedIso: "2024-09-14",
    imageSrc: "/products/images/2.jpg",
    verified: true,
  },
  {
    id: "semaglutide-5mg",
    productName: "Semaglutide",
    strength: "5 MG",
    batch: "SEM5-1018",
    lot: "L2410-C03",
    tested: "Oct 18, 2024",
    testedIso: "2024-10-18",
    imageSrc: "/products/images/3.jpg",
    verified: true,
  },
  {
    id: "tirzepatide-10mg",
    productName: "Tirzepatide",
    strength: "10 MG",
    batch: "TIR10-1102",
    lot: "L2411-D21",
    tested: "Nov 02, 2024",
    testedIso: "2024-11-02",
    imageSrc: "/products/images/4.jpg",
    verified: true,
  },
  {
    id: "retatrutide-10mg",
    productName: "Retatrutide",
    strength: "10 MG",
    batch: "RET10-1128",
    lot: "L2411-E09",
    tested: "Nov 28, 2024",
    testedIso: "2024-11-28",
    imageSrc: "/products/images/5.jpg",
    verified: true,
  },
  {
    id: "ipamorelin-5mg",
    productName: "Ipamorelin",
    strength: "5 MG",
    batch: "IPA5-1205",
    lot: "L2412-F14",
    tested: "Dec 05, 2024",
    testedIso: "2024-12-05",
    imageSrc: "/products/images/6.jpg",
    verified: true,
  },
  {
    id: "cjc-1295-2mg",
    productName: "CJC-1295",
    strength: "2 MG",
    batch: "CJC2-0112",
    lot: "L2501-G02",
    tested: "Jan 12, 2025",
    testedIso: "2025-01-12",
    imageSrc: "/products/images/7.jpg",
    verified: true,
  },
  {
    id: "melanotan-ii-10mg",
    productName: "Melanotan II",
    strength: "10 MG",
    batch: "MT2-0208",
    lot: "L2502-H18",
    tested: "Feb 08, 2025",
    testedIso: "2025-02-08",
    imageSrc: "/products/images/8.jpg",
    verified: true,
  },
  {
    id: "ghk-cu-50mg",
    productName: "GHK-Cu",
    strength: "50 MG",
    batch: "GHK50-0315",
    lot: "L2503-J05",
    tested: "Mar 15, 2025",
    testedIso: "2025-03-15",
    imageSrc: "/products/images/9.jpg",
    verified: true,
  },
  {
    id: "aod-9604-5mg",
    productName: "AOD-9604",
    strength: "5 MG",
    batch: "AOD5-0402",
    lot: "L2504-K11",
    tested: "Apr 02, 2025",
    testedIso: "2025-04-02",
    imageSrc: "/products/images/10.jpg",
    verified: true,
  },
  {
    id: "nad-plus-100mg",
    productName: "NAD+",
    strength: "100 MG",
    batch: "NAD100-0422",
    lot: "L2504-M27",
    tested: "Apr 22, 2025",
    testedIso: "2025-04-22",
    imageSrc: "/products/images/11.jpg",
    verified: true,
  },
  {
    id: "bac-water-10ml",
    productName: "Bacteriostatic Water",
    strength: "10 ML",
    batch: "BAC10-0506",
    lot: "L2505-N04",
    tested: "May 06, 2025",
    testedIso: "2025-05-06",
    imageSrc: "/products/images/12.jpg",
    verified: true,
  },
];

export const COA_FEATURES = [
  {
    title: "Verified Reports",
    description: "All COAs are third-party tested and independently verified.",
    icon: "shield" as const,
  },
  {
    title: "Easy Search",
    description: "Find reports quickly by product name, strength, lot, or batch number.",
    icon: "search" as const,
  },
  {
    title: "Research Transparency",
    description: "We believe in full transparency to support your research needs.",
    icon: "docs" as const,
  },
] as const;

export const COA_PROCESS_STEPS = [
  {
    step: 1,
    title: "Product Testing",
    description: "Independent lab analysis for identity, purity, and potency.",
    icon: "testing" as const,
  },
  {
    step: 2,
    title: "Report Verification",
    description: "Results are reviewed and verified for accuracy.",
    icon: "verify" as const,
  },
  {
    step: 3,
    title: "COA Published",
    description: "Certificates made available in our searchable library.",
    icon: "publish" as const,
  },
] as const;
