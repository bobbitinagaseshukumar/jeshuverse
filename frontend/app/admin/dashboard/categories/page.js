'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../../context/AuthContext';
import { API_URL } from '../../../../utils/api';
import { FiPlus, FiTrash2, FiLayers, FiCheckCircle, FiChevronDown, FiChevronRight, FiTag } from 'react-icons/fi';

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Category States
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [slug, setSlug] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Subcategory States
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [subCategories, setSubCategories] = useState({});
  const [newSubCatName, setNewSubCatName] = useState('');
  const [subCatLoading, setSubCatLoading] = useState({});

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCategories();
    }
  }, [token]);

  // Fetch subcategories for a specific category
  const fetchSubCategories = async (categoryId) => {
    setSubCatLoading(prev => ({ ...prev, [categoryId]: true }));
    try {
      const res = await axios.get(`${API_URL}/subcategories?categoryId=${categoryId}`);
      setSubCategories(prev => ({ ...prev, [categoryId]: res.data }));
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    } finally {
      setSubCatLoading(prev => ({ ...prev, [categoryId]: false }));
    }
  };

  // Toggle expand category to show subcategories
  const toggleExpand = (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
      if (!subCategories[categoryId]) {
        fetchSubCategories(categoryId);
      }
    }
  };

  // Create Category Handler
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Category name is required');
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        image: image.trim() || '/placeholder-category.png'
      };

      await axios.post(`${API_URL}/categories`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccessMsg('Category created successfully!');
      setName('');
      setSlug('');
      setImage('');
      fetchCategories();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create category');
    }
  };

  // Delete Category Handler
  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? All products mapping to it may need updating.')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMsg('Category removed successfully.');
      fetchCategories();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  // Create SubCategory Handler
  const handleCreateSubCategory = async (categoryId) => {
    if (!newSubCatName.trim()) return;
    try {
      await axios.post(`${API_URL}/subcategories`, {
        name: newSubCatName.trim(),
        categoryId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewSubCatName('');
      fetchSubCategories(categoryId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create subcategory');
    }
  };

  // Delete SubCategory Handler
  const handleDeleteSubCategory = async (subCatId, categoryId) => {
    if (!window.confirm('Delete this subcategory?')) return;
    try {
      await axios.delete(`${API_URL}/subcategories/${subCatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSubCategories(categoryId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete subcategory');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-purple-100 pb-4">
        <h1 className="font-display font-extrabold text-2xl text-purple-950">Categories Manager</h1>
        <p className="text-xs text-purple-400 font-semibold mt-1">Add, update, or remove website product categories and subcategories</p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <FiCheckCircle size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Side: Create Form */}
        <form onSubmit={handleCreateCategory} className="md:col-span-5 bg-white p-6 rounded-3xl border border-purple-100/75 shadow-sm space-y-4 h-fit">
          <div className="flex items-center gap-2 text-sm font-bold text-purple-950 uppercase tracking-wide border-b border-purple-50 pb-2">
            <FiLayers className="text-primary" />
            <span>Create Category</span>
          </div>

          <div>
            <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Category Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Silk Sarees"
              className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm text-purple-950 placeholder-purple-300 font-semibold"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Custom Slug (Optional)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. silk-sarees"
              className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm text-purple-950 placeholder-purple-300 font-semibold"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Image URL (Optional)</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="e.g. https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm text-purple-950 placeholder-purple-300 font-semibold"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-primary hover:bg-primary-light text-white text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            <FiPlus /> Create Category
          </button>
        </form>

        {/* Right Side: Category List with Subcategories */}
        <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-purple-100/75 shadow-sm space-y-4">
          <div className="border-b border-purple-50 pb-2 flex justify-between items-center">
            <h3 className="font-display font-extrabold text-purple-950 text-base">Active Categories</h3>
            <span className="px-2.5 py-0.5 bg-purple-50 text-primary text-[10px] font-bold uppercase rounded-lg">
              {categories.length} total
            </span>
          </div>

          <div className="space-y-3">
            {categories.map((cat) => {
              const catId = cat.id || cat._id;
              const isExpanded = expandedCategory === catId;
              const catSubCats = subCategories[catId] || [];
              const isSubLoading = subCatLoading[catId];

              return (
                <div key={catId} className="border border-purple-100 rounded-2xl overflow-hidden">
                  {/* Category Row */}
                  <div className="flex items-center gap-3 p-3 hover:bg-purple-50/30 transition-colors">
                    <button
                      type="button"
                      onClick={() => toggleExpand(catId)}
                      className="p-1 text-purple-400 hover:text-primary transition-colors"
                    >
                      {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                    </button>
                    <img
                      src={cat.image || '/placeholder-category.png'}
                      alt={cat.name}
                      className="w-10 h-10 object-cover rounded-lg border border-purple-100"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-sm text-purple-950 block">{cat.name}</span>
                      <span className="font-mono text-[10px] text-purple-400">{cat.slug}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(catId)}
                      className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition-colors"
                      title="Delete Category"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>

                  {/* Subcategories Panel (Expandable) */}
                  {isExpanded && (
                    <div className="bg-purple-50/30 border-t border-purple-100 p-4 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-950 uppercase tracking-wider">
                        <FiTag size={12} className="text-primary" />
                        <span>Subcategories</span>
                      </div>

                      {isSubLoading ? (
                        <div className="flex justify-center py-4">
                          <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : (
                        <>
                          {/* Existing Subcategories */}
                          {catSubCats.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {catSubCats.map((sc) => (
                                <span
                                  key={sc._id || sc.id}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-purple-100 rounded-full text-xs font-bold text-primary shadow-sm"
                                >
                                  <span>{sc.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSubCategory(sc._id || sc.id, catId)}
                                    className="text-red-400 hover:text-red-600 transition-colors"
                                  >
                                    <FiTrash2 size={11} />
                                  </button>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[10px] text-purple-400 italic">No subcategories yet. Add one below.</p>
                          )}

                          {/* Add Subcategory Input */}
                          <div className="flex items-center gap-2 pt-2">
                            <input
                              type="text"
                              placeholder="e.g. Shirts, Pants, Kurtas"
                              value={expandedCategory === catId ? newSubCatName : ''}
                              onChange={(e) => setNewSubCatName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleCreateSubCategory(catId);
                                }
                              }}
                              className="flex-1 px-3 py-2 bg-white border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-xs text-purple-950 placeholder-purple-300 font-semibold"
                            />
                            <button
                              type="button"
                              onClick={() => handleCreateSubCategory(catId)}
                              className="px-3 py-2 bg-purple-950 hover:bg-purple-900 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm shrink-0"
                            >
                              <FiPlus size={12} /> Add
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
