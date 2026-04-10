/**
 * Catalog rows — keep descriptions in sync with repo-root `products.json` (seed source of truth).
 * Images: public/products/images/ — filenames have no spaces.
 */
export type CatalogProductSeed = {
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
};

function productImageUrl(path: string): string {
  const t = path.trim();
  if (t.startsWith("/products/images/")) return t;
  if (t.startsWith("/images/")) return "/products/images/" + t.slice("/images/".length);
  const f = t.replace(/^\//, "");
  return "/products/images/" + (f.split("/").pop() ?? f);
}

export const CATALOG_PRODUCTS: CatalogProductSeed[] = [
  {
    slug: "5-amino-1mq-5mg",
    name: "5-Amino 1MQ 5mg",
    description:
      "5-Amino-1MQ is supplied as a reference compound for non-clinical investigation of nicotinamide N-methyltransferase–related pathways and adipocyte biochemistry in controlled in-vitro models. This 5mg vial is for laboratory research use only—not for human or veterinary use.",
    price: 90,
    imageUrl: productImageUrl("/images/9.jpg"),
    rating: 4.6,
  },
  {
    slug: "bpc-157-10mg",
    name: "BPC-157 10mg",
    description:
      "BPC-157 (10mg) is intended for extended-protocol studies of synthetic pentadecapeptide behavior in cell and tissue models, including angiogenesis-related readouts and gastrointestinal epithelial assays under controlled conditions. For in-vitro and non-clinical laboratory research only.",
    price: 110,
    imageUrl: productImageUrl("/images/8.jpg"),
    rating: 4.8,
  },
  {
    slug: "bpc-157-5mg",
    name: "BPC-157 5mg",
    description:
      "BPC-157 is a synthetic peptide sequence studied in laboratory models of extracellular-matrix interaction and inflammatory signaling pathways. This 5mg vial is for qualified researchers conducting non-clinical, in-vitro or ex-vivo experiments only—not for human or veterinary use.",
    price: 75,
    imageUrl: productImageUrl("/images/5.jpg"),
    rating: 4.7,
  },
  {
    slug: "bpc-157-tb-500-10mg-blend",
    name: "BPC-157 (5mg) + TB-500 (5mg) 10mg Blend",
    description:
      "A defined blend of BPC-157 and TB-500 (5mg each) for comparative peptide-interaction and cytoskeletal-biology studies in controlled laboratory systems. Intended solely for research use to characterize co-incubation effects in non-clinical models.",
    price: 135,
    imageUrl: productImageUrl("/images/6.jpg"),
    rating: 4.8,
  },
  {
    slug: "bpc-157-tb-500-20mg-blend",
    name: "BPC-157 (10mg) + TB-500 (10mg) 20mg Blend",
    description:
      "Higher-mass blend of BPC-157 and TB-500 (10mg each) for extended non-clinical protocols examining peptide synergy in cell-motility and matrix-biology assays. Strictly for laboratory research—not for diagnostic or therapeutic application.",
    price: 180,
    imageUrl: productImageUrl("/images/7.jpg"),
    rating: 4.9,
  },
  {
    slug: "cagrilintide-5mg",
    name: "Cagrilintide 5mg",
    description:
      "Cagrilintide is a long-acting amylin analogue supplied for non-clinical pharmacology studies, including amylin-receptor binding, gastric-emptying kinetics, and enteroendocrine signaling in isolated systems and animal models where lawfully permitted. This 5mg vial is for laboratory research only—not for human or veterinary use.",
    price: 120,
    imageUrl: productImageUrl("/images/21.jpg"),
    rating: 4.8,
  },
  {
    slug: "cjc-ipa-no-dac-10mg",
    name: "CJC-1295 + Ipamorelin (No DAC) 10mg",
    description:
      "Blend of CJC-1295 (No DAC) and Ipamorelin for laboratory investigation of growth-hormone–secretagogue receptor pathways and pulsatile GH release dynamics in approved non-clinical models. The no-DAC variant supports shorter-interval experimental designs. Research use only.",
    price: 130,
    imageUrl: productImageUrl("/images/33.jpg"),
    rating: 4.8,
  },
  {
    slug: "ghk-cu-50mg",
    name: "GHK-Cu 50mg",
    description:
      "GHK-Cu is a copper(II)-complexed tripeptide used in cell-culture and biomaterials research to study extracellular-matrix gene expression, collagen-related biochemistry, and metal-ion coordination in controlled assays—not for cosmetic or clinical endpoints. 50mg; laboratory use only.",
    price: 125,
    imageUrl: productImageUrl("/images/32.jpg"),
    rating: 4.9,
  },
  {
    slug: "glow-70mg",
    name: "GLOW 70mg",
    description:
      "GLOW is a multi-component research blend for oxidative-stress, viability, and biochemical endpoint assays in non-clinical models. Intended for method development and comparative peptide-blend characterization—not for human or veterinary application.",
    price: 115,
    imageUrl: productImageUrl("/images/31.jpg"),
    rating: 4.6,
  },
  {
    slug: "glp-1s-20mg",
    name: "GLP-1S 20mg",
    description:
      "GLP-1S analogue for in-vitro studies of GLP-1 receptor pharmacology, incretin signaling, and glucose-dependent insulin secretion in isolated systems. Sold for non-clinical laboratory research only—no implication of diagnostic or therapeutic use.",
    price: 95,
    imageUrl: productImageUrl("/images/30.jpg"),
    rating: 4.8,
  },
  {
    slug: "glp-r3-10mg",
    name: "GLP-R3 10mg",
    description:
      "GLP-R3 for controlled experiments on GLP-family receptor engagement, second-messenger readouts, and metabolic pathway biochemistry in cell-based models. 10mg format; research use only—not for humans or animals as medicine.",
    price: 90,
    imageUrl: productImageUrl("/images/27.jpg"),
    rating: 4.7,
  },
  {
    slug: "glp-r3-20mg",
    name: "GLP-R3 20mg",
    description:
      "GLP-R3 peptide reference material for non-clinical investigation of receptor–ligand interactions and downstream signaling relevant to incretin biology in approved laboratory systems. 20mg; not for human consumption.",
    price: 100,
    imageUrl: productImageUrl("/images/29.jpg"),
    rating: 4.7,
  },
  {
    slug: "glp-r3-30mg",
    name: "GLP-R3 30mg",
    description:
      "Extended-quantity GLP-R3 for longer non-clinical protocols examining GLP-receptor pharmacology and insulinotropic signaling in experimental models. Strictly for qualified laboratory use—not for human or veterinary use.",
    price: 110,
    imageUrl: productImageUrl("/images/28.jpg"),
    rating: 4.8,
  },
  {
    slug: "glp-t2-20mg",
    name: "GLP-T2 20mg",
    description:
      "GLP-T2 for non-clinical studies of gastrointestinal endocrine signaling, nutrient-sensing pathways, and peptide–receptor interactions in ex-vivo or in-vitro systems where legally permitted. 20mg vial; research only.",
    price: 85,
    imageUrl: productImageUrl("/images/26.jpg"),
    rating: 4.6,
  },
  {
    slug: "glp-t2-30mg",
    name: "GLP-T2 30mg",
    description:
      "GLP-T2 supplied for metabolic and GI-physiology research models focusing on hormone regulation and intestinal peptide biology under controlled laboratory conditions. 30mg; not for human consumption.",
    price: 95,
    imageUrl: productImageUrl("/images/25.jpg"),
    rating: 4.6,
  },
  {
    slug: "glp-t2-40mg",
    name: "GLP-T2 40mg",
    description:
      "GLP-T2 (40mg) for extended non-clinical protocols characterizing enteroendocrine signaling and related biochemical endpoints. Intended solely for in-vitro and lawful non-clinical research—not for therapeutic or diagnostic claims.",
    price: 105,
    imageUrl: productImageUrl("/images/24.jpg"),
    rating: 4.7,
  },
  {
    slug: "igf-lr3-1mg",
    name: "IGF LR3 1mg",
    description:
      "IGF-1 LR3 is a synthetic IGF-1 analogue with altered IGF-binding protein affinity, used to study IGF-axis signaling, cell proliferation, and protein-synthesis readouts in controlled cell-based assays—not for performance or clinical use. Research only.",
    price: 95,
    imageUrl: productImageUrl("/images/23.jpg"),
    rating: 4.9,
  },
  {
    slug: "klow-80mg",
    name: "KLOW 80mg",
    description:
      "KLOW is a multi-peptide research formulation for advanced biochemical and molecular assays in qualified laboratory environments. 80mg total mass for method development and non-clinical characterization only—not for human or animal consumption.",
    price: 110,
    imageUrl: productImageUrl("/images/22.jpg"),
    rating: 4.7,
  },
  {
    slug: "kpv-10mg",
    name: "KPV 10mg",
    description:
      "KPV (Lys-Pro-Val) tripeptide for in-vitro investigation of immune-cell assays and inflammatory pathway mediators in non-clinical models. 10mg; manufactured for analytical consistency—no therapeutic claims.",
    price: 95,
    imageUrl: productImageUrl("/images/1.jpg"),
    rating: 4.7,
  },
  {
    slug: "lipo-c-b12-10ml",
    name: "Lipo-C with B12 10ml",
    description:
      "Research formulation combining lipotropic-class compounds and cyanocobalamin for non-clinical studies of lipid biochemistry and one-carbon metabolism in controlled assays. 10ml; laboratory use only.",
    price: 85,
    imageUrl: productImageUrl("/images/3.jpg"),
    rating: 4.6,
  },
  {
    slug: "mots-c-10mg",
    name: "MOTS-C 10mg",
    description:
      "MOTS-C mitochondrial-derived peptide for non-clinical investigation of cellular energetics, stress-response pathways, and mitochondrial signaling in approved research models. 10mg; not for human or veterinary use.",
    price: 135,
    imageUrl: productImageUrl("/images/19.jpg"),
    rating: 4.8,
  },
  {
    slug: "mt1-10mg",
    name: "MT1 10mg",
    description:
      "MT1 (afamelanotide-related sequence) for non-clinical studies of melanocortin receptor pharmacology and pigmentation biochemistry in lawful laboratory models. 10mg vial; research use only.",
    price: 100,
    imageUrl: productImageUrl("/images/18.jpg"),
    rating: 4.6,
  },
  {
    slug: "mt2-10mg",
    name: "MT2 10mg",
    description:
      "MT2 synthetic peptide for in-vitro and non-clinical investigation of melanogenesis-related signaling and MSH-receptor binding—not for tanning, cosmetic, or human use. 10mg; controlled research environments only.",
    price: 100,
    imageUrl: productImageUrl("/images/17.jpg"),
    rating: 4.6,
  },
  {
    slug: "nad-500mg-10ml",
    name: "NAD+ 500mg 10ml",
    description:
      "NAD+ (oxidized nicotinamide adenine dinucleotide) for biochemical assays of redox cofactor pools, dehydrogenase kinetics, and mitochondrial enzyme systems in non-clinical research. 500mg/10ml solution; not for human administration.",
    price: 130,
    imageUrl: productImageUrl("/images/2.jpg"),
    rating: 4.8,
  },
  {
    slug: "selank-10mg",
    name: "Selank 10mg",
    description:
      "Selank synthetic peptide for laboratory studies of tuftsin-related analog behavior, neuropeptide receptor binding, and CNS cell-line models under controlled conditions—not for anxiolytic, cognitive, or clinical use. 10mg; research only.",
    price: 110,
    imageUrl: productImageUrl("/images/16.jpg"),
    rating: 4.7,
  },
  {
    slug: "semax-10mg",
    name: "Semax 10mg",
    description:
      "Semax adrenocorticotropic hormone–derived peptide for non-clinical investigation of neurotrophic-factor expression and cellular stress readouts in approved in-vitro systems—no claims regarding cognition or neuroprotection in humans. 10mg; research use only.",
    price: 110,
    imageUrl: productImageUrl("/images/15.jpg"),
    rating: 4.8,
  },
  {
    slug: "sqs-p4-10mg",
    name: "SQS-P4 10mg",
    description:
      "SQS-P4 proprietary peptide reference for experimental cellular-signaling and pathway-mapping studies. 10mg; high-purity material for qualified laboratory applications only.",
    price: 120,
    imageUrl: productImageUrl("/images/14.jpg"),
    rating: 4.5,
  },
  {
    slug: "sqs-t1som-10mg",
    name: "SQS-T1SOM 10mg",
    description:
      "SQS-T1SOM formulation for non-clinical exploration of somatotropic-axis–related receptor biology and metabolic readouts in controlled assays. 10mg vial; not for human or veterinary use.",
    price: 125,
    imageUrl: productImageUrl("/images/13.jpg"),
    rating: 4.6,
  },
  {
    slug: "ss-31-10mg",
    name: "SS-31 10mg",
    description:
      "SS-31 (Elamipretide) mitochondria-targeted tetrapeptide for cellular models measuring mitochondrial membrane potential, bioenergetics, and oxidative-stress markers—not for use as a therapeutic agent. 10mg; laboratory research only.",
    price: 150,
    imageUrl: productImageUrl("/images/12.jpg"),
    rating: 4.8,
  },
  {
    slug: "tb-500-10mg",
    name: "TB-500 10mg",
    description:
      "TB-500 (Thymosin Beta-4 fragment) for non-clinical studies of actin polymerization, cell migration, and cytoskeletal dynamics in controlled in-vitro systems—not for wound-care or clinical regeneration claims. 10mg; research only.",
    price: 120,
    imageUrl: productImageUrl("/images/4.jpg"),
    rating: 4.8,
  },
  {
    slug: "tb-500-5mg",
    name: "TB-500 5mg",
    description:
      "Lower-mass TB-500 reference vial for dose-response and comparative cytoskeletal-biology assays in laboratory models. 5mg; strictly for non-clinical research.",
    price: 90,
    imageUrl: productImageUrl("/images/11.jpg"),
    rating: 4.6,
  },
  {
    slug: "test-e-250-10ml",
    name: "Test E 250 (10ml)",
    description:
      "Testosterone enanthate reference preparation for analytical chemistry, receptor-binding studies, and endocrine biochemistry in licensed non-clinical research settings—not for human or veterinary administration. 10ml; qualified personnel only.",
    price: 140,
    imageUrl: productImageUrl("/images/10.jpg"),
    rating: 4.7,
  },
];
