import { useState, useCallback, useMemo } from 'react';

type Order = 'asc' | 'desc';

interface SortingOptions<T> {
  initialOrderBy?: keyof T;
  initialOrder?: Order;
}

export const useSorting = <T extends Record<string, any>>({
  initialOrderBy,
  initialOrder = 'asc',
}: SortingOptions<T> = {}) => {
  const [orderBy, setOrderBy] = useState<keyof T | undefined>(initialOrderBy);
  const [order, setOrder] = useState<Order>(initialOrder);

  const handleRequestSort = useCallback((property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }, [order, orderBy]);

  const sortData = useCallback((data: T[]) => {
    if (!orderBy) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue === bValue) {
        return 0;
      }

      if (aValue === null || aValue === undefined) {
        return order === 'asc' ? -1 : 1;
      }

      if (bValue === null || bValue === undefined) {
        return order === 'asc' ? 1 : -1;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return order === 'asc'
        ? aValue < bValue ? -1 : 1
        : bValue < aValue ? -1 : 1;
    });
  }, [order, orderBy]);

  const sortingProps = useMemo(() => ({
    order,
    orderBy,
    onRequestSort: handleRequestSort,
  }), [order, orderBy, handleRequestSort]);

  return {
    order,
    orderBy,
    handleRequestSort,
    sortData,
    sortingProps,
  };
}; 