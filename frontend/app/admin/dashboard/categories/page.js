'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../../context/AuthContext';
import { API_URL } from '../../../../utils/api';
import { FiPlus, FiTrash2, FiLayers, FiCheckCircle } from 'react-icons/fi';

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
        <p className="text-xs text-purple-400 font-semibold mt-1">Add, update, or remove website product categories</p>
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

        {/* Right Side: Category List Table */}
        <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-purple-100/75 shadow-sm space-y-4">
          <div className="border-b border-purple-50 pb-2 flex justify-between items-center">
            <h3 className="font-display font-extrabold text-purple-950 text-base">Active Categories</h3>
            <span className="px-2.5 py-0.5 bg-purple-50 text-primary text-[10px] font-bold uppercase rounded-lg">
              {categories.length} total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-purple-950 divide-y divide-purple-100">
              <thead>
                <tr className="text-purple-400 font-bold uppercase tracking-wider text-[9px]">
                  <th className="pb-3 pl-2">Preview</th>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Slug</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50 font-medium">
                {categories.map((cat) => (
                  <tr key={cat.id || cat._id} className="hover:bg-purple-50/20">
                    <td className="py-2.5 pl-2">
                      <img
                        src={cat.image || '/placeholder-category.png'}
                        alt={cat.name}
                        className="w-10 h-10 object-cover rounded-lg border border-purple-100"
                      />
                    </td>
                    <td className="py-2.5 font-bold text-purple-950">{cat.name}</td>
                    <td className="py-2.5 font-mono text-[10px] text-purple-500">{cat.slug}</td>
                    <td className="py-2.5 text-right pr-2">
                      <button
                        onClick={() => handleDeleteCategory(cat.id || cat._id)}
                        className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition-colors"
                        title="Delete Category"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
