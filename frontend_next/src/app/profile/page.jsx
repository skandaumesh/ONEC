"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
 User, Mail, Phone, MapPin, Package, Edit3, Save, Trash2, Plus,
 Shield, Bell, ChevronRight, LogOut, Camera
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { userApi } from '@/api';
import { PageTransition, SlideUp, FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';

const demoProfile = {
 firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '+91 98765 43210',
 addresses: [
 { id: 1, addressLine1: '123, Green Park Colony', addressLine2: 'Near City Hospital', city: 'Hyderabad', state: 'Telangana', zipCode: '500001', isDefault: true },
 ],
};

export default function ProfilePage() {
 const { user, logout } = useAuth();
 const { success, error: showError } = useToast();

 const [profile, setProfile] = useState(null);
 const [editing, setEditing] = useState(false);
 const [editForm, setEditForm] = useState({ firstName: '', lastName: '', phone: '' });
 const [addresses, setAddresses] = useState([]);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [activeTab, setActiveTab] = useState('profile');
 const [showAddAddress, setShowAddAddress] = useState(false);
 const [newAddress, setNewAddress] = useState({ addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '' });

 useEffect(() => {
 fetchProfile();
 }, []);

 const fetchProfile = async () => {
 setLoading(true);
 try {
 const res = await userApi.getProfile();
 const data = res.data.data || res.data;
 setProfile(data);
 setEditForm({ firstName: data.firstName, lastName: data.lastName, phone: data.phone || '' });
 setAddresses(data.addresses || []);
 } catch {
  let userFirstName = user?.firstName;
  let userLastName = user?.lastName;
  if (user?.name) {
  const parts = user.name.split(' ');
  userFirstName = parts[0];
  userLastName = parts.slice(1).join(' ') || '';
  }
  const p = { 
  ...demoProfile, 
  ...(user || {}),
  firstName: userFirstName || user?.firstName || demoProfile.firstName,
  lastName: userLastName || user?.lastName || demoProfile.lastName,
  email: user?.email || demoProfile.email
  };
  setProfile(p);
  setEditForm({ firstName: p.firstName || '', lastName: p.lastName || '', phone: p.phone || '' });
  setAddresses(p.addresses || demoProfile.addresses);
 } finally {
 setLoading(false);
 }
 };

 const handleSaveProfile = async () => {
 setSaving(true);
 try {
 await userApi.updateProfile(editForm);
 success('Profile updated successfully!');
 } catch {
 success('Profile updated! (Demo mode)');
 }
 setProfile(prev => ({ ...prev, ...editForm }));
 setEditing(false);
 setSaving(false);
 };

 const handleAddAddress = async () => {
 if (!newAddress.addressLine1 || !newAddress.city || !newAddress.zipCode) {
 showError('Please fill required fields');
 return;
 }
 try {
 await userApi.addAddress(newAddress);
 success('Address added!');
 fetchProfile();
 } catch {
 const addr = { ...newAddress, id: Date.now(), isDefault: addresses.length === 0 };
 setAddresses(prev => [...prev, addr]);
 success('Address added! (Demo mode)');
 }
 setShowAddAddress(false);
 setNewAddress({ addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '' });
 };

 const handleDeleteAddress = async (id) => {
 try {
 await userApi.deleteAddress(id);
 success('Address removed');
 } catch {
 success('Address removed (Demo mode)');
 }
 setAddresses(prev => prev.filter(a => a.id !== id));
 };

 const tabs = [
 { id: 'profile', label: 'Profile', icon: <User size={16} /> },
 { id: 'addresses', label: 'Addresses', icon: <MapPin size={16} /> },
 { id: 'settings', label: 'Settings', icon: <Shield size={16} /> },
 ];

 if (loading) {
 return (
 <div className="max-w-4xl mx-auto px-4 py-8">
 <div className="h-32 skeleton rounded-2xl mb-6" />
 <div className="h-64 skeleton rounded-2xl" />
 </div>
 );
 }

 const p = profile || demoProfile;

 return (
 <PageTransition>
 <div className="max-w-4xl mx-auto px-4 py-8">
 {/* Profile Header */}
 <SlideUp>
 <div className="rounded-2xl overflow-hidden mb-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
 <div className="h-24 gradient-primary relative">
 <div className="absolute -bottom-10 left-6">
 <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4" style={{ borderColor: 'var(--bg-surface)' }}>
 {(p.firstName?.charAt(0) || 'U').toUpperCase()}
 </div>
 </div>
 </div>
 <div className="pt-14 pb-5 px-6">
 <div className="flex flex-wrap justify-between items-start gap-3">
 <div>
 <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
 {p.firstName} {p.lastName}
 </h1>
 <p className="text-sm flex items-center gap-1.5 mt-1" style={{ color: 'var(--text-secondary)' }}>
 <Mail size={14} /> {p.email}
 </p>
 {p.phone && (
 <p className="text-sm flex items-center gap-1.5 mt-0.5" style={{ color: 'var(--text-secondary)' }}>
 <Phone size={14} /> {p.phone}
 </p>
 )}
 </div>
 <button
 onClick={() => { if (editing) handleSaveProfile(); else setEditing(true); }}
 className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
 editing ? 'gradient-primary text-white' : ''
 }`}
 style={!editing ? { border: '1px solid var(--border-color)', color: 'var(--text-primary)' } : {}}
 >
 {editing ? <><Save size={16} /> Save</> : <><Edit3 size={16} /> Edit Profile</>}
 </button>
 </div>
 </div>
 </div>
 </SlideUp>

 {/* Tabs */}
 <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
 {tabs.map(tab => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id)}
 className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
 activeTab === tab.id ? 'gradient-primary text-white shadow-md' : ''
 }`}
 style={activeTab !== tab.id ? { color: 'var(--text-secondary)', background: 'var(--bg-surface)', border: '1px solid var(--border-color)' } : {}}
 >
 {tab.icon} {tab.label}
 </button>
 ))}
 </div>

 {/* Tab Content */}
 <FadeIn key={activeTab}>
 {/* Profile Tab */}
 {activeTab === 'profile' && (
 <div className="rounded-2xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
 <h2 className="text-lg font-bold mb-5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
 Personal Information
 </h2>
 <div className="grid sm:grid-cols-2 gap-4">
 <div>
 <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>First Name</label>
 {editing ? (
 <input value={editForm.firstName} onChange={e => setEditForm({...editForm, firstName: e.target.value})}
 className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30"
 style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
 ) : (
 <p className="px-4 py-2.5 rounded-xl text-sm" style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-primary)' }}>
 {p.firstName}
 </p>
 )}
 </div>
 <div>
 <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Last Name</label>
 {editing ? (
 <input value={editForm.lastName} onChange={e => setEditForm({...editForm, lastName: e.target.value})}
 className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30"
 style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
 ) : (
 <p className="px-4 py-2.5 rounded-xl text-sm" style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-primary)' }}>
 {p.lastName}
 </p>
 )}
 </div>
 <div>
 <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Email</label>
 <p className="px-4 py-2.5 rounded-xl text-sm" style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-muted)' }}>
 {p.email}
 </p>
 </div>
 <div>
 <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Phone</label>
 {editing ? (
 <input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})}
 className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30"
 style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
 ) : (
 <p className="px-4 py-2.5 rounded-xl text-sm" style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-primary)' }}>
 {p.phone || 'Not set'}
 </p>
 )}
 </div>
 </div>
 {editing && (
 <div className="flex gap-3 mt-6">
 <button onClick={handleSaveProfile} disabled={saving}
 className="px-6 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold">
 {saving ? 'Saving...' : 'Save Changes'}
 </button>
 <button onClick={() => setEditing(false)}
 className="px-6 py-2.5 rounded-xl text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
 Cancel
 </button>
 </div>
 )}
 </div>
 )}

 {/* Addresses Tab */}
 {activeTab === 'addresses' && (
 <div className="space-y-4">
 <StaggerContainer className="space-y-3">
 {addresses.map(addr => (
 <StaggerItem key={addr.id}>
 <div className="rounded-2xl p-5 flex items-start justify-between gap-3"
 style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
 <div className="flex items-start gap-3">
 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
 <MapPin size={18} className="text-primary" />
 </div>
 <div>
 <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{addr.addressLine1}</p>
 {addr.addressLine2 && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{addr.addressLine2}</p>}
 <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
 {addr.city}, {addr.state} - {addr.zipCode}
 </p>
 {addr.isDefault && (
 <span className="inline-block mt-2 text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Default</span>
 )}
 </div>
 </div>
 <button onClick={() => handleDeleteAddress(addr.id)}
 className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
 <Trash2 size={16} />
 </button>
 </div>
 </StaggerItem>
 ))}
 </StaggerContainer>

 {showAddAddress ? (
 <div className="rounded-2xl p-5 space-y-3" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
 <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Add New Address</h3>
 <input placeholder="Address Line 1 *" value={newAddress.addressLine1}
 onChange={e => setNewAddress({...newAddress, addressLine1: e.target.value})}
 className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
 style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
 <input placeholder="Address Line 2" value={newAddress.addressLine2}
 onChange={e => setNewAddress({...newAddress, addressLine2: e.target.value})}
 className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
 style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
 <div className="grid grid-cols-3 gap-3">
 <input placeholder="City *" value={newAddress.city}
 onChange={e => setNewAddress({...newAddress, city: e.target.value})}
 className="px-3 py-2.5 rounded-xl text-sm outline-none"
 style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
 <input placeholder="State" value={newAddress.state}
 onChange={e => setNewAddress({...newAddress, state: e.target.value})}
 className="px-3 py-2.5 rounded-xl text-sm outline-none"
 style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
 <input placeholder="ZIP *" value={newAddress.zipCode}
 onChange={e => setNewAddress({...newAddress, zipCode: e.target.value})}
 className="px-3 py-2.5 rounded-xl text-sm outline-none"
 style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
 </div>
 <div className="flex gap-2">
 <button onClick={handleAddAddress} className="px-5 py-2 rounded-xl gradient-primary text-white text-sm font-semibold">Save</button>
 <button onClick={() => setShowAddAddress(false)} className="px-5 py-2 rounded-xl text-sm" style={{ color: 'var(--text-secondary)' }}>Cancel</button>
 </div>
 </div>
 ) : (
 <button onClick={() => setShowAddAddress(true)}
 className="w-full p-4 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 text-sm font-medium text-primary hover:bg-primary/5 transition-all"
 style={{ borderColor: 'var(--border-color)' }}>
 <Plus size={18} /> Add New Address
 </button>
 )}
 </div>
 )}

 {/* Settings Tab */}
 {activeTab === 'settings' && (
 <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
 {[
 { icon: <Bell size={18} />, label: 'Email Notifications', desc: 'Receive order updates via email', toggle: true },
 { icon: <Phone size={18} />, label: 'SMS Alerts', desc: 'Get SMS for order status changes', toggle: true },
 { icon: <Shield size={18} />, label: 'Change Password', desc: 'Update your account password', action: true },
 { icon: <Package size={18} />, label: 'Order Preferences', desc: 'Default delivery and payment preferences', action: true },
 ].map((item, i) => (
 <div key={i} className="flex items-center justify-between p-5 border-b last:border-0" style={{ borderColor: 'var(--border-color)' }}>
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">{item.icon}</div>
 <div>
 <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
 <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
 </div>
 </div>
 {item.toggle ? (
 <label className="relative inline-flex items-center cursor-pointer">
 <input type="checkbox" defaultChecked className="sr-only peer" />
 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
 </label>
 ) : (
 <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
 )}
 </div>
 ))}

 <button onClick={logout}
 className="w-full p-5 flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors border-t"
 style={{ borderColor: 'var(--border-color)' }}>
 <LogOut size={18} />
 <span className="text-sm font-semibold">Logout</span>
 </button>
 </div>
 )}
 </FadeIn>
 </div>
 </PageTransition>
 );
}
