"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.snow.css";

type Props = {
  id?: string;
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="admin-quill-loading form-control bg-light text-secondary small py-5 text-center">
      Loading editor…
    </div>
  ),
});

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link"],
    ["clean"],
  ],
} as const;

const QUILL_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "indent",
  "align",
  "blockquote",
  "code-block",
  "link",
];

export function ProductDescriptionEditor({
  id = "ap-desc",
  value,
  onChange,
  disabled = false,
  placeholder = "Write a clear product description…",
}: Props) {
  const modules = useMemo(
    () => ({
      ...QUILL_MODULES,
      toolbar: disabled ? false : QUILL_MODULES.toolbar,
    }),
    [disabled]
  );

  return (
    <div className={`admin-quill${disabled ? " admin-quill-disabled" : ""}`} id={`${id}-wrap`}>
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={(html) => {
          const next = html === "<p><br></p>" || html === "<p></p>" ? "" : html;
          onChange(next);
        }}
        readOnly={disabled}
        modules={modules}
        formats={[...QUILL_FORMATS]}
        placeholder={placeholder}
      />
    </div>
  );
}
