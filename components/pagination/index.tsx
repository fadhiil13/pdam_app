"use client" // Perbaikan: huruf kecil semua

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious, // Tambahkan ini jika ingin dipakai nanti
} from "@/components/ui/pagination"
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  count: number;
  perPage: number;
  currentPages: number;
};

export default function SimplePagination({ count, perPage, currentPages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPage = Math.ceil(count / perPage) || 1; // Minimal 1 halaman
  const isFirstPage = currentPages === 1;
  const isLastPage = currentPages >= totalPage;

  const changePage = (page: number) => {
    const safePage = Math.min(Math.max(page, 1), totalPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', safePage.toString());
    router.push(`?${params.toString()}`);
  }

  const generatePages = () => {
    const pages = [];
    let start = Math.max(1, currentPages - 2);
    let end = Math.min(currentPages + 2, totalPage);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }; // PERBAIKAN: Kurung penutup fungsi di sini

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => !isFirstPage && changePage(currentPages - 1)}
            className={isFirstPage ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
          />
        </PaginationItem>

        {/* First Ellipsis */}
        {currentPages > 3 && (
          <>
            <PaginationItem>
              <PaginationLink className="cursor-pointer" onClick={() => changePage(1)}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {/* Number Pages */}
        {generatePages().map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              className="cursor-pointer"
              isActive={page === currentPages}
              onClick={() => changePage(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Last Ellipsis */}
        {currentPages < totalPage - 2 && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink className="cursor-pointer" onClick={() => changePage(totalPage)}>
                {totalPage}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            onClick={() => !isLastPage && changePage(currentPages + 1)}
            className={isLastPage ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}