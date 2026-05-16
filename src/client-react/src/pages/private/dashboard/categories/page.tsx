import React, { useState } from "react";
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/store/apis/CategoryApi";
import Table from "@/components/layout/Table";
import { motion } from "framer-motion";
import { Tag, Trash2, Plus, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import Modal from "@/components/organisms/Modal";
import ConfirmModal from "@/components/organisms/ConfirmModal";
import CategoryForm from "./CategoryForm";
import type { CategoryFormData } from "./CategoryForm";
import useToast from "@/hooks/ui/useToast";
import { withAuth } from "@/components/HOC/WithAuth";

const CategoriesDashboard = () => {
  const { showToast } = useToast();
  const { data, isLoading, error } = useGetAllCategoriesQuery({});
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();
  const categories = data?.categories || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryFormData | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const form = useForm<CategoryFormData>({
    defaultValues: { name: "", description: "", images: [] },
  });

  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (row: any) => (
        <span className="font-medium text-gray-800">{row?.name || "N/A"}</span>
      ),
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
      render: (row: any) => (
        <span className="font-medium text-gray-800 line-clamp-1">{row?.description || "N/A"}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <div className="flex space-x-3">
          <button
            onClick={() => handleEdit(row)}
            className="p-1 text-blue-500 hover:text-blue-600 transition-colors"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDeletePrompt(row?.id)}
            className="p-1 text-red-500 hover:text-red-600 transition-colors"
            disabled={isDeleting}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (category: any) => {
    setEditingCategory({
      id: category.id,
      name: category.name,
      description: category.description || "",
      images: category.images || [],
    });
    form.reset({
      name: category.name,
      description: category.description || "",
      images: category.images || [],
    });
    setIsModalOpen(true);
  };

  const handleDeletePrompt = (id: string) => {
    if (!id) return;
    setCategoryToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete).unwrap();
      setIsConfirmModalOpen(false);
      setCategoryToDelete(null);
      showToast("Category deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete category:", err);
      showToast("Failed to delete category", "error");
    }
  };

  const onSubmit = async (formData: CategoryFormData) => {
    try {
      if (editingCategory?.id) {
        await updateCategory({
          id: editingCategory.id,
          categoryData: formData,
        }).unwrap();
        showToast("Category updated successfully", "success");
      } else {
        await createCategory(formData).unwrap();
        showToast("Category created successfully", "success");
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      form.reset({ name: "", description: "", images: [] });
    } catch (err) {
      console.error("Failed to save category:", err);
      showToast("Failed to save category", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-3">
          <Tag size={24} className="text-indigo-500" />
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            form.reset({ name: "", description: "", images: [] });
            setIsModalOpen(true);
          }}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Category</span>
        </button>
      </motion.div>

      {isLoading ? (
        <div className="text-center py-12">Loading categories...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          Error: {(error as any)?.message || "Failed to load categories"}
        </div>
      ) : (
        <Table
          data={categories}
          columns={columns}
          isLoading={isLoading}
          className="bg-white rounded-xl shadow-md"
        />
      )}

      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {editingCategory ? "Edit Category" : "Create Category"}
        </h2>
        <CategoryForm
          form={form}
          onSubmit={onSubmit}
          isLoading={isCreating || isUpdating}
          submitLabel={editingCategory ? "Update" : "Create"}
          existingImages={editingCategory?.images}
        />
      </Modal>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this category?"
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
        title="Delete Category"
        type="danger"
      />
    </div>
  );
};

export default withAuth(CategoriesDashboard);
