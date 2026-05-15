import { apiSlice } from "../slices/ApiSlice";

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    getCategory: builder.query({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),

    createCategory: builder.mutation({
      query: (categoryData) => {
        const formData = new FormData();
        formData.append("name", categoryData.name);
        if (categoryData.description) {
          formData.append("description", categoryData.description);
        }
        if (categoryData.images && categoryData.images.length > 0) {
          categoryData.images.forEach((image: any) => {
            if (image instanceof File) {
              formData.append("images", image);
            } else {
              formData.append("images", image);
            }
          });
        }

        return {
          url: "/categories",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation({
      query: ({ id, categoryData }) => {
        const formData = new FormData();
        if (categoryData.name) formData.append("name", categoryData.name);
        if (categoryData.description) formData.append("description", categoryData.description);
        if (categoryData.images && categoryData.images.length > 0) {
          categoryData.images.forEach((image: any) => {
            formData.append("images", image);
          });
        }

        return {
          url: `/categories/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

getCategoryAttributes: builder.query({
  query: (categoryId: string) => `/categories/${categoryId}`,
  transformResponse: (response: any) => ({
    attributes: response.category.attributes.map((atr: any) => ({
      id: atr.attribute.id,
      name: atr.attribute.name,
      isRequired: atr.isRequired,
      values: atr.attribute.values.map((v: any) => ({
        id: v.id,
        value: v.value,
        slug: v.slug,
      })),
    })),
  }),
}),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryQuery,
  useGetCategoryAttributesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
