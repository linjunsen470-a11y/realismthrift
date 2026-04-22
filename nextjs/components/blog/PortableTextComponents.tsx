import Image from "next/image";
import type { PortableTextComponents } from "@portabletext/react";
import { hasUsableImageAsset, urlForImage } from "@/lib/sanity/image";

export const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-8 leading-relaxed">{children}</p>,
    h2: ({ children }) => <h2 className="rt-prose-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="rt-prose-h3">{children}</h3>,
    h4: ({ children }) => <h4 className="rt-prose-h4">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="rt-prose-quote">{children}</blockquote>
    ),
  },
  types: {
    image: ({ value }) => {
      const imageUrl = hasUsableImageAsset(value)
        ? urlForImage(value).width(1200).height(700).fit("max").auto("format").url()
        : null;

      if (!imageUrl) {
        return null;
      }

      return (
        <figure className="rt-rich-figure">
          <Image
            src={imageUrl}
            alt={value.alt || ""}
            width={1200}
            height={700}
            className="rt-rich-image"
          />
          {value.caption ? <figcaption>{value.caption}</figcaption> : null}
        </figure>
      );
    },
    table: ({ value }) => {
      const rows = Array.isArray(value?.rows) ? value.rows : [];

      if (!rows.length) {
        return null;
      }

      const [headRow, ...bodyRows] = rows;
      const hasHeader = Array.isArray(headRow?.cells) && headRow.cells.some(Boolean);
      const tableBodyRows = hasHeader ? bodyRows : rows;

      return (
        <div className="rt-table-wrap rt-prose-table-wrap">
          <table className="rt-specs-table rt-prose-table">
            {hasHeader ? (
              <thead>
                <tr>
                  {headRow.cells.map((cell: string, index: number) => (
                    <th key={`head-${index}`}>{cell}</th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody>
              {tableBodyRows.map((row: { cells?: string[] }, rowIndex: number) => (
                <tr key={`row-${rowIndex}`}>
                  {(row.cells || []).map((cell, cellIndex) => (
                    <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const openInNewTab = Boolean(value?.openInNewTab);

      return (
        <a
          href={href}
          target={openInNewTab ? "_blank" : undefined}
          rel={openInNewTab ? "noreferrer noopener" : undefined}
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
};
