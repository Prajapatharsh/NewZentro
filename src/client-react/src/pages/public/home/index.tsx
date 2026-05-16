import { useQuery } from "@apollo/client/react/index.js";
import { GET_PRODUCTS_SUMMARY } from "@/gql/Product";
import { useMemo, lazy, Suspense } from "react";
import groupProductsByFlag from "@/utils/groupProductsByFlag";
import SkeletonLoader from "@/components/feedback/SkeletonLoader";

const HeroSection = lazy(() => import("./HeroSection"));
const CategoryBar = lazy(() => import("./CategoryBar"));
const ProductSection = lazy(() => import("../product/ProductSection"));

const Home = () => {
  const { data, loading, error } = useQuery(GET_PRODUCTS_SUMMARY, {
    variables: { first: 100 },
    fetchPolicy: "no-cache",
    onError: (err) => console.error("Apollo Query Error (Home):", err)
  });

  const products = data?.products?.products || [];
  
  const { featured, trending, newArrivals, bestSellers } = useMemo(() => {
    const grouped = groupProductsByFlag(products);
    return grouped;
  }, [products]);

  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="h-64 flex items-center justify-center bg-gray-50">Loading Hero...</div>}>
        <HeroSection />
      </Suspense>
      
      <Suspense fallback={null}>
        <CategoryBar />
      </Suspense>

      <div className="space-y-8">
        <ProductSection
          title="Featured"
          products={featured}
          loading={loading}
          error={error}
          showTitle={true}
        />
        <ProductSection
          title="Trending"
          products={trending}
          loading={loading}
          error={error}
          showTitle={true}
        />
      </div>
    </div>
  );
};

export default Home;
