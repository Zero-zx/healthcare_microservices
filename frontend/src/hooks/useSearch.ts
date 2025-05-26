import { useState, useCallback, useMemo } from 'react';

interface SearchOptions<T> {
  searchableFields?: (keyof T)[];
  initialSearchTerm?: string;
}

export const useSearch = <T extends Record<string, any>>({
  searchableFields,
  initialSearchTerm = ''
}: SearchOptions<T> = {}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const searchData = useCallback(
    (data: T[]) => {
      if (!searchTerm) return data;
      if (!searchableFields) return data;

      return data.filter((item) =>
        searchableFields.some((field) => {
          const value = item[field];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return false;
        })
      );
    },
    [searchTerm, searchableFields]
  );

  const searchProps = useMemo(
    () => ({
      value: searchTerm,
      onChange: handleSearchChange,
      placeholder: 'Search...'
    }),
    [searchTerm, handleSearchChange]
  );

  return {
    searchTerm,
    handleSearchChange,
    searchData,
    searchProps
  };
};

export {}; 