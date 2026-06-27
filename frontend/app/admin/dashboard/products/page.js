'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import axios from 'axios';
import { useAuth } from '../../../../context/AuthContext';
import { FiPlus, FiTrash2, FiEdit, FiSearch } from 'react-icons/fi';
import { API_URL } from '../../../../utils/api';

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching admin products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [API_URL]);

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action is permanent.`)) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter((p) => p._id !== id));
      alert('Product deleted successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting product');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-purple-100 pb-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-purple-950">Products Manager</h1>
          <p className="text-xs text-purple-400 font-semibold mt-1">Manage catalog listings and stock replenishment</p>
        </div>
        <NextLink
          href="/admin/dashboard/products/add"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary-light text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0"
        >
          <FiPlus size={16} />
          <span>Upload Product</span>
        </NextLink>
      </div>

      {/* Search Bar filter */}
      <div className="bg-white p-4 rounded-2xl border border-purple-100/75 shadow-sm max-w-md relative">
        <input
          type="text"
          placeholder="Filter by name, SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-400 text-purple-950 font-medium"
        />
        <FiSearch className="absolute left-7 top-5.5 text-purple-400" size={16} />
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-3xl border border-purple-100/75 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-purple-400 italic text-sm">
            No products found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-purple-950 divide-y divide-purple-100">
              <thead>
                <tr className="text-purple-400 font-bold uppercase tracking-wider text-[9px] bg-purple-50/30">
                  <th className="py-4 pl-4.5">Product Details</th>
                  <th className="py-4">SKU</th>
                  <th className="py-4">Category</th>
                  <th className="py-4">Price</th>
                  <th className="py-4">Stock</th>
                  <th className="py-4">Status</th>
                  <th className="py-4 pr-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50 font-medium">
                {filteredProducts.map((p) => {
                  const hasDiscount = p.discountPrice > 0 && p.discountPrice < p.price;
                  return (
                    <tr key={p._id} className="hover:bg-purple-50/20">
                      
                      {/* Product details */}
                      <td className="py-3 pl-4.5 flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-9 h-11 object-cover object-top rounded-md border border-purple-50 shrink-0" />
                        <span className="font-bold text-purple-950 truncate max-w-[180px] block" title={p.name}>{p.name}</span>
                      </td>

                      <td className="py-3 font-mono text-purple-900 font-bold">{p.sku}</td>
                      <td className="py-3 text-amber-600 font-bold uppercase text-[10px] tracking-wide">{p.category}</td>
                      <td className="py-3">
                        <p className="font-display font-extrabold text-sm text-purple-950">₹{(hasDiscount ? p.discountPrice : p.price).toLocaleString('en-IN')}</p>
                        {hasDiscount && <p className="text-[10px] text-purple-400 line-through">₹{p.price.toLocaleString('en-IN')}</p>}
                      </td>
                      <td className="py-3 font-bold text-purple-900">{p.stockQuantity}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                          p.stockQuantity > 0 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                          {p.stockQuantity > 0 ? 'Available' : 'Out of Stock'}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 pr-4.5 text-right">
                        <div className="flex justify-end gap-2.5">
                          <button
                            onClick={() => handleDeleteProduct(p._id, p.name)}
                            className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
