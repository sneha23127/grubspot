import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function OwnerPanel() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 3, 2)); // April 2, 2026

  // Get user from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'mess_owner') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'mess_owner') {
    return null; // Or a loading spinner
  }

  // Real Data Only - No Dummy Data
  const [messInfo, setMessInfo] = useState({
    id: user?.id,
    name: user?.mess_name || "New Mess",
    owner: user?.name || "",
    initials: (user?.name || "N").split(' ').map(n => n[0]).join('').toUpperCase(),
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.address || "Not set",
    type: user?.details?.type || "Standard",
    tag: user?.details?.tag || "GENERAL",
    activeSubscribers: user?.details?.activeSubscribers || 0,
    totalSlots: user?.details?.totalSlots || 0,
    todayRevenue: user?.details?.todayRevenue || 0,
    avgRating: user?.details?.avgRating || 0,
    totalReviews: user?.details?.totalReviews || 0,
    joined: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently Joined",
    pricing: user?.details?.pricing || { breakfast: 0, lunch: 0, dinner: 0 },
    timings: user?.details?.timings || { breakfast: "7:30 AM - 10:00 AM", lunch: "12:30 PM - 3:00 PM", dinner: "7:30 PM - 10:00 PM" },
    subscriptionPlans: user?.details?.subscriptionPlans || { trial: 0, oneMonth: 0, threeMonth: 0 },
    homeDelivery: user?.details?.homeDelivery || false
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editOwnerData, setEditOwnerData] = useState({ ...messInfo });

  const [menuData, setMenuData] = useState(user.menu_data || {
    'Mon': { breakfast: [], lunch: [], dinner: [] },
    'Tue': { breakfast: [], lunch: [], dinner: [] },
    'Wed': { breakfast: [], lunch: [], dinner: [] },
    'Thu': { breakfast: [], lunch: [], dinner: [] },
    'Fri': { breakfast: [], lunch: [], dinner: [] },
    'Sat': { breakfast: [], lunch: [], dinner: [] },
    'Sun': { breakfast: [], lunch: [], dinner: [] },
  });

  const [activeDay, setActiveDay] = useState(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()]);
  const [newItemInputs, setNewItemInputs] = useState({ breakfast: '', lunch: '', dinner: '' });

  const saveProfile = async () => {
    try {
      const details = {
        type: editOwnerData.type,
        tag: editOwnerData.tag,
        activeSubscribers: editOwnerData.activeSubscribers,
        totalSlots: editOwnerData.totalSlots,
        avgRating: editOwnerData.avgRating,
        totalReviews: editOwnerData.totalReviews,
        pricing: editOwnerData.pricing,
        timings: editOwnerData.timings,
        subscriptionPlans: editOwnerData.subscriptionPlans,
        homeDelivery: editOwnerData.homeDelivery
      };

      const res = await axios.post('http://localhost:5000/api/users/update-profile', {
        id: messInfo.id,
        name: editOwnerData.owner,
        mess_name: editOwnerData.name,
        phone: editOwnerData.phone,
        address: editOwnerData.location,
        email: editOwnerData.email,
        details: details
      });

      if (res.data.status === 'success') {
        const updatedUser = res.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setMessInfo({ 
          ...messInfo,
          ...editOwnerData, 
          initials: editOwnerData.owner.split(' ').map(n => n[0]).join('').toUpperCase() 
        });
        setIsEditingProfile(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  const saveMenu = async (updatedMenu) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/update-menu', {
        id: messInfo.id,
        menu_data: updatedMenu
      });

      if (res.data.status === 'success') {
        const updatedUser = { ...user, menu_data: updatedMenu };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setMenuData(updatedMenu);
        console.log('Menu updated in DB and LocalStorage');
      }
    } catch (error) {
      console.error('Error updating menu:', error);
      alert('Error saving menu. Please check your connection.');
    }
  };

  const handleUpdateItemStatus = (mealType, itemId) => {
    const updatedMenu = { ...menuData };
    const items = updatedMenu[activeDay][mealType];
    const itemIndex = items.findIndex(i => i.id === itemId);
    
    if (itemIndex > -1) {
      items[itemIndex].status = items[itemIndex].status === 'Available' ? 'Unavailable' : 'Available';
      saveMenu(updatedMenu);
    }
  };

  const handleAddItem = (mealType) => {
    const name = newItemInputs[mealType];
    if (name.trim()) {
      const updatedMenu = { ...menuData };
      if (!updatedMenu[activeDay]) updatedMenu[activeDay] = { breakfast: [], lunch: [], dinner: [] };
      if (!updatedMenu[activeDay][mealType]) updatedMenu[activeDay][mealType] = [];
      
      const newId = Date.now();
      updatedMenu[activeDay][mealType].push({ id: newId, name, status: 'Available' });
      saveMenu(updatedMenu);
      setNewItemInputs({ ...newItemInputs, [mealType]: '' });
    }
  };

  const handleDeleteItem = (mealType, itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updatedMenu = { ...menuData };
      updatedMenu[activeDay][mealType] = updatedMenu[activeDay][mealType].filter(i => i.id !== itemId);
      saveMenu(updatedMenu);
    }
  };

  const navItems = [
    { id: 'Overview', label: 'Overview', icon: 'grid' },
    { id: 'Manage Mess', label: 'Manage Mess', icon: 'utensils' },
    { id: 'Subscribers', label: 'Subscribers', icon: 'users' },
    { id: 'Payments & Earnings', label: 'Payments & Earnings', icon: 'dollar-sign' },
  ];

  const subscribers = [];

  const transactions = [];

  const recentActivity = [];

  // Icon Component
  const Icon = ({ name, size = 18 }) => {
    const svgs = {
      'grid': <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
      'utensils': <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>,
      'users': <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
      'dollar-sign': <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
      'trending-up': <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>,
      'star': <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
      'user-plus': <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>,
      'user-minus': <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="23" y1="11" x2="17" y2="11"></line></svg>,
      'alert-circle': <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>,
      'chevron-left': <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>,
      'chevron-right': <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>,
      'edit': <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
      'trash': <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
      'power': <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>,
      'search': <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
      'download': <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
      'user': <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
      'settings': <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    };
    return svgs[name] || null;
  };

  const renderOverview = () => (
    <div className="owner-view">
      <div className="owner-header-box">
        <h1 className="admin-title">Good morning, {messInfo.owner}! 👋</h1>
        <p className="admin-subtitle">Here is how {messInfo.name} is doing today.</p>
        <div className="admin-date">Wednesday, 2 April 2026</div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-box-sm">
          <div>
            <div className="stat-label">Active Subscribers</div>
            <div className="stat-value">{messInfo.activeSubscribers}</div>
            <div className="owner-progress-bg" style={{ marginTop: 10 }}>
              <div className="owner-progress-fill" style={{ width: `${(messInfo.activeSubscribers / (messInfo.totalSlots || 1)) * 100}%` }}></div>
            </div>
          </div>
          <div className="stat-icon-wrap icon-orange"><Icon name="users" size={20} /></div>
        </div>

        <div className="admin-stat-box-sm">
          <div>
            <div className="stat-label">Today's Revenue</div>
            <div className="stat-value">₹{messInfo.todayRevenue.toLocaleString()}</div>
          </div>
          <div className="stat-icon-wrap icon-green"><Icon name="dollar-sign" size={20} /></div>
        </div>

        <div className="admin-stat-box-sm">
          <div>
            <div className="stat-label">Average Rating</div>
            <div className="stat-value">{messInfo.avgRating}</div>
            <div className="owner-stat-subtext" style={{ marginTop: 4 }}>from {messInfo.totalReviews} reviews</div>
          </div>
          <div className="stat-icon-wrap icon-yellow"><Icon name="star" size={20} /></div>
        </div>
      </div>

      <div className="owner-section-title">
        <h2>Recent activity</h2>
        <button className="owner-view-all">View all</button>
      </div>

      <div className="owner-activity-list">
        {recentActivity.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 24px', color: '#9E9E9E' }}>No recent activity yet.</div>
        ) : recentActivity.map(act => (
          <div key={act.id} className="owner-activity-item">
            <div className="owner-activity-icon" style={{ backgroundColor: act.bg, color: act.color }}>
              <Icon name={act.icon} size={18} />
            </div>
            <div className="owner-activity-content">
              <div className="owner-activity-main">
                <span className="owner-activity-user">{act.user}</span>
                <span className="owner-activity-action">
                  {act.type === 'subscription' && ' subscribed'}
                  {act.type === 'cancellation' && ' cancelled their plan'}
                  {act.type === 'payment' && ` Payment received from ${act.user}`}
                  {act.type === 'failed' && ` Payment failed for ${act.user}`}
                </span>
              </div>
              <div className="owner-activity-sub">
                {act.plan && <span>{act.plan}</span>}
                {act.amount && <span> • ₹{act.amount.toLocaleString()}</span>}
                {act.method && <span> • {act.method}</span>}
              </div>
            </div>
            <div className="owner-activity-right">
              <div className="owner-activity-time">{act.time}</div>
              {act.action && <button className="owner-remind-btn">{act.action}</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderManageMenu = () => (
    <div className="owner-view">
      <div className="owner-header-row" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="admin-title-sm">Manage Weekly Menu</h1>
          <p className="table-subtitle">Update your recurring weekly meal plan. Changes here repeat every week.</p>
        </div>
      </div>

      <div className="owner-calendar-card" style={{ padding: '16px' }}>
        <div className="day-selector-tabs" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <button 
              key={day} 
              className={`filter-pill ${activeDay === day ? 'active' : ''}`}
              onClick={() => setActiveDay(day)}
              style={{ minWidth: '80px', flexShrink: 0 }}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="owner-meal-sections" style={{ marginTop: '24px' }}>
        {['breakfast', 'lunch', 'dinner'].map(mealType => (
          <div key={mealType} className="owner-meal-card" style={{ marginBottom: '24px' }}>
            <div className="meal-card-header">
              <div className="meal-title-wrap">
                <div className={`meal-dot ${mealType}`}></div>
                <h3 className="meal-name" style={{ textTransform: 'capitalize' }}>{mealType}</h3>
                <span className="meal-time">
                  {mealType === 'breakfast' ? '7:30 – 10:00 AM' : 
                   mealType === 'lunch' ? '12:30 – 3:00 PM' : '7:30 – 10:00 PM'}
                </span>
              </div>
            </div>
            <div className="meal-items-list">
              {(menuData[activeDay]?.[mealType] || []).map(item => (
                <div key={item.id} className="meal-item">
                  <div className="meal-item-left" onClick={() => handleUpdateItemStatus(mealType, item.id)} style={{ cursor: 'pointer' }}>
                    <div className={`meal-item-dot ${item.status === 'Available' ? 'available' : 'unavailable'}`}></div>
                    <span className={`item-name ${item.status === 'Unavailable' ? 'strikethrough' : ''}`}>{item.name}</span>
                    {item.status === 'Unavailable' && <span className="unavailable-badge">Unavailable</span>}
                  </div>
                  <div className="meal-item-actions">
                    <button className="item-action-btn" onClick={() => handleUpdateItemStatus(mealType, item.id)}><Icon name="edit" size={14} /></button>
                    <button className="item-action-btn delete" onClick={() => handleDeleteItem(mealType, item.id)}><Icon name="trash" size={14} /></button>
                  </div>
                </div>
              ))}
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px', padding: '0 8px' }}>
                <input 
                  type="text" 
                  placeholder={`Add new ${mealType} item...`}
                  value={newItemInputs[mealType]}
                  onChange={(e) => setNewItemInputs({ ...newItemInputs, [mealType]: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddItem(mealType)}
                  style={{ 
                    flex: 1, 
                    padding: '8px 12px', 
                    borderRadius: '8px', 
                    border: '1px solid #E0E0E0', 
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button 
                  onClick={() => handleAddItem(mealType)}
                  style={{ 
                    padding: '8px 20px', 
                    background: '#F26B2E', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontWeight: '600', 
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mess Configuration Section - Merged */}
      <div style={{ marginTop: 48, background: 'white', borderRadius: 16, border: '1px solid #EEE', overflow: 'hidden' }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #EEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFAFA' }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Mess Configuration</h2>
            <p style={{ fontSize: 14, color: '#7E7E7E', margin: '4px 0 0 0' }}>Manage your pricing, timings, and service options.</p>
          </div>
          {!isEditingProfile ? (
            <button className="owner-edit-btn" onClick={() => { setEditOwnerData({ ...messInfo }); setIsEditingProfile(true); }}>
              <Icon name="edit" size={14} /> Edit Configuration
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="owner-cancel-btn" onClick={() => setIsEditingProfile(false)}>Cancel</button>
              <button className="owner-save-btn" onClick={saveProfile}>Save Changes</button>
            </div>
          )}
        </div>

        <div style={{ padding: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
            {[
              ['Mess Name', 'name', '🏠', 'text'],
              ['Location', 'location', '📍', 'text'],
              ['Phone Number', 'phone', '📞', 'text'],
              ['Email Address', 'email', '✉️', 'text'],
              ['Mess Type', 'type', '🍴', 'select', ['Standard', 'Premium']],
              ['Dietary Tag', 'tag', '🏷️', 'select', ['GENERAL', 'PURE VEG', 'NON VEG', 'JAIN']],
            ].map(([label, key, icon, inputType, options]) => (
              <div key={label}>
                <div className="info-label">{label}</div>
                {isEditingProfile ? (
                  inputType === 'select' ? (
                    <select 
                      value={editOwnerData[key]} 
                      onChange={e => setEditOwnerData({ ...editOwnerData, [key]: e.target.value })}
                      style={{ fontSize: 14, border: '1px solid #DDD', borderRadius: 6, padding: '8px 12px', width: '100%', marginTop: 4, backgroundColor: 'white' }}
                    >
                      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input 
                      type="text" 
                      value={editOwnerData[key]} 
                      onChange={e => setEditOwnerData({ ...editOwnerData, [key]: e.target.value })}
                      style={{ fontSize: 14, border: '1px solid #DDD', borderRadius: 6, padding: '8px 12px', width: '100%', marginTop: 4 }}
                    />
                  )
                ) : (
                  <div className="info-value" style={{ fontSize: 15, marginTop: 4 }}>{icon} {messInfo[key]}</div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid #EEE' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Meal Pricing & Timings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
              {['breakfast', 'lunch', 'dinner'].map(meal => (
                <div key={meal} style={{ background: '#F9FAFB', padding: 20, borderRadius: 12, border: '1px solid #F0F0F0' }}>
                  <div style={{ fontWeight: 700, textTransform: 'capitalize', marginBottom: 16, color: '#1A1A1A', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon name="utensils" size={14} /> {meal}
                  </div>
                  
                  <div style={{ marginBottom: 12 }}>
                    <div className="info-label">Daily Price (₹)</div>
                    {isEditingProfile ? (
                      <input 
                        type="number" 
                        value={editOwnerData.pricing[meal]} 
                        onChange={e => setEditOwnerData({ 
                          ...editOwnerData, 
                          pricing: { ...editOwnerData.pricing, [meal]: parseInt(e.target.value) || 0 } 
                        })}
                        style={{ fontSize: 14, border: '1px solid #DDD', borderRadius: 6, padding: '6px 10px', width: '100%', marginTop: 4 }}
                      />
                    ) : (
                      <div className="info-value" style={{ fontSize: 16, fontWeight: 700, color: '#F26B2E' }}>₹{messInfo.pricing[meal]}</div>
                    )}
                  </div>

                  <div>
                    <div className="info-label">Timing</div>
                    {isEditingProfile ? (
                      <input 
                        type="text" 
                        value={editOwnerData.timings[meal]} 
                        onChange={e => setEditOwnerData({ 
                          ...editOwnerData, 
                          timings: { ...editOwnerData.timings, [meal]: e.target.value } 
                        })}
                        style={{ fontSize: 14, border: '1px solid #DDD', borderRadius: 6, padding: '6px 10px', width: '100%', marginTop: 4 }}
                      />
                    ) : (
                      <div className="info-value" style={{ fontSize: 14 }}>{messInfo.timings[meal]}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid #EEE' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Subscription Plans & Delivery</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                {[
                  ['Trial (15 Days)', 'trial'],
                  ['1 Month', 'oneMonth'],
                  ['3 Months', 'threeMonth']
                ].map(([label, key]) => (
                  <div key={key}>
                    <div className="info-label">{label} (₹)</div>
                    {isEditingProfile ? (
                      <input 
                        type="number" 
                        value={editOwnerData.subscriptionPlans[key]} 
                        onChange={e => setEditOwnerData({ 
                          ...editOwnerData, 
                          subscriptionPlans: { ...editOwnerData.subscriptionPlans, [key]: parseInt(e.target.value) || 0 } 
                        })}
                        style={{ fontSize: 14, border: '1px solid #DDD', borderRadius: 6, padding: '6px 10px', width: '100%', marginTop: 4 }}
                      />
                    ) : (
                      <div className="info-value" style={{ fontSize: 16, fontWeight: 700, color: '#F26B2E' }}>₹{messInfo.subscriptionPlans[key]}</div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ background: '#FFF7ED', padding: 20, borderRadius: 12, border: '1px solid #FFEDD5' }}>
                <div className="info-label">Home Delivery Status</div>
                <div style={{ marginTop: 8 }}>
                  {isEditingProfile ? (
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={editOwnerData.homeDelivery} 
                        onChange={e => setEditOwnerData({ ...editOwnerData, homeDelivery: e.target.checked })}
                        style={{ width: 18, height: 18 }}
                      />
                      <span style={{ fontSize: 14, fontWeight: 600 }}>Available</span>
                    </label>
                  ) : (
                    <div style={{ fontSize: 14, fontWeight: 700, color: messInfo.homeDelivery ? '#9A3412' : '#7E7E7E' }}>
                      {messInfo.homeDelivery ? '✅ ACTIVE' : '❌ DISABLED'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );



  const renderSubscribers = () => (
    <div className="owner-view">
      <div className="owner-header-row">
        <div>
          <h1 className="admin-title-sm">Subscribers</h1>
          <p className="table-subtitle">View and manage all your active and past subscribers.</p>
        </div>
      </div>

      <div className="owner-toolbar">
        <div className="owner-search-wrap">
          <Icon name="search" size={16} />
          <input type="text" placeholder="Search by name or phone..." />
        </div>
        <div className="owner-filter-chips">
          <button className="filter-chip active">All</button>
          <button className="filter-chip">Active</button>
          <button className="filter-chip">Expiring Soon</button>
          <button className="filter-chip">Expired</button>
        </div>
        <button className="owner-export-btn">
          <Icon name="download" size={14} /> Export CSV
        </button>
      </div>

      <div className="admin-table-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone number</th>
              <th>Plan</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px 24px', color: '#9E9E9E' }}>No subscribers yet.</td></tr>
            ) : subscribers.map(sub => (
              <tr key={sub.id}>
                <td>
                  <div className="owner-table-user">
                    <div className="owner-avatar-circle" style={{ backgroundColor: sub.color }}>{sub.initials}</div>
                    <span className="owner-user-name">{sub.name}</span>
                  </div>
                </td>
                <td className="owner-table-text">{sub.phone}</td>
                <td><span className="owner-plan-pill">{sub.plan}</span></td>
                <td className="owner-table-text">{sub.start}</td>
                <td className="owner-table-text">{sub.end}</td>
                <td>
                  <span className={`owner-status-pill ${sub.status.toLowerCase().replace(' ', '-')}`}>
                    <span className="dot"></span> {sub.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subscribers.length > 0 && (
          <div className="owner-pagination">
            <span className="pagination-info">Showing 1–8 of 142 subscribers</span>
            <div className="pagination-controls">
              <button className="page-nav">Prev</button>
              <button className="page-num active">1</button>
              <button className="page-num">2</button>
              <button className="page-num">3</button>
              <span className="page-dots">...</span>
              <button className="page-num">18</button>
              <button className="page-nav">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="owner-view">
      <div className="owner-header-row">
        <div>
          <h1 className="admin-title-sm">Payments & Earnings</h1>
          <p className="table-subtitle">Track your income and monitor all transactions.</p>
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-box">
          <div className="stat-label">Today</div>
          <div className="stat-value">₹0</div>
          <div className="owner-stat-subtext" style={{ marginTop: 12 }}>0 transactions today</div>
        </div>
        <div className="admin-stat-box">
          <div className="stat-label">This week</div>
          <div className="stat-value">₹0</div>
          <div className="owner-stat-subtext" style={{ marginTop: 12 }}>0 transactions</div>
        </div>
        <div className="admin-stat-box">
          <div className="stat-label">This month</div>
          <div className="stat-value">₹0</div>
          <div className="owner-stat-subtext" style={{ marginTop: 12 }}>0 transactions</div>
        </div>
      </div>

      <div className="owner-section-title">
        <h2>Transactions</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <select className="owner-select">
            <option>Last 30 days</option>
          </select>
          <button className="owner-export-btn">
            <Icon name="download" size={14} /> Export
          </button>
        </div>
      </div>

      <div className="admin-table-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Name</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px 24px', color: '#9E9E9E' }}>No transactions found.</td></tr>
            ) : transactions.map(tx => (
              <tr key={tx.id}>
                <td className="owner-table-id">{tx.id}</td>
                <td>
                  <div className="owner-table-user">
                    <div className="owner-avatar-circle-sm" style={{ backgroundColor: tx.color }}>{tx.initials}</div>
                    <span className="owner-user-name">{tx.name}</span>
                  </div>
                </td>
                <td className="owner-table-amount">₹{tx.amount.toLocaleString()}</td>
                <td className="owner-table-text">{tx.date}</td>
                <td>
                  <span className={`owner-payment-pill ${tx.status.toLowerCase()}`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header" style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #F0F0F0' }}>
          <div style={{ width: 32, height: 32, backgroundColor: '#F26B2E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: 'black' }}>GS</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#1A1A1A', lineHeight: 1 }}>GrubSpot</div>
            <div style={{ fontSize: 11, color: '#7E7E7E', marginTop: 4, fontWeight: 600 }}>{messInfo.name}</div>
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map(item => (
            <div
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="admin-nav-icon"><Icon name={item.icon} /></span>
              <span className="admin-nav-label">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-box" onClick={() => setActiveTab('Manage Mess')} style={{ background: activeTab === 'Manage Mess' ? '#FFF0E6' : 'transparent', borderRadius: '10px', cursor: 'pointer' }}>
             <div className="admin-avatar">{messInfo.initials}</div>
             <div>
               <div className="admin-username">{messInfo.owner}</div>
               <div className="admin-role">Mess Owner</div>
             </div>
          </div>
          <button className="admin-logout-btn">
             <span className="admin-nav-icon"><Icon name="power" /></span>
             <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
         {activeTab === 'Overview' && renderOverview()}
         {activeTab === 'Manage Mess' && renderManageMenu()}
         {activeTab === 'Subscribers' && renderSubscribers()}
         {activeTab === 'Payments & Earnings' && renderPayments()}
      </main>
    </div>
  );
}

export default OwnerPanel;
