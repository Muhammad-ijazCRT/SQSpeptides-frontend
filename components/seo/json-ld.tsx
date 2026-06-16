type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Injects schema.org JSON-LD (valid in document body). */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
