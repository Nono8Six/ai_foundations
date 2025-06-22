import React from 'react';
interface UserFiltersProps {
    filters: Record<string, string>;
    setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}
declare const UserFilters: ({ filters, setFilters }: UserFiltersProps) => import("react/jsx-runtime").JSX.Element;
export default UserFilters;
