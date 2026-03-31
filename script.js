// script.js — AgriMitra UI interactions

// ── Smooth scroll ──
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (a) {
    const id = a.getAttribute('href');
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

// ── Hamburger ──
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('main-nav');
if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  // Close on nav link click (mobile)
  mainNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// ── Tabs ──
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById(btn.dataset.tab);
    if (target) target.classList.add('active');
  });
});

// ── Crop Recommendation ──
const recBtn = document.getElementById('get-recommendation');
if (recBtn) {
  recBtn.addEventListener('click', () => {
    const output = document.getElementById('recommendation-output');
    const inputs = {
      nitrogen: parseFloat(document.getElementById('nitrogen')?.value) || null,
      phosphorus: parseFloat(document.getElementById('phosphorus')?.value) || null,
      potassium: parseFloat(document.getElementById('potassium')?.value) || null,
      ph: parseFloat(document.getElementById('ph')?.value) || null,
      land: parseFloat(document.getElementById('land')?.value) || null,
      soil: document.getElementById('soil')?.value || 'loam',
      humidity: parseFloat(document.getElementById('humidity')?.value) || null,
      rainfall: parseFloat(document.getElementById('rainfall')?.value) || null,
      temperature: parseFloat(document.getElementById('temperature')?.value) || null,
    };

    // Loading state
    output.innerHTML = '<p style="color:var(--text-muted);padding:20px 0;">Analysing field parameters…</p>';

    // Simulated delay + response
    setTimeout(() => {
      /*
        Replace this block with:
        fetch('/api/recommend', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(inputs) })
          .then(r => r.json()).then(renderRecommendations).catch(err => output.innerHTML = '<p>Error: ' + err.message + '</p>');
      */
      const crops = [
        { name: 'Maize', score: 92, yield: '4.8 t/acre', price: '₹1,760/qt', icon: '🌽' },
        { name: 'Soybean', score: 86, yield: '4.5 t/acre', price: '₹3,880/qt', icon: '🫘' },
        { name: 'Sorghum', score: 74, yield: '3.7 t/acre', price: '₹2,040/qt', icon: '🌾' },
      ];

      const rankClass = (i) => i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : 'rank-3';
      const badgeClass = (i) => i === 0 ? 'gold' : '';
      const rankLabel = (i) => i === 0 ? '🥇 Best Match' : i === 1 ? '🥈 Runner Up' : '🥉 Alternate';

      output.innerHTML = `
        <h3>Top 3 Crop Recommendations</h3>
        <div class="rec-cards">
          ${crops.map((c, i) => `
            <div class="rec-card ${rankClass(i)}">
              <div class="rec-card-header">
                <div class="rec-crop-name">${c.icon} ${c.name}</div>
                <div class="rec-badge ${badgeClass(i)}">${c.score}%</div>
              </div>
              <div style="font-size:.72rem;color:var(--text-dim);margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em;">${rankLabel(i)}</div>
              <div class="score-bar">
                <div class="score-bar-track">
                  <div class="score-bar-fill ${badgeClass(i)}" style="width:0%" data-target="${c.score}"></div>
                </div>
              </div>
              <div class="rec-meta">
                <div>
                  <div class="rec-meta-label">Expected Yield</div>
                  <div class="rec-meta-value">${c.yield}</div>
                </div>
                <div>
                  <div class="rec-meta-label">Market Price</div>
                  <div class="rec-meta-value">${c.price}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      // Animate score bars
      requestAnimationFrame(() => {
        document.querySelectorAll('.score-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.target + '%';
        });
      });
    }, 800);
  });
}

// ── Disease Prediction ──
const fileInput = document.getElementById('disease-image');
const uploadBtn = document.getElementById('upload-btn');
const cameraBtn = document.getElementById('camera-btn');

if (uploadBtn && fileInput) {
  uploadBtn.addEventListener('click', () => {
    fileInput.removeAttribute('capture');
    fileInput.click();
  });
}

if (cameraBtn && fileInput) {
  cameraBtn.addEventListener('click', () => {
    fileInput.setAttribute('capture', 'environment');
    fileInput.click();
  });
}

if (fileInput) {
  fileInput.addEventListener('change', (e) => {
    const out = document.getElementById('disease-output');
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (out) {
        out.innerHTML = `
          <div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;">
            <img src="${ev.target.result}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;border:1px solid var(--border);">
            <div>
              <div style="font-weight:600;font-size:.9rem;">${file.name}</div>
              <div style="font-size:.78rem;color:var(--text-muted);">${(file.size/1024).toFixed(1)} KB · Ready for analysis</div>
            </div>
          </div>`;
      }
    };
    reader.readAsDataURL(file);
  });
}

const predictBtn = document.getElementById('predict-disease');
if (predictBtn) {
  predictBtn.addEventListener('click', () => {
    const out = document.getElementById('disease-output');
    if (!fileInput?.files?.[0]) {
      if (out) out.innerHTML = '<p style="color:var(--danger);padding:12px 0;">Please upload or capture a leaf image first.</p>';
      return;
    }

    out.innerHTML = '<p style="color:var(--text-muted);padding:12px 0;">Analysing image…</p>';

    setTimeout(() => {
      /*
        Replace with:
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        fetch('/api/predict', { method:'POST', body: formData })
          .then(r => r.json()).then(renderDisease).catch(console.error);
      */
      const result = {
        disease: 'Early Blight (Alternaria solani)',
        confidence: '91%',
        severity: 'Moderate',
        remedies: [
          'Remove and destroy all visibly infected leaves immediately',
          'Apply mancozeb or chlorothalonil-based fungicide every 7–10 days',
          'Ensure adequate plant spacing for air circulation',
        ],
        precautions: [
          'Avoid overhead irrigation — use drip or furrow irrigation',
          'Rotate crops — do not plant the same family next season',
          'Use certified disease-resistant seed varieties',
          'Monitor fields weekly during humid conditions',
        ],
      };

      out.innerHTML = `
        <div class="disease-result-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;flex-wrap:wrap;gap:8px;">
            <div class="disease-name">⚠️ ${result.disease}</div>
            <div style="display:flex;gap:8px;">
              <span class="badge" style="background:rgba(224,92,92,.12);color:var(--danger);border-color:rgba(224,92,92,.2);">Confidence: ${result.confidence}</span>
              <span class="badge warning">Severity: ${result.severity}</span>
            </div>
          </div>
          <div class="disease-grid">
            <div class="disease-block">
              <h4>Recommended Remedies</h4>
              <ul>${result.remedies.map(r => `<li>${r}</li>`).join('')}</ul>
            </div>
            <div class="disease-block">
              <h4>Preventive Precautions</h4>
              <ul>${result.precautions.map(p => `<li>${p}</li>`).join('')}</ul>
            </div>
          </div>
        </div>`;
    }, 900);
  });
}

// ── Contact Form ──
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name')?.value.trim();
    const email = document.getElementById('contact-email')?.value.trim();
    const msg = document.getElementById('contact-message')?.value.trim();
    if (!name || !email || !msg) {
      alert('Please fill in all required fields.');
      return;
    }
    // fetch('/api/contact', { method:'POST', body: JSON.stringify({name,email,msg}) })
    const btn = contactForm.querySelector('button[type="submit"]');
    if (btn) { btn.textContent = '✓ Message Sent'; btn.disabled = true; }
    setTimeout(() => {
      contactForm.reset();
      if (btn) { btn.textContent = 'Send Message →'; btn.disabled = false; }
    }, 3000);
  });
}

// ── Service Worker ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.warn('SW failed:', err));
  });
}
