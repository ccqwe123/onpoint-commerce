// PaginationWithSearch.tsx
import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface LinkItem {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationProps {
  current_page: number;
  last_page: number;
  links: LinkItem[];
  onPageChange: (url: string) => void;
}

export default function PaginationWithSearch({
  current_page,
  last_page,
  links,
  onPageChange,
}: PaginationProps) {
  if (last_page <= 1) return null;

  const getPages = () => {
    const pages: (number | string)[] = [];
    const delta = 2;

    pages.push(1);

    if (current_page - delta > 2) {
      pages.push("...");
    }

    for (
      let i = Math.max(2, current_page - delta);
      i <= Math.min(last_page - 1, current_page + delta);
      i++
    ) {
      pages.push(i);
    }

    if (current_page + delta < last_page - 1) {
      pages.push("...");
    }

    if (last_page > 1) {
      pages.push(last_page);
    }

    return pages;
  };

  const prevUrl = links[0]?.url ?? null;
  const nextUrl = links[links.length - 1]?.url ?? null;

  return (
    <nav className="flex items-center justify-between mt-0">
      {/* Left Arrow */}
      <div className="flex">
        <button
          onClick={() => prevUrl && onPageChange(prevUrl)}
          disabled={!prevUrl}
          className={`px-3 py-2 rounded-md border text-sm gap-2 flex items-center ${
            prevUrl ? "text-gray-700 hover:bg-gray-100" : "text-gray-400 cursor-not-allowed"
          }`}
        >
          <ArrowLeft size={18} /> Previous
        </button>
      </div>

      {/* Page Numbers */}
      <div className="flex space-x-2">
        {getPages().map((page, i) =>
          page === "..." ? (
            <span key={i} className="px-3 py-2 text-gray-400">
              ...
            </span>
          ) : (
            (() => {
              // find link object that has matching label (Laravel paginator labels are strings)
              const linkObj = links.find((l) => l.label === page.toString());
              const url = linkObj?.url ?? null;
              return (
                <button
                  key={i}
                  onClick={() => url && onPageChange(url)}
                  disabled={!url}
                  className={`px-3 py-2 rounded-md border ${
                    page === current_page ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              );
            })()
          )
        )}
      </div>

      {/* Right Arrow */}
      <div className="flex">
        <button
          onClick={() => nextUrl && onPageChange(nextUrl)}
          disabled={!nextUrl}
          className={`px-3 py-2 rounded-md border flex text-sm gap-2 items-center ${
            nextUrl ? "text-gray-700 hover:bg-gray-100" : "text-gray-400 cursor-not-allowed"
          }`}
        >
          Next <ArrowRight size={18} />
        </button>
      </div>
    </nav>
  );
}
