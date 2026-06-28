'use client';
import { API_URL } from '../../../../../utils/api';


import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { FiSave, FiUploadCloud, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

export default function AddProductPage() {
  const { token, logout } = useAuth();
  const router = useRouter();

  // Form States
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [subCategory, setSubCategory] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [sku, setSku] = useState('');
  const [featured, setFeatured] = useState(false);

  // Jewellery specific specs
  const [grams, setGrams] = useState('');
  const [cost, setCost] = useState('');

  // Fetch dynamic categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get(`${API_URL}/categories`);
        setCategories(res.data);
        if (res.data.length > 0) {
          setCategory(res.data[0].name);
        }
      } catch (err) {
        console.warn('Failed to load categories:', err.message || err);
        if (err.response?.status === 401) {
          logout();
          router.replace('/admin/login');
        }
      }
    };
    fetchCats();
  }, [logout, router]);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubCats = async () => {
      if (!category) { setSubCategories([]); return; }
      try {
        const cat = categories.find(c => c.name === category);
        if (cat) {
          const res = await axios.get(`${API_URL}/subcategories?categoryId=${cat.id || cat._id}`);
          setSubCategories(res.data);
          setSubCategory('');
        }
      } catch (err) {
        console.warn('Failed to load subcategories:', err.message || err);
        if (err.response?.status === 401) {
          logout();
          router.replace('/admin/login');
        }
      }
    };
    fetchSubCats();
  }, [category, categories, logout, router]);

  // Size specifications
  const availableSizesList = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size', 'Adjustable'];
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Color specifications
  const [colorInput, setColorInput] = useState('');
  const [colorsList, setColorsList] = useState([]);
  const [colorImageUrl, setColorImageUrl] = useState('');
  const [colorImageUploading, setColorImageUploading] = useState(false);

  // Image upload lists
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [pastedUrl, setPastedUrl] = useState('');

  

  // Generate a mock SKU on name load if empty
  useEffect(() => {
    if (name && !sku) {
      const initials = name.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'PRD');
      const randomPart = Math.floor(1000 + Math.random() * 9000);
      setSku(`${initials}-${randomPart}`);
    }
  }, [name, sku]);

  // Handle Size Toggle
  const handleSizeToggle = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  // Handle Color Add
  const handleAddColor = (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (!colorInput.trim()) return;

    const imgToUse = colorImageUrl.trim() || (imageUrls.length > 0 ? imageUrls[0] : '');

    const exists = colorsList.some(c => c.name.toLowerCase() === colorInput.trim().toLowerCase());
    if (!exists) {
      setColorsList([...colorsList, { name: colorInput.trim(), image: imgToUse }]);
      setColorInput('');
      setColorImageUrl('');
    }
  };

  const handleColorImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setColorImageUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    try {
      const response = await axios.post(`${API_URL}/products/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      if (response.data.urls && response.data.urls.length > 0) {
        setColorImageUrl(response.data.urls[0]);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Color image upload failed');
    } finally {
      setColorImageUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveColor = (idx) => {
    setColorsList(colorsList.filter((_, i) => i !== idx));
  };

  // Handle direct file uploads to backend
  const handleImageFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await axios.post(`${API_URL}/products/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      // Merge upload links with existing image list
      setImageUrls([...imageUrls, ...response.data.urls]);
    } catch (error) {
      alert(error.response?.data?.message || 'File upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Handle pasting direct URLs (flexible option)
  const handleAddPastedUrl = (e) => {
    e.preventDefault();
    if (pastedUrl.trim() && !imageUrls.includes(pastedUrl.trim())) {
      setImageUrls([...imageUrls, pastedUrl.trim()]);
      setPastedUrl('');
    }
  };

  const handleRemoveImageUrl = (idx) => {
    setImageUrls(imageUrls.filter((_, i) => i !== idx));
  };

  // Form Submit Add Product
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (imageUrls.length === 0) {
      alert('Please upload at least one product image');
      return;
    }

    try {
      const payload = {
        name,
        category,
        subCategory: subCategory || null,
        description,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : 0,
        stockQuantity: Number(stockQuantity),
        sku,
        featured,
        sizes: selectedSizes,
        colors: colorsList,
        images: imageUrls,
        grams: category.toLowerCase() === 'jewellery' ? grams : null,
        cost: category.toLowerCase() === 'jewellery' && cost ? Number(cost) : null,
      };

      await axios.post(`${API_URL}/products`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Product created successfully');
      router.push('/admin/dashboard/products');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save product');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-purple-950">Upload Product</h1>
        <p className="text-xs text-purple-400 font-semibold mt-1">Upload premium sarees, ethnic kurtas, jewellery or kids apparel</p>
      </div>

      <form onSubmit={handleFormSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100/75 shadow-sm space-y-6">
        
        {/* Core fields info */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
          
          <div className="sm:col-span-8">
            <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Product Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Traditional Royal Kundan Choker Saree Set"
              className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm text-purple-950 cursor-pointer font-semibold"
            >
              {categories.map((cat) => (
                <option key={cat.id || cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {subCategories.length > 0 && (
            <div>
              <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Subcategory</label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm text-purple-950 cursor-pointer font-semibold"
              >
                <option value="">Select Subcategory</option>
                {subCategories.map((sc) => (
                  <option key={sc._id || sc.id} value={sc.name}>{sc.name}</option>
                ))}
              </select>
            </div>
          )}

        </div>

        {/* Jewellery Specific Fields Section */}
        {category.toLowerCase() === 'jewellery' && (
          <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-100 space-y-4 animate-float-slow">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800 uppercase tracking-wider">
              <span>✨ Jewellery Specifications Section</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Weight in Grams</label>
                <input
                  type="text"
                  value={grams}
                  onChange={(e) => setGrams(e.target.value)}
                  placeholder="e.g. 15.6g"
                  className="w-full px-3.5 py-2.5 bg-white border border-amber-200 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950 font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Making Cost / Additional Charge (₹)</label>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="e.g. 1200"
                  className="w-full px-3.5 py-2.5 bg-white border border-amber-200 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950 font-semibold"
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Description</label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write detailing details about fabric material, handloom weaves, plated layers, sizing guides, etc."
            className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950"
          />
        </div>

        {/* Pricing, stock, sku row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Original Price (₹)</label>
            <input
              type="number"
              required
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 2999"
              className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Discount Price (₹)</label>
            <input
              type="number"
              min={0}
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              placeholder="e.g. 1999"
              className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Stock Quantity</label>
            <input
              type="number"
              required
              min={0}
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              placeholder="e.g. 50"
              className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Product SKU</label>
            <input
              type="text"
              required
              value={sku}
              onChange={(e) => setSku(e.target.value.toUpperCase())}
              placeholder="e.g. JSV-SLK-101"
              className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950 font-mono"
            />
          </div>
        </div>

        {/* Sizes checkboxes */}
        <div className="space-y-3 pt-4 border-t border-purple-50">
          <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">Available Sizes</span>
          <div className="flex flex-wrap gap-2.5">
            {availableSizesList.map((sz) => {
              const checked = selectedSizes.includes(sz);
              return (
                <button
                  type="button"
                  key={sz}
                  onClick={() => handleSizeToggle(sz)}
                  className={`px-4 py-2 border rounded-xl text-xs font-semibold transition-all ${
                    checked
                      ? 'border-primary bg-primary text-white shadow-sm'
                      : 'border-purple-100 bg-purple-50/10 text-purple-950 hover:border-purple-300'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>

        {/* Colors selector with image upload */}
        <div className="space-y-3 pt-4 border-t border-purple-50">
          <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">Available Colors (with Product Image)</span>
          
          <div className="space-y-3 max-w-lg">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. Royal Blue"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddColor(e); } }}
                className="flex-1 px-3.5 py-2 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-xs text-purple-950 placeholder-purple-300"
              />
            </div>
            
            {/* Color image upload/paste */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleColorImageUpload}
                  disabled={colorImageUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="px-3.5 py-2 bg-purple-50/50 border border-dashed border-purple-200 rounded-xl text-xs text-purple-400 font-semibold text-center">
                  {colorImageUploading ? 'Uploading...' : colorImageUrl ? '✓ Image ready' : 'Upload color image'}
                </div>
              </div>
              <span className="text-purple-300 text-xs">or</span>
              <input
                type="text"
                placeholder="Paste image URL"
                value={colorImageUrl}
                onChange={(e) => setColorImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-xs text-purple-950 placeholder-purple-300"
              />
            </div>

            {colorImageUrl && (
              <div className="w-16 h-20 rounded-lg overflow-hidden border border-purple-100 shadow-sm">
                <img src={colorImageUrl} alt="Color preview" className="w-full h-full object-cover object-top" />
              </div>
            )}

            <button
              type="button"
              onClick={handleAddColor}
              className="px-4 py-2 bg-purple-950 hover:bg-purple-900 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm"
            >
              <FiPlus /> Add Color
            </button>
          </div>

          {colorsList.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2">
              {colorsList.map((col, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-xl text-xs font-bold text-primary"
                >
                  {col.image && (
                    <img src={col.image} alt={col.name} className="w-8 h-10 object-cover rounded-lg border border-purple-100" />
                  )}
                  <span>{col.name}</span>
                  <button type="button" onClick={() => handleRemoveColor(idx)} className="text-red-500 hover:text-red-700 ml-1">
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Image upload manager */}
        <div className="space-y-4 pt-4 border-t border-purple-50">
          <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">Product Gallery Images (Upload up to 5)</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* File upload drag field */}
            <div className="relative border-2 border-dashed border-purple-100 rounded-3xl p-6 text-center hover:border-primary/50 transition-colors flex flex-col items-center justify-center bg-purple-50/10">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageFileChange}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FiUploadCloud size={32} className="text-purple-400 mb-2" />
              <p className="text-xs font-bold text-purple-950">
                {uploading ? 'Uploading assets...' : 'Choose files to upload'}
              </p>
              <p className="text-[10px] text-purple-300 mt-1">PNG, JPG, JPEG, WEBP up to 5MB</p>
            </div>

            {/* Paste URL field */}
            <div className="p-5 border border-purple-100 rounded-3xl flex flex-col justify-center gap-3 bg-purple-50/10">
              <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wider">Or Paste Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://example.com/saree-img.jpg"
                  value={pastedUrl}
                  onChange={(e) => setPastedUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-xs text-purple-950 placeholder-purple-300"
                />
                <button
                  type="button"
                  onClick={handleAddPastedUrl}
                  className="px-4 py-2 bg-purple-950 hover:bg-purple-900 text-white text-xs font-bold rounded-xl shadow-sm shrink-0"
                >
                  Link
                </button>
              </div>
            </div>

          </div>

          {/* Render preview list of currently added image links */}
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-3">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="relative aspect-[4/5] rounded-xl overflow-hidden border border-purple-100 group shadow-sm bg-purple-50">
                  <img src={url} alt="" className="w-full h-full object-cover object-top" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImageUrl(idx)}
                    className="absolute inset-0 bg-red-600/75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl text-white"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured toggle */}
        <div className="pt-6 border-t border-purple-50 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-purple-950 uppercase tracking-wide block">Featured Product Spotlight</span>
            <p className="text-[10px] text-purple-400 font-semibold">Flag this product to appear in weekly showcase lists on homepage</p>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-purple-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-purple-300 after:border after:rounded-full after:height-5 after:width-5 after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>

        {/* Save button */}
        <div className="pt-6 border-t border-purple-50 flex justify-end">
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-6 py-3 bg-primary hover:bg-primary-light text-white font-extrabold rounded-2xl shadow-md transition-colors"
          >
            <FiSave size={18} />
            <span>Upload to Catalog</span>
          </button>
        </div>

      </form>


    </div>
  );
}
