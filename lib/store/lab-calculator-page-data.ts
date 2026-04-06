import {
  PRECISION_INTRO,
  RELATED_PRODUCTS,
  RESEARCH_QUALITY,
  REVIEWS,
} from "@/lib/store/popular-peptides-data";

export { RELATED_PRODUCTS, REVIEWS, RESEARCH_QUALITY };

export const LAB_CALC_PRECISION_INTRO = PRECISION_INTRO;

/** Matches SQSpeptides calculator page feature strip (screenshot). */
export const LAB_CALC_PRECISION_FEATURES = [
  {
    title: "Research-Grade Accuracy",
    subtitle: "Consistent analytical standards for laboratory reference.",
    imageSeed: "lab-calc-acc",
  },
  {
    title: "Verified Purity & Quality",
    subtitle: "Documentation and batch traceability where applicable.",
    imageSeed: "lab-calc-purity",
  },
  {
    title: "Potent & Single-Compound Formulation",
    subtitle: "Focused compounds without unnecessary fillers.",
    imageSeed: "lab-calc-potent",
  },
];

/** Placeholder copy per design mockup; replace when final FAQ is ready. */
export const LAB_CALC_FAQ_DUMMY = [
  {
    q: "This is a dummy text that will be replaced later...",
    a: "This is a placeholder answer. Content will be updated to match your final FAQ.",
  },
  {
    q: "This is a dummy text that will be replaced later...",
    a: "This is a placeholder answer. Content will be updated to match your final FAQ.",
  },
  {
    q: "This is a dummy text that will be replaced later...",
    a: "This is a placeholder answer. Content will be updated to match your final FAQ.",
  },
  {
    q: "This is a dummy text that will be replaced later...",
    a: "This is a placeholder answer. Content will be updated to match your final FAQ.",
  },
];
