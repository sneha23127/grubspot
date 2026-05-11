import React from 'react';

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ marginBottom: '16px' }}>
              <div className="logo-icon">GS</div>
              <div className="brand-name" style={{ color: 'white' }}>GrubSpot</div>
            </div>
            <p className="footer-text">
              Helping students in Bengaluru discover the best home-style mess services. 
              Eat well, stay healthy!
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <span className="social-pill">Facebook</span>
              <span className="social-pill">Instagram</span>
              <span className="social-pill">Twitter</span>
            </div>
          </div>
          
          <div className="feedback-form">
            <h3 className="footer-heading">Send Us Feedback</h3>
            <p className="footer-text" style={{ marginBottom: '16px', fontSize: '13px' }}>Have suggestions or found an issue? Let us know!</p>
            <div style={{ position: 'relative' }}>
              <input type="text" placeholder="Your message..." style={{ width: '100%', padding: '12px 100px 12px 16px', borderRadius: '24px', background: '#222', border: 'none', color: 'white', fontSize: '14px' }} />
              <button className="feedback-send-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                Send
              </button>
            </div>
          </div>

          <div>
            <h3 className="footer-heading">Contact Us</h3>
            <ul className="contact-info" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#AAA' }}>
                <span style={{ color: 'var(--orange)' }}>📍</span> 
                GrubSpot HQ, Koramangala 5th Block, Bengaluru - 560095
              </li>
              <li style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#AAA' }}>
                <span style={{ color: 'var(--orange)' }}>📞</span> 
                +91 80 4567 8900
              </li>
              <li style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#AAA' }}>
                <span style={{ color: 'var(--orange)' }}>✉️</span> 
                hello@grubspot.in
              </li>
            </ul>
            <div style={{ display: 'flex', gap: '16px', marginTop: '20px', fontSize: '12px', color: '#666' }}>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Help Center</span>
            </div>
          </div>
        </div>
        
        <div style={{ paddingTop: '20px', marginTop: '30px', borderTop: '1px solid #222', textAlign: 'center', fontSize: '12px', color: '#444' }}>
          © 2026 GrubSpot. All rights reserved. Made with ❤️ in Bengaluru.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
