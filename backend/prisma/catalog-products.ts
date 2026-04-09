/**
 * Catalog rows for Prisma seed. Sync from products.json (dedupe by slug, last wins).
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
    description: "5-Amino-1MQ is a research compound studied for its role in metabolic regulation and fat metabolism pathways. This 5mg vial is intended for laboratory-based research into weight management mechanisms and cellular energy utilization.",
    price: 90,
    imageUrl: productImageUrl("/images/9.jpg"),
    rating: 4.6,
  },
  {
    slug: "bpc-157-10mg",
    name: "BPC-157 10mg",
    description: "BPC-157 in a higher 10mg concentration, ideal for extended research protocols. Commonly studied for its effects on tissue regeneration, gastrointestinal protection, and cellular repair pathways. Manufactured for high consistency and purity.",
    price: 110,
    imageUrl: productImageUrl("/images/8.jpg"),
    rating: 4.8,
  },
  {
    slug: "bpc-157-5mg",
    name: "BPC-157 5mg",
    description: "BPC-157 is a synthetic peptide derived from a protective protein found in the stomach. It is commonly studied for its potential in tissue repair, gut health, and anti-inflammatory responses. This 5mg vial is optimized for precise experimental research and laboratory investigations.",
    price: 75,
    imageUrl: productImageUrl("/images/5.jpg"),
    rating: 4.7,
  },
  {
    slug: "bpc-157-tb-500-10mg-blend",
    name: "BPC-157 (5mg) + TB-500 (5mg) 10mg Blend",
    description: "This dual peptide blend combines BPC-157 and TB-500, each at 5mg, offering a total of 10mg. It is widely used in research studying synergistic effects on tissue repair, recovery, and cellular regeneration. Designed for advanced experimental applications requiring combined peptide interactions.",
    price: 135,
    imageUrl: productImageUrl("/images/6.jpg"),
    rating: 4.8,
  },
  {
    slug: "bpc-157-tb-500-20mg-blend",
    name: "BPC-157 (10mg) + TB-500 (10mg) 20mg Blend",
    description: "A high-dosage research blend of BPC-157 and TB-500, each at 10mg. This 20mg combination is intended for in-depth laboratory studies on regenerative processes, injury recovery, and advanced peptide synergy research.",
    price: 180,
    imageUrl: productImageUrl("/images/7.jpg"),
    rating: 4.9,
  },
  {
    slug: "cagrilintide-5mg",
    name: "Cagrilintide 5mg",
    description: "Cagrilintide is a long-acting amylin analogue that is widely researched for its role in appetite regulation, gastric emptying, and metabolic balance. It mimics the natural amylin hormone and is often studied in controlled environments for its potential impact on weight management and satiety signaling. Due to its extended duration of action, researchers can observe prolonged metabolic responses and hormonal interactions. This 5mg vial is intended strictly for laboratory and scientific research purposes only and is not suitable for human or veterinary consumption.",
    price: 120,
    imageUrl: productImageUrl("/images/21.jpg"),
    rating: 4.8,
  },
  {
    slug: "cjc-ipa-no-dac-10mg",
    name: "CJC-1295 + Ipamorelin (No DAC) 10mg",
    description: "This research peptide blend combines CJC-1295 (No DAC) and Ipamorelin, both studied for their role in stimulating growth hormone release. It is widely used in laboratory experiments focusing on endocrine system activity, hormone regulation, and metabolic function. The absence of DAC allows for shorter activity duration and more controlled experimental conditions. Researchers utilize this blend to analyze growth hormone pulses and related biological effects. Strictly for research use only.",
    price: 130,
    imageUrl: productImageUrl("/images/33.jpg"),
    rating: 4.8,
  },
  {
    slug: "ghk-cu-50mg",
    name: "GHK-Cu 50mg",
    description: "GHK-Cu is a copper peptide widely studied for its regenerative and tissue-repair properties. It is commonly used in research involving wound healing, collagen production, skin regeneration, and anti-aging mechanisms. Scientists explore its ability to support cellular repair and modulate biological processes. This 50mg vial is intended for laboratory research purposes only.",
    price: 125,
    imageUrl: productImageUrl("/images/32.jpg"),
    rating: 4.9,
  },
  {
    slug: "glow-70mg",
    name: "GLOW 70mg",
    description: "GLOW is a research blend formulated for experimental studies focusing on cellular health, oxidative stress, and tissue response. It is often used in laboratory environments to investigate skin-related biological processes and overall cellular function. The blend is designed to support exploratory research into regeneration and biochemical activity. This product is strictly for research use only.",
    price: 115,
    imageUrl: productImageUrl("/images/31.jpg"),
    rating: 4.6,
  },
  {
    slug: "glp-1s-20mg",
    name: "GLP-1S 20mg",
    description: "GLP-1S is a peptide analogue commonly researched for its role in insulin secretion, appetite control, and metabolic regulation. It is used in laboratory studies to explore its interaction with GLP-1 receptors and its effects on glucose metabolism. Researchers analyze its potential influence on energy balance and endocrine system responses. This 20mg vial is designed for scientific research only.",
    price: 95,
    imageUrl: productImageUrl("/images/30.jpg"),
    rating: 4.8,
  },
  {
    slug: "glp-r3-10mg",
    name: "GLP-R3 10mg",
    description: "GLP-R3 is a modified peptide used in advanced laboratory studies related to glucose metabolism and receptor activity. It is commonly researched for its interaction with GLP receptors and its role in insulin signaling pathways. Scientists use GLP-R3 to explore metabolic responses and endocrine system functions. The 10mg variant is suitable for targeted experimental setups. This compound is intended strictly for research use only.",
    price: 90,
    imageUrl: productImageUrl("/images/27.jpg"),
    rating: 4.7,
  },
  {
    slug: "glp-r3-20mg",
    name: "GLP-R3 20mg",
    description: "GLP-R3 is a peptide compound studied for its role in metabolic pathways and hormonal signaling. Researchers use it in controlled laboratory conditions to investigate glucose metabolism and endocrine responses. Its interaction with GLP receptors makes it valuable for experimental studies focused on energy balance and insulin activity. The 20mg format supports flexible research protocols. Not for human consumption.",
    price: 100,
    imageUrl: productImageUrl("/images/29.jpg"),
    rating: 4.7,
  },
  {
    slug: "glp-r3-30mg",
    name: "GLP-R3 30mg",
    description: "GLP-R3 is a research peptide used to study metabolic regulation, glucose control, and hormonal interactions. It is frequently utilized in laboratory experiments to understand its influence on insulin secretion and receptor binding. The 30mg version allows for extended research applications and more comprehensive experimental designs. This product is strictly for laboratory research and is not intended for human or veterinary use.",
    price: 110,
    imageUrl: productImageUrl("/images/28.jpg"),
    rating: 4.8,
  },
  {
    slug: "glp-t2-20mg",
    name: "GLP-T2 20mg",
    description: "GLP-T2 is widely researched for its potential effects on gastrointestinal health and metabolic processes. It plays a role in studies involving intestinal repair, nutrient uptake, and hormonal balance. Scientists use this peptide in laboratory settings to analyze its biological interactions and effects on digestion. The 20mg vial is ideal for precise dosing and controlled experiments. For research purposes only.",
    price: 85,
    imageUrl: productImageUrl("/images/26.jpg"),
    rating: 4.6,
  },
  {
    slug: "glp-t2-30mg",
    name: "GLP-T2 30mg",
    description: "GLP-T2 is a peptide used in experimental research focusing on metabolic activity and gastrointestinal biology. It is often studied for its effects on intestinal growth, nutrient absorption, and hormone regulation. Researchers utilize this compound to better understand digestive system functions and metabolic pathways. The 30mg format provides flexibility for controlled lab experiments. This product is for research use only and not for human consumption.",
    price: 95,
    imageUrl: productImageUrl("/images/25.jpg"),
    rating: 4.6,
  },
  {
    slug: "glp-t2-40mg",
    name: "GLP-T2 40mg",
    description: "GLP-T2 is a research peptide studied for its role in metabolic regulation and gastrointestinal function. It is commonly used in laboratory environments to investigate nutrient absorption, gut health, and hormonal signaling pathways. Researchers explore its interaction with biological receptors and its impact on digestion-related processes. The 40mg variant is suitable for extended experimental protocols and advanced studies. This compound is intended strictly for research purposes only.",
    price: 105,
    imageUrl: productImageUrl("/images/24.jpg"),
    rating: 4.7,
  },
  {
    slug: "igf-lr3-1mg",
    name: "IGF LR3 1mg",
    description: "IGF-1 LR3 is a synthetic analogue of insulin-like growth factor-1, engineered with a longer half-life and enhanced biological activity. It is widely used in laboratory research to study cell proliferation, tissue regeneration, and protein synthesis. Due to reduced binding with IGF-binding proteins, it remains active for longer durations, enabling detailed experimental analysis. Researchers often use IGF LR3 in studies related to muscle development, cellular repair, and metabolic processes. This product is strictly for research use only.",
    price: 95,
    imageUrl: productImageUrl("/images/23.jpg"),
    rating: 4.9,
  },
  {
    slug: "klow-80mg",
    name: "KLOW 80mg",
    description: "KLOW is a specialized research compound designed for advanced biochemical and molecular studies. It is commonly utilized in laboratory environments to investigate cellular responses, chemical interactions, and metabolic pathways. Its unique composition allows researchers to explore a wide range of experimental scenarios involving biological processes. This 80mg vial is intended for controlled research use only and must be handled by qualified professionals. Not intended for human or animal consumption.",
    price: 110,
    imageUrl: productImageUrl("/images/22.jpg"),
    rating: 4.7,
  },
  {
    slug: "kpv-10mg",
    name: "KPV 10mg",
    description: "KPV (Lysine-Proline-Valine) is a synthetic peptide studied for its potential anti-inflammatory and immune-modulating properties. This 10mg vial is designed strictly for laboratory research and experimental purposes. Researchers commonly explore KPV in studies related to gut health, inflammation pathways, and cellular repair mechanisms. Manufactured under controlled conditions to ensure purity and consistency.",
    price: 95,
    imageUrl: productImageUrl("/images/1.jpg"),
    rating: 4.7,
  },
  {
    slug: "lipo-c-b12-10ml",
    name: "Lipo-C with B12 10ml",
    description: "Lipo-C with B12 is a research formulation combining lipotropic compounds and Vitamin B12, commonly studied for metabolic and fat metabolism pathways. This 10ml vial is designed for laboratory experiments exploring energy regulation, lipid metabolism, and cellular detoxification processes. For research use only.",
    price: 85,
    imageUrl: productImageUrl("/images/3.jpg"),
    rating: 4.6,
  },
  {
    slug: "mots-c-10mg",
    name: "MOTS-C 10mg",
    description: "MOTS-C is a mitochondrial-derived peptide researched for its role in metabolic regulation and energy homeostasis. This 10mg vial is designed for advanced experimental studies focusing on metabolic health.",
    price: 135,
    imageUrl: productImageUrl("/images/19.jpg"),
    rating: 4.8,
  },
  {
    slug: "mt1-10mg",
    name: "MT1 10mg",
    description: "MT1 (Melanotan I) is a peptide studied in research related to pigmentation and UV response mechanisms. This 10mg vial is intended strictly for laboratory use.",
    price: 100,
    imageUrl: productImageUrl("/images/18.jpg"),
    rating: 4.6,
  },
  {
    slug: "mt2-10mg",
    name: "MT2 10mg",
    description: "MT2 (Melanotan II) is a synthetic peptide studied for its effects on melanogenesis and skin pigmentation pathways. This 10mg vial is provided for controlled research environments only.",
    price: 100,
    imageUrl: productImageUrl("/images/17.jpg"),
    rating: 4.6,
  },
  {
    slug: "nad-500mg-10ml",
    name: "NAD+ 500mg 10ml",
    description: "NAD+ (Nicotinamide Adenine Dinucleotide) is a vital coenzyme involved in cellular energy metabolism and mitochondrial function. This 500mg solution in 10ml format is intended for advanced research into aging, energy production, and cellular repair. Ideal for controlled laboratory use, ensuring high purity and stability for consistent experimental outcomes.",
    price: 130,
    imageUrl: productImageUrl("/images/2.jpg"),
    rating: 4.8,
  },
  {
    slug: "selank-10mg",
    name: "Selank 10mg",
    description: "Selank is a synthetic peptide studied for its anxiolytic and cognitive-enhancing effects. Commonly researched for stress modulation and immune response, this 10mg vial is ideal for laboratory investigations.",
    price: 110,
    imageUrl: productImageUrl("/images/16.jpg"),
    rating: 4.7,
  },
  {
    slug: "semax-10mg",
    name: "Semax 10mg",
    description: "Semax is a nootropic peptide studied for its potential cognitive-enhancing and neuroprotective properties. This 10mg vial is intended for research into brain function, memory, and stress response mechanisms.",
    price: 110,
    imageUrl: productImageUrl("/images/15.jpg"),
    rating: 4.8,
  },
  {
    slug: "sqs-p4-10mg",
    name: "SQS-P4 10mg",
    description: "SQS-P4 is a proprietary research peptide designed for experimental studies in cellular signaling and biological pathways. This 10mg vial ensures high purity and consistency for laboratory applications.",
    price: 120,
    imageUrl: productImageUrl("/images/14.jpg"),
    rating: 4.5,
  },
  {
    slug: "sqs-t1som-10mg",
    name: "SQS-T1SOM 10mg",
    description: "SQS-T1SOM is a research peptide formulation studied for its potential effects on growth hormone pathways and metabolic activity. Provided in a 10mg vial for controlled laboratory experimentation.",
    price: 125,
    imageUrl: productImageUrl("/images/13.jpg"),
    rating: 4.6,
  },
  {
    slug: "ss-31-10mg",
    name: "SS-31 10mg",
    description: "SS-31 (Elamipretide) is a mitochondria-targeting peptide researched for its role in improving cellular energy production and reducing oxidative stress. This 10mg vial is suitable for advanced biochemical and cellular research.",
    price: 150,
    imageUrl: productImageUrl("/images/12.jpg"),
    rating: 4.8,
  },
  {
    slug: "tb-500-10mg",
    name: "TB-500 10mg",
    description: "TB-500 (Thymosin Beta-4 fragment) is widely researched for its role in tissue regeneration, wound healing, and cellular migration. This 10mg vial is intended for controlled experimental environments focusing on recovery and repair mechanisms at the cellular level. High purity formulation for consistent laboratory results.",
    price: 120,
    imageUrl: productImageUrl("/images/4.jpg"),
    rating: 4.8,
  },
  {
    slug: "tb-500-5mg",
    name: "TB-500 5mg",
    description: "Lower dosage TB-500 variant for controlled experimental research. This 5mg vial is commonly used in studies focusing on tissue regeneration, cellular repair, and recovery processes under laboratory conditions.",
    price: 90,
    imageUrl: productImageUrl("/images/11.jpg"),
    rating: 4.6,
  },
  {
    slug: "test-e-250-10ml",
    name: "Test E 250 (10ml)",
    description: "Testosterone Enanthate 250 is a long-acting ester studied in hormone regulation and endocrine system research. This 10ml vial is designed strictly for laboratory use, ensuring consistent composition and stability for controlled experimental settings.",
    price: 140,
    imageUrl: productImageUrl("/images/10.jpg"),
    rating: 4.7,
  },
];
