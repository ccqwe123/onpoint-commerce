import { Link } from "@inertiajs/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  current_page: number;
  last_page: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

export default function Pagination({
  current_page,
  last_page,
  links,
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

  return (
    <nav className="flex items-center justify-between mt-6">
      {/* Left Arrow */}
      <div className="flex">
        <Link
          href={links[0].url || "#"}
          className={`px-3 py-2 rounded-md border flex items-center ${
            links[0].url
              ? "text-gray-700 hover:bg-gray-100"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          <ArrowLeft size={18} />
        </Link>
      </div>

      {/* Page Numbers (Centered) */}
      <div className="flex space-x-2">
        {getPages().map((page, i) =>
          page === "..." ? (
            <span key={i} className="px-3 py-2 text-gray-400">
              ...
            </span>
          ) : (
            <Link
              key={i}
              href={links.find((l) => l.label == page.toString())?.url || "#"}
              className={`px-3 py-2 rounded-md border ${
                page === current_page
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Right Arrow */}
      <div className="flex">
        <Link
          href={links[links.length - 1].url || "#"}
          className={`px-3 py-2 rounded-md border flex items-center ${
            links[links.length - 1].url
              ? "text-gray-700 hover:bg-gray-100"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          <ArrowRight size={18} />
        </Link>
      </div>
    </nav>
  );
}
