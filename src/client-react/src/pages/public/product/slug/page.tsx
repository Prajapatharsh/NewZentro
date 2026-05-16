
import { useEffect, useState } from "react";
import BreadCrumb from "@/components/feedback/BreadCrumb";
import { useParams, useNavigate } from "react-router-dom";
import ProductImageGallery from "../ProductImageGallery";
import ProductInfo from "../ProductInfo";
import ProductReviews from "../ProductReviews";
import { generateProductPlaceholder } from "@/utils/placeholderImage";
import { GRAPHQL_URL } from "@/lib/constants/config";
import ProductDetailSkeletonLoader from "@/components/feedback/ProductDetailSkeletonLoader";
import type { Product  } from "@/types/productTypes";
import { useAppSelector } from "@/hooks/state/useRedux";
import useToast from "@/hooks/ui/useToast";

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { showToast } = useToast();

  console.log("RENDER - User:", user, "Slug:", slug);

  const [fetchData, setFetchData] = useState<any>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loading = fetchLoading;
  const error = fetchError ? { message: fetchError } : null;
  const data = fetchData;

  const finalSlug = (slug || "").toLowerCase().replace(/\s+/g, '-');

  useEffect(() => {
    const getData = async () => {
      try {
        const url = GRAPHQL_URL || "http://localhost:5000/api/v1/graphql";
        console.log("🚀 [FETCH START] URL:", url, "Slug:", finalSlug);
        setFetchLoading(true);
        const res = await fetch(url, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Apollo-Require-Preflight": "true"
          },
          body: JSON.stringify({
            query: `query GetSingleProduct($slug: String!) {
              product(slug: $slug) {
                id name slug isNew isFeatured averageRating reviewCount description
                variants { id sku price images stock attributes { id attribute { name } value { value } } }
                category { id name slug }
                reviews { id rating comment user { id name } createdAt }
              }
            }`,
            variables: { slug: finalSlug }
          }),
          credentials: "include"
        });
        console.log("📥 [FETCH RESPONSE] Status:", res.status, res.statusText);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
        const json = await res.json();
        console.log("📦 [FETCH DATA]:", json);

        if (json.errors) setFetchError(json.errors[0].message);
        else setFetchData(json.data);
        setFetchLoading(false);
      } catch (err: any) {
        console.error("Direct Fetch Error:", err);
        setFetchError(err.message);
        setFetchLoading(false);
      }
    };
    if (finalSlug && user) getData();
    else if (!user) setFetchLoading(false);
  }, [finalSlug, user]);

  useEffect(() => {
    if (!loading && user === null) {
      navigate("/sign-in");
    }
  }, [user, loading, navigate]);

  const [selectedVariant, setSelectedVariant] = useState<
    Product["variants"][0] | null
  >(null);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  if (loading) return <ProductDetailSkeletonLoader />;

  if (error) {
    return (
      <div className="text-center py-12 flex flex-col items-center gap-4">
        <p className="text-lg text-red-500">Error: {error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  const product = data?.product;

  if (!product) {
    return (
      <div className="text-center py-12 flex flex-col items-center gap-4">
        <p className="text-lg text-gray-600">Product not found</p>
        <div className="bg-gray-100 p-4 rounded text-xs font-mono text-left">
          <div>User Logged In: {user ? "YES" : "NO"}</div>
          <div>Slug: {finalSlug}</div>
        </div>
      </div>
    );
  }

  const attributeGroups = (product.variants || []).reduce((acc: any, variant: any) => {
    if (!variant || !variant.attributes) return acc;
    const hasSelections = Object.values(selectedAttributes).some(
      (value) => value !== ""
    );
    const matchesSelections = hasSelections
      ? Object.entries(selectedAttributes).every(
          ([attrName, attrValue]) =>
            attrName === "" ||
            variant.attributes.some(
              (attr: any) =>
                attr.attribute.name === attrName &&
                attr.value.value === attrValue
            )
        )
      : true;
    if (matchesSelections) {
      variant.attributes.forEach(({ attribute, value }: any) => {
        if (!acc[attribute.name]) {
          acc[attribute.name] = { values: new Set<string>() };
        }
        acc[attribute.name].values.add(value.value);
      });
    }
    return acc;
  }, {} as Record<string, { values: Set<string> }>);

  const resetSelections = () => {
    setSelectedAttributes({});
    setSelectedVariant(null);
  };

  const handleVariantChange = (attributeName: string, value: string) => {
    const newSelections = { ...selectedAttributes, [attributeName]: value };
    setSelectedAttributes(newSelections);
    const variant = product.variants.find((v: any) =>
      Object.entries(newSelections).every(
        ([attrName, attrValue]) =>
          attrName === "" ||
          v.attributes.some(
            (attr: any) =>
              attr.attribute.name === attrName && attr.value.value === attrValue
          )
      )
    );
    setSelectedVariant(variant || null);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <BreadCrumb />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <ProductImageGallery
                images={product.variants.flatMap((v: any) => v.images)}
                defaultImage={
                  selectedVariant?.images[0] ||
                  product.variants[0]?.images[0] ||
                  generateProductPlaceholder(product.name)
                }
                name={product.name}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <ProductInfo
                id={product.id}
                name={product.name}
                averageRating={product.averageRating}
                reviewCount={product.reviewCount}
                description={product.description || "No description available"}
                variants={product.variants}
                selectedVariant={selectedVariant}
                onVariantChange={handleVariantChange}
                attributeGroups={attributeGroups}
                selectedAttributes={selectedAttributes}
                resetSelections={resetSelections}
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <ProductReviews reviews={product.reviews} productId={product.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;
