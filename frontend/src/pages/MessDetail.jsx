import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

function MessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mess, setMess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // States for interactive layout
  const [activeTab, setActiveTab] = useState(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()]);
  const [selectedMeals, setSelectedMeals] = useState({ breakfast: true, lunch: true, dinner: false });
  const [duration, setDuration] = useState('1 Month');
  const [homeDelivery, setHomeDelivery] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMessDetail();
    const saved = JSON.parse(localStorage.getItem('savedMesses') || '[]');
    setIsSaved(saved.includes(parseInt(id)));
  }, [id, activeTab]);

  const fetchMessDetail = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/messes');
      if (res.data.status === 'success') {
        const found = res.data.messes.find(m => m.id === parseInt(id));
        if (found) {
          const dbMenuFull = found.menu_data || {};
          const dbMenuForDay = dbMenuFull[activeTab] || null;
          const details = found.details || {};
          
          setMess({
            id: found.id,
            name: found.mess_name || "Untitled Mess",
            owner: found.name || "Owner",
            rating: details.avgRating || "0.0",
            reviews: details.totalReviews || 0,
            distance: "N/A",
            type: details.type || 'Standard',
            tag: details.tag || 'GENERAL',
            price: details.subscriptionPlans?.oneMonth ? '₹' + details.subscriptionPlans.oneMonth.toLocaleString('en-IN') : 'Price Not Set',
            fullAddress: found.address || "Address not provided",
            phone: found.phone || "No contact",
            pricing: details.pricing || { breakfast: 0, lunch: 0, dinner: 0 },
            homeDelivery: details.homeDelivery || false,
            subscriptionPlans: details.subscriptionPlans || { trial: 0, oneMonth: 0, threeMonth: 0 },
            menu: {
              breakfast: { 
                time: details.timings?.breakfast || "7:30 AM – 10:00 AM", 
                items: dbMenuForDay?.breakfast?.length > 0 ? dbMenuForDay.breakfast.map(i => i.name + (i.status === 'Unavailable' ? ' (Unavailable)' : '')) : ["Menu not updated"] 
              },
              lunch: { 
                time: details.timings?.lunch || "12:30 PM – 3:00 PM", 
                items: dbMenuForDay?.lunch?.length > 0 ? dbMenuForDay.lunch.map(i => i.name + (i.status === 'Unavailable' ? ' (Unavailable)' : '')) : ["Menu not updated"] 
              },
              dinner: { 
                time: details.timings?.dinner || "7:30 PM – 10:00 PM", 
                items: dbMenuForDay?.dinner?.length > 0 ? dbMenuForDay.dinner.map(i => i.name + (i.status === 'Unavailable' ? ' (Unavailable)' : '')) : ["Menu not updated"] 
              }
            }
          });
        }
      }
    } catch (error) {
      console.error('Error fetching mess detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSave = () => {
    const saved = JSON.parse(localStorage.getItem('savedMesses') || '[]');
    let updated;
    if (saved.includes(parseInt(id))) {
      updated = saved.filter(mId => mId !== parseInt(id));
      setIsSaved(false);
    } else {
      updated = [...saved, parseInt(id)];
      setIsSaved(true);
    }
    localStorage.setItem('savedMesses', JSON.stringify(updated));
  };

  if (!mess) {
    return (
      <div className="home-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NavBar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <h2>Mess Not Found</h2>
          <button className="cta-btn" onClick={() => navigate('/messes')}>Back to List</button>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate pricing
  const toggleMeal = (mealType) => {
    setSelectedMeals(prev => ({ ...prev, [mealType]: !prev[mealType] }));
  };

  const getDailyCost = () => {
    let cost = 0;
    if (selectedMeals.breakfast) cost += mess.pricing.breakfast;
    if (selectedMeals.lunch) cost += mess.pricing.lunch;
    if (selectedMeals.dinner) cost += mess.pricing.dinner;
    return cost;
  };

  const calculateTotal = () => {
    let base = 0;
    if (duration === 'Trial (15 Days)') base = mess.subscriptionPlans.trial;
    else if (duration === '1 Month') base = mess.subscriptionPlans.oneMonth;
    else if (duration === '3 Months') base = mess.subscriptionPlans.threeMonth;
    
    if (homeDelivery) {
       base += 200;
    }
    return base;
  };

  return (
    <div className="home-page" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <NavBar />
      
      <main className="container" style={{ paddingBottom: '80px' }}>
        
        {/* Breadcrumbs */}
        <div style={{ padding: '24px 0', fontSize: '13px', color: '#7E7E7E' }}>
          <Link to="/" style={{ color: '#F26B2E', textDecoration: 'none' }}>Home</Link> / 
          <Link to="/messes" style={{ color: '#F26B2E', textDecoration: 'none', marginLeft: '6px' }}>Messes</Link> / 
          <span style={{ color: '#1A1A1A', marginLeft: '6px', fontWeight: '500' }}>{mess.name}</span>
        </div>

        {/* Hero Banner with Integrated Text */}
        <div className="detail-banner" style={{ background: 'url(https://via.placeholder.com/1200x400?text=+) center/cover no-repeat #E8E8E8', position: 'relative' }}>
          <div className="banner-overlay">
            <span className="mess-tag" style={{ position: 'relative', top: 0, left: 0, display: 'inline-block', marginBottom: '12px' }}>
              {mess.tag}
            </span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h1 className="banner-title">{mess.name}</h1>
              <div 
                onClick={toggleSave}
                style={{ 
                  background: 'white', 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: '0.2s transform'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" 
                  fill={isSaved ? "var(--orange)" : "none"} 
                  stroke={isSaved ? "var(--orange)" : "#4A4A4A"} 
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                </svg>
              </div>
            </div>
            <div className="banner-meta">
              <span>📍 {mess.distance}</span>
              <span>🍴 {mess.type}</span>
              <span style={{ color: '#FF9800', fontWeight: 'bold' }}>★ {mess.rating} <span style={{ color: '#FFF', fontWeight: 'normal' }}>({mess.reviews} reviews)</span></span>
            </div>
          </div>
        </div>

        {/* 70/30 Grid Layout */}
        <div className="mess-detail-grid">
          
          {/* LEFT 70% */}
          <div className="left-content">
            
            {/* Tabs */}
            <div className="day-tabs">
              {days.map(day => (
                <button 
                  key={day} 
                  className={`day-tab ${activeTab === day ? 'active' : ''}`}
                  onClick={() => setActiveTab(day)}
                >
                  {day}
                </button>
              ))}
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>
               {activeTab === 'Mon' ? "Monday's Menu" : `${activeTab}day's Menu`}
            </h2>

            {/* Menu Cards */}
            <div className="menu-schedule">
              {/* Breakfast */}
              <div className="menu-section-card">
                <div className="menu-card-header">
                  <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Breakfast</h3>
                  <span className="menu-time">⏱ {mess.menu.breakfast.time}</span>
                </div>
                <ul className="menu-items-list">
                  {mess.menu.breakfast.items.map((item, id) => <li key={id}>{item}</li>)}
                </ul>
              </div>

              {/* Lunch */}
              <div className="menu-section-card">
                <div className="menu-card-header">
                  <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Lunch</h3>
                  <span className="menu-time">⏱ {mess.menu.lunch.time}</span>
                </div>
                <ul className="menu-items-list">
                  {mess.menu.lunch.items.map((item, id) => <li key={id}>{item}</li>)}
                </ul>
              </div>

              {/* Dinner */}
              <div className="menu-section-card">
                <div className="menu-card-header">
                  <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Dinner</h3>
                  <span className="menu-time">⏱ {mess.menu.dinner.time}</span>
                </div>
                <ul className="menu-items-list">
                  {mess.menu.dinner.items.map((item, id) => <li key={id}>{item}</li>)}
                </ul>
              </div>
            </div>

            {/* Info Widgets Row */}
            <div className="info-cards-row">
              <div className="info-widget">
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Location & Contact</h3>
                <div style={{ color: '#7E7E7E', fontSize: '14px', marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>📍</span> <span>{mess.fullAddress}</span>
                </div>
                <div style={{ color: '#7E7E7E', fontSize: '14px', display: 'flex', gap: '8px' }}>
                  <span>📞</span> <span>{mess.phone}</span>
                </div>
              </div>

              <div className="info-widget">
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Payment & Delivery</h3>
                <div style={{ color: '#4CAF50', fontSize: '14px', marginBottom: '12px', display: 'flex', gap: '8px', fontWeight: '500' }}>
                  <span>✓</span> <span>Home Delivery Available</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ padding: '4px 12px', background: '#FFF0E6', color: '#F26B2E', fontSize: '12px', borderRadius: '4px' }}>UPI</span>
                  <span style={{ padding: '4px 12px', background: '#FFF0E6', color: '#F26B2E', fontSize: '12px', borderRadius: '4px' }}>Cash</span>
                </div>
              </div>
            </div>

            {/* Student Reviews Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Student Reviews</h2>
              <span 
                onClick={() => setShowAllReviews(!showAllReviews)} 
                style={{ color: '#F26B2E', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                {showAllReviews ? 'Show Less ←' : 'View All →'}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="info-widget" style={{ background: '#FFF9F5', border: 'none', padding: '24px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F26B2E', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                     DK
                   </div>
                   <div>
                     <div style={{ fontWeight: '600', fontSize: '14px' }}>Deepak Kumar</div>
                     <div style={{ color: '#FF9800', fontSize: '12px' }}>
                       ★★★★☆ <span style={{ color: '#7E7E7E', marginLeft: '8px' }}>March 2026</span>
                     </div>
                   </div>
                 </div>
                 <p style={{ color: '#1A1A1A', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                   Decent {mess.type} mess. Regular meals are good but quantity could be slightly more. The Sunday specials are excellent though!
                 </p>
              </div>

              {showAllReviews && (
                <>
                  <div className="info-widget" style={{ background: '#FFF9F5', border: 'none', padding: '24px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                       <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#4CAF50', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                         SR
                       </div>
                       <div>
                         <div style={{ fontWeight: '600', fontSize: '14px' }}>Sneha Reddy</div>
                         <div style={{ color: '#FF9800', fontSize: '12px' }}>
                           ★★★★★ <span style={{ color: '#7E7E7E', marginLeft: '8px' }}>February 2026</span>
                         </div>
                       </div>
                     </div>
                     <p style={{ color: '#1A1A1A', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                       Absolutely love the hygiene and taste. Completely feels like home-cooked meals. Definitely worth the subscription!
                     </p>
                  </div>
                  <div className="info-widget" style={{ background: '#FFF9F5', border: 'none', padding: '24px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                       <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2196F3', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                         AS
                       </div>
                       <div>
                         <div style={{ fontWeight: '600', fontSize: '14px' }}>Arjun Singh</div>
                         <div style={{ color: '#FF9800', fontSize: '12px' }}>
                           ★★★☆☆ <span style={{ color: '#7E7E7E', marginLeft: '8px' }}>January 2026</span>
                         </div>
                       </div>
                     </div>
                     <p style={{ color: '#1A1A1A', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                       Food is okay, but delivery is sometimes delayed by 15-20 minutes. Pricing is very reasonable though.
                     </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT 30% STICKY SUB CARD */}
          <div>
            <div className="subscription-sticky-card">
              <h2 className="sidebar-title">Subscription Plan</h2>
              
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: '600', marginBottom: '12px' }}>Step 1: Select Meal (Up to 3)</h3>
                
                <label className={`box-selector ${selectedMeals.breakfast ? 'active' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: '500' }}>
                    <input type="checkbox" checked={selectedMeals.breakfast} onChange={() => toggleMeal('breakfast')} /> Breakfast
                  </div>
                  <span style={{ color: '#F26B2E', fontSize: '12px', background: '#FFF0E6', padding: '2px 8px', borderRadius: '12px' }}>₹{mess.pricing.breakfast}/day</span>
                </label>

                <label className={`box-selector ${selectedMeals.lunch ? 'active' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: '500' }}>
                    <input type="checkbox" checked={selectedMeals.lunch} onChange={() => toggleMeal('lunch')} /> Lunch
                  </div>
                  <span style={{ color: '#F26B2E', fontSize: '12px', background: '#FFF0E6', padding: '2px 8px', borderRadius: '12px' }}>₹{mess.pricing.lunch}/day</span>
                </label>

                <label className={`box-selector ${selectedMeals.dinner ? 'active' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: '500' }}>
                    <input type="checkbox" checked={selectedMeals.dinner} onChange={() => toggleMeal('dinner')} /> Dinner
                  </div>
                  <span style={{ color: '#7E7E7E', fontSize: '12px', background: '#F0F0F0', padding: '2px 8px', borderRadius: '12px' }}>₹{mess.pricing.dinner}/day</span>
                </label>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: '600', marginBottom: '12px' }}>Step 2: Select Duration</h3>
                <div className="duration-selector">
                  <div className={`duration-pill ${duration === 'Trial (15 Days)' ? 'active' : ''}`} onClick={() => setDuration('Trial (15 Days)')}>
                    Trial (15 Days)
                    <span>₹{mess.subscriptionPlans.trial}</span>
                  </div>
                  <div className={`duration-pill ${duration === '1 Month' ? 'active' : ''}`} onClick={() => setDuration('1 Month')}>
                    1 Month
                    <span>₹{mess.subscriptionPlans.oneMonth}</span>
                  </div>
                  <div className={`duration-pill ${duration === '3 Months' ? 'active' : ''}`} onClick={() => setDuration('3 Months')}>
                    3 Months
                    <span>₹{mess.subscriptionPlans.threeMonth}</span>
                  </div>
                </div>
              </div>

              {mess.homeDelivery && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: '600', marginBottom: '12px' }}>Step 3: Add-ons</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: '#1A1A1A', padding: '8px 0', cursor: 'pointer' }} onClick={() => setHomeDelivery(!homeDelivery)}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                       <input type="checkbox" checked={homeDelivery} readOnly style={{ marginRight: '12px', accentColor: 'var(--orange)' }} />
                       Home Delivery
                    </div>
                    <span style={{ color: '#F26B2E', fontSize: '13px' }}>+₹200</span>
                  </div>
                </div>
              )}

              <div className="price-summary-box">
                <h3 style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: '700', marginBottom: '12px' }}>Price Summary</h3>
                <div className="summary-row">
                  <span>Selected Meals ({[selectedMeals.breakfast && 'B', selectedMeals.lunch && 'L', selectedMeals.dinner && 'D'].filter(Boolean).join(', ')})</span>
                  <span>{duration}</span>
                </div>
                {homeDelivery && (
                  <div className="summary-row">
                    <span>Home Delivery</span>
                    <span>+₹200</span>
                  </div>
                )}
                <div className="summary-row total-row">
                  <span>TOTAL</span>
                  <span style={{ color: '#F26B2E' }}>₹{calculateTotal()}</span>
                </div>
              </div>

              <button className="submit-btn" style={{ marginBottom: '16px' }} onClick={() => navigate('/signup')}>
                SUBSCRIBE
              </button>
              
              <div style={{ textAlign: 'center', fontSize: '12px', color: '#7E7E7E' }}>
                <Link to="/login" style={{ color: '#F26B2E', textDecoration: 'none', fontWeight: '600' }}>Login</Link> to subscribe to this mess
              </div>

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MessDetail;
