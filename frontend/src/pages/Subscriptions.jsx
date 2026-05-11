import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

function Subscriptions() {
  const [activeTab, setActiveTab] = useState('Active');
  
  // State for dynamic lists
  const [activeList, setActiveList] = useState([
    {
      id: 1,
      name: 'Campus Bite',
      image: 'https://placehold.co/150x150/F26B2E/FFFFFF?text=CB',
      cuisine: 'South Indian',
      diet: 'Non-Veg',
      meals: 'Lunch + Dinner',
      delivery: 'Home Delivery',
      dateLabel: 'Renews',
      dateVal: '25 Apr 2026',
      statusType: 'ACTIVE'
    },
    {
      id: 2,
      name: 'Annapoorna Mess',
      image: 'https://placehold.co/150x150/4CAF50/FFFFFF?text=AM',
      cuisine: 'South Indian',
      diet: 'Veg',
      meals: 'Lunch',
      delivery: 'Dine-in',
      dateLabel: 'Renews',
      dateVal: '10 May 2026',
      statusType: 'ACTIVE'
    }
  ]);

  const [pastList, setPastList] = useState([
    {
      id: 3,
      name: 'Spice Garden',
      image: 'https://placehold.co/150x150/D93025/FFFFFF?text=SG',
      cuisine: 'North Indian',
      diet: 'Veg',
      meals: 'Dinner',
      delivery: 'Home Delivery',
      dateLabel: 'Expired on',
      dateVal: '12 Feb 2026',
      statusType: 'EXPIRED'
    }
  ]);

  const [pausedList, setPausedList] = useState([
    {
      id: 4,
      name: 'Ruchi Mess',
      image: 'https://placehold.co/150x150/FF9800/FFFFFF?text=RM',
      cuisine: 'South Indian',
      diet: 'Veg',
      meals: 'Breakfast + Lunch',
      delivery: 'Dine-in',
      dateLabel: 'Paused until',
      dateVal: '01 Apr 2026',
      statusType: 'PAUSED'
    }
  ]);

  const [selectedMessMenu, setSelectedMessMenu] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Action Handlers
  const handlePause = (id) => {
    const item = activeList.find(sub => sub.id === id);
    if (!item) return;

    if (window.confirm(`Are you sure you want to pause your subscription for ${item.name}?`)) {
      setActiveList(prev => prev.filter(sub => sub.id !== id));
      setPausedList(prev => [...prev, { 
        ...item, 
        statusType: 'PAUSED', 
        dateLabel: 'Paused on', 
        dateVal: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      }]);
      alert(`${item.name} subscription paused.`);
    }
  };

  const handleResume = (id) => {
    const item = pausedList.find(sub => sub.id === id);
    if (!item) return;

    setPausedList(prev => prev.filter(sub => sub.id !== id));
    setActiveList(prev => [...prev, { 
      ...item, 
      statusType: 'ACTIVE', 
      dateLabel: 'Renews', 
      dateVal: 'Next Month' 
    }]);
    alert(`${item.name} subscription resumed!`);
  };

  const handleCancel = (id, fromList) => {
    let list, setter;
    if (fromList === 'active') { list = activeList; setter = setActiveList; }
    else { list = pausedList; setter = setPausedList; }

    const item = list.find(sub => sub.id === id);
    if (!item) return;

    if (window.confirm(`Are you sure you want to cancel your subscription for ${item.name}? This cannot be undone.`)) {
      setter(prev => prev.filter(sub => sub.id !== id));
      setPastList(prev => [...prev, { 
        ...item, 
        statusType: 'EXPIRED', 
        dateLabel: 'Cancelled on', 
        dateVal: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      }]);
      alert(`${item.name} subscription cancelled.`);
    }
  };

  const handleViewMenu = (name) => {
    setSelectedMessMenu(name);
  };

  const getDietStyle = (diet) => {
    return diet === 'Veg' ? { color: '#4CAF50', fontWeight: '600' } : { color: '#F26B2E', fontWeight: '600' };
  };

  const getStatusPill = (statusType) => {
    if (statusType === 'ACTIVE') {
      return <span className="pill-active">ACTIVE</span>;
    }
    if (statusType === 'EXPIRED') {
      return <span className="pill-expired">CANCELLED</span>;
    }
    if (statusType === 'PAUSED') {
      return <span className="pill-paused">PAUSED</span>;
    }
    return null;
  };

  const renderActiveList = () => (
    <>
      <div className="subs-list-wrapper">
        {activeList.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#7E7E7E', border: '1px dashed #DDD', borderRadius: '12px' }}>
            No active subscriptions.
          </div>
        ) : activeList.map(sub => (
          <div key={sub.id} className="subs-card">
            <div className="subs-card-img">
              <img src={sub.image} alt={sub.name} />
            </div>
            <div className="subs-card-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h3 className="subs-card-title">{sub.name}</h3>
                {getStatusPill(sub.statusType)}
              </div>
              <div className="subs-card-meta">
                {sub.cuisine} · <span style={getDietStyle(sub.diet)}>{sub.diet}</span>
              </div>
              <div className="subs-card-meta">
                <span className="icon">🍽️</span> {sub.meals} · {sub.delivery}
              </div>
              <div className="subs-card-meta" style={{ fontWeight: '600', color: '#1A1A1A' }}>
                <span className="icon">🔄</span> {sub.dateLabel} {sub.dateVal}
              </div>
            </div>
            <div className="subs-card-actions">
              <button className="btn-action-outline" onClick={() => handleViewMenu(sub.name)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                View Menu
              </button>
              <button className="btn-action-outline" style={{ color: '#555', borderColor: '#ccc' }} onClick={() => handlePause(sub.id)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                Pause
              </button>
              <button className="btn-action-outline btn-outline-danger" onClick={() => handleCancel(sub.id, 'active')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
      <a href="/messes" className="add-mess-dashed-btn" style={{ textDecoration: 'none' }}>
        + Add another mess
      </a>
    </>
  );

  const renderPausedList = () => (
    <div className="subs-list-wrapper">
      {pausedList.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#7E7E7E', border: '1px dashed #DDD', borderRadius: '12px' }}>
          No paused subscriptions.
        </div>
      ) : pausedList.map(sub => (
        <div key={sub.id} className="subs-card">
          <div className="subs-card-img">
            <img src={sub.image} alt={sub.name} />
          </div>
          <div className="subs-card-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 className="subs-card-title">{sub.name}</h3>
              {getStatusPill(sub.statusType)}
            </div>
            <div className="subs-card-meta">
              {sub.cuisine} · <span style={getDietStyle(sub.diet)}>{sub.diet}</span>
            </div>
            <div className="subs-card-meta">
              <span className="icon">🍽️</span> {sub.meals} · {sub.delivery}
            </div>
            <div className="subs-card-meta" style={{ color: '#FF9800', fontWeight: '600' }}>
              <span className="icon">⏸️</span> {sub.dateLabel} {sub.dateVal}
            </div>
          </div>
          <div className="subs-card-actions">
            <button className="btn-action-outline btn-outline-green" onClick={() => handleResume(sub.id)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Resume
            </button>
            <button className="btn-action-outline btn-outline-danger" onClick={() => handleCancel(sub.id, 'paused')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPastList = () => (
    <div className="subs-list-wrapper">
      {pastList.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#7E7E7E', border: '1px dashed #DDD', borderRadius: '12px' }}>
          No subscription history found.
        </div>
      ) : pastList.map(sub => (
        <div key={sub.id} className="subs-card">
          <div className="subs-card-img">
            <img src={sub.image} alt={sub.name} />
          </div>
          <div className="subs-card-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 className="subs-card-title">{sub.name}</h3>
              {getStatusPill(sub.statusType)}
            </div>
            <div className="subs-card-meta">
              {sub.cuisine} · <span style={getDietStyle(sub.diet)}>{sub.diet}</span>
            </div>
            <div className="subs-card-meta">
              <span className="icon">🍽️</span> {sub.meals} · {sub.delivery}
            </div>
            <div className="subs-card-meta" style={{ color: '#7E7E7E' }}>
              {sub.dateLabel} {sub.dateVal}
            </div>
            <a href="#review" style={{ display: 'inline-block', marginTop: '4px', fontSize: '13px', color: '#F26B2E', textDecoration: 'underline' }}>
              Write a review →
            </a>
          </div>
          <div className="subs-card-actions">
            <button className="btn-action-solid">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12A10 10 0 1 1 12 2v4a6 6 0 1 0 6 6z"></path><polyline points="22 2 22 12 12 12"></polyline></svg>
              Resubscribe
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="subscription-page " style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF' }}>
      <NavBar />
      
      <main className="container" style={{ flex: 1, padding: '40px 20px', width: '100%', maxWidth: '1000px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1A1A1A', marginBottom: '8px' }}>My Subscriptions</h1>
        <p style={{ color: '#7E7E7E', fontSize: '15px', marginBottom: '40px' }}>
          Manage your active mess plans and subscription history.
        </p>

        <div className="subs-tabs-container">
          <div 
            className={`subs-tab ${activeTab === 'Active' ? 'active' : ''}`} 
            onClick={() => setActiveTab('Active')}
          >
            Active <span className="badge-circle">{activeList.length}</span>
          </div>
          <div 
            className={`subs-tab ${activeTab === 'Paused' ? 'active' : ''}`} 
            onClick={() => setActiveTab('Paused')}
          >
            Paused <span className="badge-circle">{pausedList.length}</span>
          </div>
          <div 
            className={`subs-tab ${activeTab === 'Past' ? 'active' : ''}`} 
            onClick={() => setActiveTab('Past')}
          >
            Past <span className="badge-circle">{pastList.length}</span>
          </div>
        </div>

        <div style={{ marginTop: '32px' }}>
          {activeTab === 'Active' && renderActiveList()}
          {activeTab === 'Paused' && renderPausedList()}
          {activeTab === 'Past' && renderPastList()}
        </div>

        {/* Menu Modal Placeholder */}
        {selectedMessMenu && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', padding: '32px', borderRadius: '16px', maxWidth: '500px', width: '90%', position: 'relative' }}>
              <button onClick={() => setSelectedMessMenu(null)} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
              <h2 style={{ marginBottom: '16px' }}>{selectedMessMenu} - Today's Menu</h2>
              <div style={{ padding: '20px', backgroundColor: '#F9F9F9', borderRadius: '8px' }}>
                <p><strong>Lunch:</strong> Paneer Butter Masala, Roti, Rice, Dal, Curd</p>
                <p style={{ marginTop: '12px' }}><strong>Dinner:</strong> Veg Pulao, Raita, Salad, Gulab Jamun</p>
              </div>
              <button className="btn-action-solid" style={{ marginTop: '24px', width: '100%' }} onClick={() => setSelectedMessMenu(null)}>Close</button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Subscriptions;
