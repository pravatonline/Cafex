'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Star, 
  Sparkles, 
  Check, 
  X 
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { mockProducts, mockCategories } from '@/lib/mockData';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function AdminMenuPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // New product form
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(mockCategories[0].id);
  const [basePrice, setBasePrice] = useState('5.50');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80');
  const [description, setDescription] = useState('');

  const toggleAvailability = (id: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, is_available: !p.is_available } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = mockCategories.find(c => c.id === categoryId);
    const newProd: Product = {
      id: `p-${Date.now()}`,
      category_id: categoryId,
      category_name: cat ? cat.name : 'Specialty',
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description || name,
      base_price: Number(basePrice),
      sale_price: null,
      sku: `CFX-${Date.now().toString().slice(-4)}`,
      image_url: imageUrl,
      is_available: true,
      is_featured: false,
      is_chef_special: false,
      preparation_time_minutes: 8,
      calories: 140,
      dietary_flags: { is_vegan: false, is_gluten_free: false, is_dairy_free: false, is_keto: false, is_vegetarian: true },
      nutrition_facts: { fat: '0g', carbs: '0g', protein: '0g', sugar: '0g' },
      allergens: [],
      rating_avg: 5.0,
      rating_count: 0
    };

    setProducts([newProd, ...products]);
    setModalOpen(false);
    setName('');
    setDescription('');
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Menu & Product Management"
        subtitle="Configure menu prices, culinary items, availability toggles, and inventory."
      />

      <div className="p-8 space-y-6 max-w-7xl">
        
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#161412] border border-neutral-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by product name, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-700 bg-neutral-900 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Menu Item
          </button>
        </div>

        {/* Product Table */}
        <div className="rounded-3xl bg-[#161412] border border-neutral-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-900/80 border-b border-neutral-800">
                <tr>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">SKU</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Rating</th>
                  <th className="py-4 px-4">In Stock</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3 font-semibold text-white">
                      <img src={item.image_url} alt={item.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                      <div>
                        <span className="block truncate max-w-xs">{item.name}</span>
                        {item.is_chef_special && (
                          <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Chef&apos;s Pick
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-neutral-400">{item.category_name}</td>
                    <td className="py-4 px-4 font-mono text-neutral-500">{item.sku}</td>
                    <td className="py-4 px-4 font-bold text-white">
                      {formatCurrency(item.sale_price || item.base_price)}
                    </td>
                    <td className="py-4 px-4 text-neutral-300">
                      ★ {item.rating_avg.toFixed(1)} ({item.rating_count})
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleAvailability(item.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                          item.is_available
                            ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {item.is_available ? 'Available' : 'Sold Out'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => deleteProduct(item.id)}
                        className="p-1.5 rounded-lg hover:bg-red-950/40 text-neutral-400 hover:text-red-400 transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#161412] border border-neutral-800 p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="font-serif font-bold text-lg text-white">Add New Menu Item</h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vanilla Bean Iced Shakerato"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-700 bg-neutral-900 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-700 bg-neutral-900 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {mockCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">Base Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-700 bg-neutral-900 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-700 bg-neutral-900 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe tasting notes, roast profile, or pastry texture..."
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-700 bg-neutral-900 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs uppercase tracking-wider"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
