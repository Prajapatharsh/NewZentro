import AppError from "@/shared/errors/AppError";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export interface Context {
  prisma: PrismaClient;
  req: Request;
  res: Response;
}

export const productResolvers = {
  Query: {
    products: async (_: any, { first = 10, skip = 0, filters }: any, context: Context) => {
      try {
        const where: any = {};
        
        if (filters) {
          const conditions: any[] = [];

          // 1. Search filter
          if (filters.search && filters.search.trim() !== "") {
            conditions.push({
              OR: [
                { name: { contains: filters.search, mode: "insensitive" } },
                { description: { contains: filters.search, mode: "insensitive" } },
              ]
            });
          }

          // 2. Boolean flags
          if (filters.isNew !== undefined) conditions.push({ isNew: filters.isNew });
          if (filters.isFeatured !== undefined) conditions.push({ isFeatured: filters.isFeatured });
          if (filters.isTrending !== undefined) conditions.push({ isTrending: filters.isTrending });
          if (filters.isBestSeller !== undefined) conditions.push({ isBestSeller: filters.isBestSeller });

          // 3. Flags array (for flexible filtering)
          if (filters.flags && filters.flags.length > 0) {
            filters.flags.forEach((flag: string) => {
              if (flag === "featured") conditions.push({ isFeatured: true });
              if (flag === "trending") conditions.push({ isTrending: true });
              if (flag === "new") conditions.push({ isNew: true });
              if (flag === "bestseller") conditions.push({ isBestSeller: true });
            });
          }

          // 4. Category filter
          if (filters.categoryId && filters.categoryId.trim() !== "") {
            console.log("🎯 [CATEGORY FILTER RECEIVED]:", filters.categoryId);
            
            // If it looks like a MongoDB ObjectId
            const isObjectId = /^[0-9a-fA-F]{24}$/.test(filters.categoryId);
            
            if (isObjectId) {
              conditions.push({ categoryId: filters.categoryId });
            } else {
              // Otherwise treat as slug
              conditions.push({ category: { slug: filters.categoryId } });
            }
          }

          // 5. Price filter
          if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            const priceCondition: any = {};
            if (filters.minPrice !== undefined) priceCondition.gte = filters.minPrice;
            if (filters.maxPrice !== undefined) priceCondition.lte = filters.maxPrice;
            
            conditions.push({
              variants: {
                some: {
                  price: priceCondition
                }
              }
            });
          }

          if (conditions.length > 0) {
            where.AND = conditions;
          }
        }

        console.log("🔍 [FINAL PRISMA WHERE]:", JSON.stringify(where, null, 2));
        const [products, totalCount] = await Promise.all([
          context.prisma.product.findMany({
            where,
            take: first,
            skip,
            include: { category: true, variants: true, reviews: true },
            orderBy: { createdAt: 'desc' }
          }),
          context.prisma.product.count({ where })
        ]);

        console.log(`✅ [FOUND]: ${products.length} products (Total: ${totalCount})`);
        return {
          products,
          hasMore: skip + products.length < totalCount,
          totalCount,
        };
      } catch (error) {
        console.error("❌ [PRODUCTS RESOLVER ERROR]:", error);
        throw error;
      }
    },
    product: async (_: any, { slug }: { slug: string }, context: Context) => {
      const lowerSlug = slug.toLowerCase().trim().replace(/\s+/g, '-');
      console.log("🔍 [PRODUCT RESOLVER] Slug received:", slug, "Normalized to:", lowerSlug);
      
      const product = await context.prisma.product.findFirst({
        where: { slug: lowerSlug },
        include: {
          category: true,
          variants: {
            include: {
              attributes: {
                include: {
                  attribute: true,
                  value: true,
                },
              },
            },
          },
          reviews: true,
        },
      });

      if (!product) {
        console.log("❌ [PRODUCT RESOLVER] NOT FOUND in DB for slug:", lowerSlug);
      } else {
        console.log("✅ [PRODUCT RESOLVER] FOUND:", product.name);
      }
      
      return product;
    },
    newProducts: async (
      _: any,
      { first = 10, skip = 0 }: { first?: number; skip?: number },
      context: Context
    ) => {
      const totalCount = await context.prisma.product.count({
        where: { isNew: true },
      });
      const products = await context.prisma.product.findMany({
        where: { isNew: true },
        take: first,
        skip,
        include: {
          category: true,
          variants: true,
          reviews: true,
        },
      });
      return {
        products,
        hasMore: skip + products.length < totalCount,
        totalCount,
      };
    },
    featuredProducts: async (
      _: any,
      { first = 10, skip = 0 }: { first?: number; skip?: number },
      context: Context
    ) => {
      const totalCount = await context.prisma.product.count({
        where: { isFeatured: true },
      });
      const products = await context.prisma.product.findMany({
        where: { isFeatured: true },
        take: first,
        skip,
        include: {
          category: true,
          variants: true,
          reviews: true,
        },
      });
      return {
        products,
        hasMore: skip + products.length < totalCount,
        totalCount,
      };
    },
    trendingProducts: async (
      _: any,
      { first = 10, skip = 0 }: { first?: number; skip?: number },
      context: Context
    ) => {
      const totalCount = await context.prisma.product.count({
        where: { isTrending: true },
      });
      const products = await context.prisma.product.findMany({
        where: { isTrending: true },
        take: first,
        skip,
        include: {
          category: true,
          variants: true,
          reviews: true,
        },
      });
      return {
        products,
        hasMore: skip + products.length < totalCount,
        totalCount,
      };
    },
    bestSellerProducts: async (
      _: any,
      { first = 10, skip = 0 }: { first?: number; skip?: number },
      context: Context
    ) => {
      const totalCount = await context.prisma.product.count({
        where: { isBestSeller: true },
      });
      const products = await context.prisma.product.findMany({
        where: { isBestSeller: true },
        take: first,
        skip,
        include: {
          category: true,
          variants: true,
          reviews: true,
        },
      });
      return {
        products,
        hasMore: skip + products.length < totalCount,
        totalCount,
      };
    },
    categories: async (_: any, __: any, context: Context) => {
      return context.prisma.category.findMany({
        include: {
          products: {
            include: {
              variants: true,
            },
          },
        },
      });
    },
  },

  Product: {
    reviews: (parent: any, _: any, context: Context) => {
      return context.prisma.review.findMany({
        where: { productId: parent.id },
        include: {
          user: true,
        },
      });
    },
  },
};
