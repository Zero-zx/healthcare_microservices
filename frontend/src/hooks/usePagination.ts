import { useState, useCallback, useMemo } from 'react';

interface PaginationOptions {
  initialPage?: number;
  initialRowsPerPage?: number;
  rowsPerPageOptions?: number[];
}

export const usePagination = <T>({
  initialPage = 0,
  initialRowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 25, 50],
}: PaginationOptions = {}) => {
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const paginateData = useCallback((data: T[]) => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }, [page, rowsPerPage]);

  const paginationProps = useMemo(() => ({
    page,
    rowsPerPage,
    rowsPerPageOptions,
    onPageChange: handleChangePage,
    onRowsPerPageChange: handleChangeRowsPerPage,
  }), [page, rowsPerPage, rowsPerPageOptions, handleChangePage, handleChangeRowsPerPage]);

  return {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    paginateData,
    paginationProps,
  };
}; 