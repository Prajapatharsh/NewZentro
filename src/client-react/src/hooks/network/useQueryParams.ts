import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useCallback } from "react";

const useQueryParams = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const updateQuery = useCallback(
    (newParams: Record<string, string | number | boolean | null>) => {
      const updatedQuery = new URLSearchParams(searchParams.toString());

      Object.keys(newParams).forEach((key) => {
        const value = newParams[key];
        if (value === null || value === false || value === "") {
          updatedQuery.delete(key);
        } else {
          updatedQuery.set(key, String(value));
        }
      });

      const search = updatedQuery.toString();
      const queryString = search ? `?${search}` : "";

      navigate(`${pathname}${queryString}`);
    },
    [pathname, searchParams, navigate]
  );

  return { query: Object.fromEntries(searchParams.entries()), updateQuery };
};

export default useQueryParams;
