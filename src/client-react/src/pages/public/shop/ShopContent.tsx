// shop/ShopContent.tsx (updated)

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react/index.js";
import { motion, AnimatePresence } from "framer-motion";
import { Package } from "lucide-react";
import { GET_PRODUCTS, GET_CATEGORIES, GET_PRODUCTS_SUMMARY } from "@/gql/Product";
import type { Product  } from "@/types/productTypes";
import ProductCard from "../product/ProductCard";
import ProductFilters from "./ProductFilters";
import type { FilterValues } from "./ProductFilters";

interface ShopContentProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShopContent: React.FC<ShopContentProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  console.log("URL Params:", Object.fromEntries(searchParams.entries()));

  const initialFilters = useMemo(
    () => ({
      search: searchParams.get("search") || "",
      isNew: searchParams.get("isNew") === "true" || undefined,
      isFeatured: searchParams.get("isFeatured") === "true" || undefined,
      isTrending: searchParams.get("isTrending") === "true" || undefined,
      isBestSeller: searchParams.get("isBestSeller") === "true" || undefined,
      minPrice: searchParams.get("minPrice")
        ? parseFloat(searchParams.get("minPrice")!)
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? parseFloat(searchParams.get("maxPrice")!)
        : undefined,
      categoryId: searchParams.get("categoryId") || undefined,
    }),
    [searchParams]
  );

  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const pageSize = 12;

  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const categories = categoriesData?.categories || [];

  const cleanFilters = useMemo(() => {
    const f: any = {};
    const isValid = (val: any) => val !== undefined && val !== null && val !== "" && val !== "undefined" && val !== "null" && typeof val === "string";

    if (isValid(initialFilters.search)) f.search = initialFilters.search;
    if (isValid(initialFilters.categoryId)) f.categoryId = initialFilters.categoryId;
    if (initialFilters.minPrice !== undefined) f.minPrice = initialFilters.minPrice;
    if (initialFilters.maxPrice !== undefined) f.maxPrice = initialFilters.maxPrice;
    if (initialFilters.isNew === true) f.isNew = true;
    if (initialFilters.isFeatured === true) f.isFeatured = true;
    if (initialFilters.isTrending === true) f.isTrending = true;
    if (initialFilters.isBestSeller === true) f.isBestSeller = true;
    console.log("FINAL CLEAN FILTERS BEING SENT:", f);
    return f;
  }, [initialFilters]);

  const { data, loading, error, fetchMore } = useQuery(GET_PRODUCTS, {
    variables: { 
      first: pageSize, 
      skip: 0, 
      filters: Object.keys(cleanFilters).length > 0 ? cleanFilters : null 
    },
    fetchPolicy: "no-cache",
    onError: (err) => {
      console.error("Error fetching products:", err);
    },
  });

  useEffect(() => {
    setSkip(0);
    setHasMore(true);
  }, [initialFilters]);

  const handleShowMore = () => {
    if (!data) return;
    setIsFetchingMore(true);
    const newSkip = skip + pageSize;
    fetchMore({
      variables: { 
        first: pageSize, 
        skip: newSkip, 
        filters: Object.keys(cleanFilters).length > 0 ? cleanFilters : null 
      },
    }).then(({ data: newData }) => {
      setSkip(newSkip);
      setHasMore(newData.products.hasMore);
      setIsFetchingMore(false);
    });
  };

  const updateFilters = (newFilters: FilterValues) => {
    const query = new URLSearchParams();
    if (newFilters.search) query.set("search", newFilters.search);
    if (newFilters.isNew) query.set("isNew", "true");
    if (newFilters.isFeatured) query.set("isFeatured", "true");
    if (newFilters.isTrending) query.set("isTrending", "true");
    if (newFilters.isBestSeller) query.set("isBestSeller", "true");
    if (newFilters.minPrice)
      query.set("minPrice", newFilters.minPrice.toString());
    if (newFilters.maxPrice)
      query.set("maxPrice", newFilters.maxPrice.toString());
    if (newFilters.categoryId) query.set("categoryId", newFilters.categoryId);

    navigate(`/shop?${query.toString()}`);
  };

  const products = data?.products?.products || [];
  const noProductsFound = products.length === 0 && !loading && !error;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="hidden md:block w-full md:max-w-[350px]">
        <ProductFilters
          initialFilters={initialFilters}
          onFilterChange={updateFilters}
          categories={categories}
        />
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/30 z-40"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[85vw] max-w-md h-full bg-white"
            >
              <ProductFilters
                initialFilters={initialFilters}
                onFilterChange={updateFilters}
                categories={categories}
                isMobile={true}
                onCloseMobile={() => setSidebarOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-grow">
        {loading && !products.length && (
          <div className="text-center py-12">
            <Package
              size={48}
              className="mx-auto text-gray-400 mb-4 animate-pulse"
            />
            <p className="text-lg text-gray-600">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-lg text-red-500">Error loading products</p>
            <p className="text-sm text-gray-500">
              Please try again or adjust your filters.
            </p>
          </div>
        )}

        {noProductsFound && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-gray-600 mb-2">No products found</p>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        )}

        {!noProductsFound && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: Product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={handleShowMore}
                  disabled={isFetchingMore}
                  className={`bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors duration-300 font-medium ${
                    isFetchingMore ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isFetchingMore ? "Loading..." : "Show More Products"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShopContent;
