import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

function Compare() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMesses, setSelectedMesses] = useState([]);
  const [messes, setMesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMesses();
  }, []);

  const fetchMesses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/messes');
      if (res.data.status === 'success') {
        setMesses(res.data.messes.map(m => ({
          id: m.id,
          name: m.mess_name,
          owner: m.name,
          rating: m.details?.avgRating || "0.0",
          reviews: m.details?.totalReviews || 0,
          distance: "N/A",
          type: m.details?.type || 'Standard',
          tag: m.details?.tag || 'GENERAL',
          price: m.details?.subscriptionPlans?.oneMonth ? '₹' + m.details.subscriptionPlans.oneMonth.toLocaleString('en-IN') : 'Price Not Set',
          fullAddress: m.address || "Location not set",
          phone: m.phone || "Not set",
          pricing: m.details?.pricing || { breakfast: 0, lunch: 0, dinner: 0 },
          menu: m.details?.timings || { breakfast: "Not set", lunch: "Not set", dinner: "Not set" },
          plans: m.details?.subscriptionPlans || { trial: 0, oneMonth: 0, threeMonth: 0 },
          homeDelivery: m.details?.homeDelivery || false
        })));
      }
    } catch (error) {
      console.error('Error fetching messes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (mess) => {
    if (selectedMesses.find(m => m.id === mess.id)) {
      setSelectedMesses(selectedMesses.filter(m => m.id !== mess.id));
    } else {
      if (selectedMesses.length < 3) {
        setSelectedMesses([...selectedMesses, mess]);
      }
    }
  };

  const filteredMesses = messes.filter(mess => 
    mess.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    mess.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-page" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <NavBar />
      
      <main className="container" style={{ paddingBottom: '80px', paddingTop: '40px' }}>
        
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
            Compare <span style={{ color: '#F26B2E' }}>Messes</span>
          </h1>
          <p style={{ color: '#7E7E7E', fontSize: '14px' }}>
            Select up to 3 messes from the list to compare side by side
          </p>
        </div>

        <div className="compare-layout">
          
          {/* LEFT SIDEBAR - Selection */}
          <div className="selection-sidebar">
            <div className="search-box" style={{ margin: '0 0 16px 0', background: '#FFF0E6', border: 'none' }}>
              <span style={{ marginLeft: '16px', color: '#F26B2E' }}>🔍</span>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search mess..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: 'transparent', border: 'none' }}
              />
            </div>
            
            <div style={{ fontSize: '12px', color: '#7E7E7E', marginBottom: '16px' }}>
              {selectedMesses.length}/3 selected
            </div>

            <div className="selectable-list">
              {filteredMesses.map(mess => {
                const isSelected = selectedMesses.find(m => m.id === mess.id);
                const isDisabled = !isSelected && selectedMesses.length >= 3;
                
                return (
                  <div 
                    key={mess.id} 
                    className={`selectable-mess-card ${isSelected ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                    onClick={() => !isDisabled && handleToggle(mess)}
                  >
                    <div className={`radio-circle ${isSelected ? 'checked' : ''}`}></div>
                    <div>
                      <div style={{ color: isSelected ? '#F26B2E' : '#1A1A1A', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{mess.name}</div>
                      <div style={{ fontSize: '12px', color: '#7E7E7E' }}>{mess.type} • {mess.distance}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT MAIN - Comparison Matrix */}
          <div className="comparison-content">
            {selectedMesses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '100px 0', color: '#7E7E7E', border: '1px dashed #CCC', borderRadius: '12px' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚖️</div>
                <h3>Nothing to compare yet</h3>
                <p>Select messes from the left panel to begin.</p>
              </div>
            ) : (
              <div className="matrix-wrapper">
                
                {/* Header Cards Row */}
                <div className="matrix-row header-cards-row" style={{ gridTemplateColumns: `200px repeat(${selectedMesses.length}, 1fr)` }}>
                  <div className="matrix-cell empty-cell"></div>
                  {selectedMesses.map(mess => (
                    <div key={mess.id} className="matrix-cell profile-cell">
                      <div style={{ height: '120px', background: 'url(https://via.placeholder.com/400x200?text=+) center/cover no-repeat #E8E8E8', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '8px', left: '8px', background: mess.tag === 'VEG' ? '#4CAF50' : '#FF5252', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>
                          {mess.tag}
                        </div>
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', marginTop: '12px', marginBottom: '4px' }}>{mess.name}</h3>
                      <div style={{ fontSize: '12px', color: '#7E7E7E' }}>{mess.type} • {mess.distance}</div>
                    </div>
                  ))}
                </div>

                {/* OVERVIEW Category */}
                <div className="matrix-category">OVERVIEW</div>
                <div className="matrix-row" style={{ gridTemplateColumns: `200px repeat(${selectedMesses.length}, 1fr)` }}>
                  <div className="matrix-cell row-label">Overall Rating</div>
                  {selectedMesses.map(mess => (
                    <div key={mess.id} className="matrix-cell">
                      <span style={{ color: '#FF9800', fontWeight: 'bold', marginRight: '8px' }}>★★★★★</span>
                      <span style={{ fontWeight: '600' }}>{mess.rating}</span> 
                      <span style={{ color: '#7E7E7E', fontSize: '12px', marginLeft: '4px' }}>({mess.reviews})</span>
                    </div>
                  ))}
                </div>
                <div className="matrix-row" style={{ gridTemplateColumns: `200px repeat(${selectedMesses.length}, 1fr)` }}>
                  <div className="matrix-cell row-label">Cuisine Type</div>
                  {selectedMesses.map(mess => (
                    <div key={mess.id} className="matrix-cell">{mess.type}</div>
                  ))}
                </div>
                <div className="matrix-row" style={{ gridTemplateColumns: `200px repeat(${selectedMesses.length}, 1fr)` }}>
                  <div className="matrix-cell row-label">Diet Type</div>
                  {selectedMesses.map(mess => (
                    <div key={mess.id} className="matrix-cell">
                      <span style={{ padding: '4px 12px', background: mess.tag === 'VEG' ? '#4CAF50' : '#FF5252', color: 'white', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>{mess.tag}</span>
                    </div>
                  ))}
                </div>
                <div className="matrix-row" style={{ gridTemplateColumns: `200px repeat(${selectedMesses.length}, 1fr)` }}>
                  <div className="matrix-cell row-label">Distance</div>
                  {selectedMesses.map(mess => (
                    <div key={mess.id} className="matrix-cell">{mess.distance}</div>
                  ))}
                </div>

                {/* PRICING Category */}
                <div className="matrix-category">PRICING (PER MEAL)</div>
                <div className="matrix-row" style={{ gridTemplateColumns: `200px repeat(${selectedMesses.length}, 1fr)` }}>
                  <div className="matrix-cell row-label">Breakfast</div>
                  {selectedMesses.map(mess => (
                    <div key={mess.id} className="matrix-cell">₹{mess.pricing.breakfast}/day</div>
                  ))}
                </div>
                <div className="matrix-row" style={{ gridTemplateColumns: `200px repeat(${selectedMesses.length}, 1fr)` }}>
                  <div className="matrix-cell row-label">Lunch</div>
                  {selectedMesses.map(mess => (
                    <div key={mess.id} className="matrix-cell">₹{mess.pricing.lunch}/day</div>
                  ))}
                </div>
                <div className="matrix-row" style={{ gridTemplateColumns: `200px repeat(${selectedMesses.length}, 1fr)` }}>
                  <div className="matrix-cell row-label">Dinner</div>
                  {selectedMesses.map(mess => (
                    <div key={mess.id} className="matrix-cell">₹{mess.pricing.dinner}/day</div>
                  ))}
                </div>

                {/* PLANS Category */}
                <div className="matrix-category">PLANS</div>
                <div className="matrix-row" style={{ gridTemplateColumns: `200px repeat(${selectedMesses.length}, 1fr)` }}>
                  <div className="matrix-cell row-label">Trial Period</div>
                  {selectedMesses.map(mess => (
                    <div key={mess.id} className="matrix-cell">₹{mess.plans.trial}</div>
                  ))}
                </div>
                <div className="matrix-row" style={{ gridTemplateColumns: `200px repeat(${selectedMesses.length}, 1fr)` }}>
                  <div className="matrix-cell row-label">1 Month</div>
                  {selectedMesses.map(mess => (
                     <div key={mess.id} className="matrix-cell">₹{mess.plans.oneMonth}</div>
                  ))}
                </div>
                <div className="matrix-row" style={{ gridTemplateColumns: `200px repeat(${selectedMesses.length}, 1fr)` }}>
                  <div className="matrix-cell row-label">3 Months</div>
                  {selectedMesses.map(mess => (
                     <div key={mess.id} className="matrix-cell">₹{mess.plans.threeMonth}</div>
                  ))}
                </div>

                {/* TIMINGS Category */}
                <div className="matrix-category">TIMINGS</div>
                <div className="matrix-row" style={{ gridTemplateColumns: `200px repeat(${selectedMesses.length}, 1fr)` }}>
                  <div className="matrix-cell row-label">Breakfast</div>
                  {selectedMesses.map(mess => (
                    <div key={mess.id} className="matrix-cell">{mess.menu.breakfast}</div>
                  ))}
                </div>
                <div className="matrix-row" style={{ gridTemplateColumns: `200px repeat(${selectedMesses.length}, 1fr)` }}>
                  <div className="matrix-cell row-label">Lunch</div>
                  {selectedMesses.map(mess => (
                    <div key={mess.id} className="matrix-cell">{mess.menu.lunch}</div>
                  ))}
                </div>
                <div className="matrix-row" style={{ gridTemplateColumns: `200px repeat(${selectedMesses.length}, 1fr)` }}>
                  <div className="matrix-cell row-label">Dinner</div>
                  {selectedMesses.map(mess => (
                    <div key={mess.id} className="matrix-cell">{mess.menu.dinner}</div>
                  ))}
                </div>

                {/* DELIVERY & LOCATION & CONTACT */}
                <div className="matrix-category">DELIVERY</div>
                <div className="matrix-row" style={{ gridTemplateColumns: `200px repeat(${selectedMesses.length}, 1fr)` }}>
                  <div className="matrix-cell row-label">Home Delivery</div>
                  {selectedMesses.map(mess => (
                    <div key={mess.id} className="matrix-cell" style={{ color: mess.homeDelivery ? '#4CAF50' : '#F44336', fontWeight: '500' }}>
                      {mess.homeDelivery ? '✓ Available' : '✗ Not Available'}
                    </div>
                  ))}
                </div>

                <div className="matrix-category">LOCATION</div>
                <div className="matrix-row" style={{ gridTemplateColumns: `200px repeat(${selectedMesses.length}, 1fr)` }}>
                  <div className="matrix-cell row-label">Full Address</div>
                  {selectedMesses.map(mess => (
                    <div key={mess.id} className="matrix-cell" style={{ fontSize: '13px' }}>{mess.fullAddress}</div>
                  ))}
                </div>

                <div className="matrix-category">CONTACT</div>
                <div className="matrix-row" style={{ gridTemplateColumns: `200px repeat(${selectedMesses.length}, 1fr)` }}>
                  <div className="matrix-cell row-label">Phone</div>
                  {selectedMesses.map(mess => (
                    <div key={mess.id} className="matrix-cell">{mess.phone}</div>
                  ))}
                </div>

                <div className="matrix-category">PAYMENT</div>
                <div className="matrix-row" style={{ gridTemplateColumns: `200px repeat(${selectedMesses.length}, 1fr)` }}>
                  <div className="matrix-cell row-label">Accepted Methods</div>
                  {selectedMesses.map(mess => (
                    <div key={mess.id} className="matrix-cell" style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ padding: '2px 8px', background: '#FFF0E6', color: '#F26B2E', fontSize: '11px', borderRadius: '12px' }}>UPI</span>
                      <span style={{ padding: '2px 8px', background: '#FFF0E6', color: '#F26B2E', fontSize: '11px', borderRadius: '12px' }}>Cash</span>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Compare;
