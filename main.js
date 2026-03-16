// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GLOBAL INITIALIZATION & GSAP SETUP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor Implementation
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

if (window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    // Dot follows exactly
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
    
    // Ring follows with a slight delay
    gsap.to(cursorRing, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.15,
      ease: "power2.out"
    });
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ─── SCENE & AVATAR MANAGEMENT ───────────────────────────────────────────
const avatarContainer = document.querySelector('.avatar-canvas-container');
const sceneAvatars    = document.querySelectorAll('.scene-avatar');

// Per-scene background colour for the gradient overlays on the avatar panel.
const SCENE_BG = [
  '#060b18', // 0 Hero
  '#060b18', // 1 Education
  '#060b18', // 2 Coding
  '#060b18', // 3 Finance
  '#060b18', // 4 Marketing
  '#060b18', // 5 AI
  '#060b18', // 6 Creative
  '#060b18', // 7 Experience
  '#060b18', // 8 Contact
];

// Per-scene alignment for the portrait panel
const SCENE_ALIGN = [
  'right', // 0 Hero
  'right', // 1 Education
  'left',  // 2 Coding
  'left',  // 3 Finance
  'left',  // 4 Marketing
  'left',  // 5 AI
  'right', // 6 Creative
  'right', // 7 Experience
  'right', // 8 Contact
];

function switchScene(index) {
  // ── 1. Body class for scene background ───────────────
  document.body.className = '';
  document.body.classList.add(`scene-${index}-active`);

  // ── 2. Nav dot ────────────────────────────────────────
  document.querySelectorAll('.scene-dot').forEach(d => d.classList.remove('active'));
  const dot = document.querySelector(`.scene-dot[data-scene="${index}"]`);
  if (dot) dot.classList.add('active');

  // ── 3. Crossfade portrait & set alignment ────────────
  sceneAvatars.forEach(img => {
    img.classList.toggle('active', parseInt(img.dataset.scene) === index);
  });

  if (avatarContainer) {
    // Set alignment class
    const align = SCENE_ALIGN[index] || 'right';
    avatarContainer.classList.remove('align-left', 'align-right');
    avatarContainer.classList.add(`align-${align}`);
    
    // Update gradient colour to match scene bg
    const bg = SCENE_BG[index] || SCENE_BG[0];
    avatarContainer.style.setProperty('--scene-bg', bg);
  }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCROLL ANIMATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 1. Scene Transitions (Trigger on section enter)
document.querySelectorAll('.scene').forEach((scene, index) => {
  ScrollTrigger.create({
    trigger: scene,
    start: "top center",
    onEnter: () => switchScene(index),
    onEnterBack: () => switchScene(index)
  });
});

// 2. Scene 0 (Hero) Content Reveal Stagger
const heroElements = [
  '.fade-up-1', '.fade-up-2', '.fade-up-3', '.fade-up-4', '.fade-up-5'
];

gsap.from(heroElements, {
  y: 40,
  opacity: 0,
  duration: 1,
  stagger: 0.15,
  ease: "power3.out",
  delay: 0.2 // Wait a bit on load
});

// 3. Avatar Global Scroll Effect (Walk forward/rotate slightly)
// For model-viewer, we can manipulate camera-orbit or transform
ScrollTrigger.create({
  trigger: "body",
  start: "top top",
  end: "bottom bottom",
  scrub: 1,
  onUpdate: (self) => {
    const progress = self.progress;
    // Example: slight rotation as you scroll down
    if (avatar) {
      const angle = (progress * 45) + 'deg';
      avatar.setAttribute('camera-orbit', `${angle} 75deg 105%`);
    }
  }
});

// 4. Scene 1 (Education) Animations
gsap.from(".fade-up-scene1", {
  scrollTrigger: {
    trigger: "#scene-1",
    start: "top center",
  },
  y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out"
});

gsap.from(".edu-card", {
  scrollTrigger: {
    trigger: ".timeline",
    start: "top center+=100", // Start slightly lower to give time to read headers
  },
  x: 50, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power3.out"
});

// 5. Scene 2 (Coding) Matrix Canvas Effect
const canvas = document.getElementById('matrix-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~';
  const fontSize = 14;
  let columns = canvas.width / fontSize;
  let drops = [];
  for (let x = 0; x < columns; x++) { drops[x] = 1; }

  const drawMatrix = () => {
    // Check if scene 2 is active to save resources
    if (!document.body.classList.contains('scene-2-active')) return;

    ctx.fillStyle = 'rgba(5, 12, 26, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#3B82F6';
    ctx.font = fontSize + 'px monospace';

    for(let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
  };
  
  window.addEventListener('resize', () => {
    resizeCanvas();
    columns = canvas.width / fontSize;
    drops = [];
    for (let x = 0; x < columns; x++) { drops[x] = 1; }
  });

  setInterval(drawMatrix, 50);
}

// 6. Scene 2 (Coding) Animations
gsap.from(".fade-up-scene2", {
  scrollTrigger: {
    trigger: "#scene-2",
    start: "top center",
  },
  y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out"
});

/*
gsap.from(".project-card", {
  scrollTrigger: {
    trigger: "#scene-2",
    start: "top center",
  },
  y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out"
});
*/

// 7. Scene 3 (Finance) Animations
gsap.from(".fade-up-scene3", {
  scrollTrigger: {
    trigger: "#scene-3",
    start: "top center",
  },
  y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out"
});

/*
gsap.from(".fin-card", {
  scrollTrigger: {
    trigger: "#scene-3",
    start: "top center",
  },
  x: -50, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out"
});
*/

// 8. Number Counting Animation (Fixed)
document.querySelectorAll('.count-number').forEach(counter => {
  const target = parseFloat(counter.getAttribute('data-target'));
  const decimals = counter.getAttribute('data-decimals') ? parseInt(counter.getAttribute('data-decimals')) : 0;
  
  let countObj = { val: 0 };

  ScrollTrigger.create({
    trigger: counter,
    start: "top center+=200",
    once: true,
    onEnter: () => {
      gsap.to(countObj, {
        val: target,
        duration: 2,
        ease: "power1.out",
        onUpdate: function() {
          let currentVal = countObj.val;
          if (decimals > 0) {
            currentVal = currentVal.toFixed(decimals);
          } else {
            currentVal = Math.round(currentVal);
          }
          counter.innerText = Number(currentVal).toLocaleString('en-IN');
        }
      });
    }
  });
});

// 9. Scene 4 (Marketing) Animations
gsap.from(".fade-up-scene4", {
  scrollTrigger: {
    trigger: "#scene-4",
    start: "top center",
  },
  y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out"
});

/*
gsap.from(".marketing-card", {
  scrollTrigger: {
    trigger: "#scene-4",
    start: "top center",
  },
  y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out"
});
*/

// 10. Scene 5 (AI) Neural Network Canvas Effect
const aiCanvas = document.getElementById('neural-canvas');
if (aiCanvas) {
  const ctx = aiCanvas.getContext('2d');
  
  const resizeAiCanvas = () => {
    aiCanvas.width = window.innerWidth;
    aiCanvas.height = window.innerHeight;
  };
  resizeAiCanvas();

  const nodes = [];
  const numNodes = 70;
  const maxDistance = 150;

  for (let i = 0; i < numNodes; i++) {
    nodes.push({
      x: Math.random() * aiCanvas.width,
      y: Math.random() * aiCanvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1
    });
  }

  let isScene5Visible = false;
  
  // Use IntersectionObserver to pause/play animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isScene5Visible = entry.isIntersecting;
    });
  }, { threshold: 0 });
  
  observer.observe(document.getElementById('scene-5'));

  const drawNeuralNet = () => {
    requestAnimationFrame(drawNeuralNet);
    if (!isScene5Visible) return;

    ctx.clearRect(0, 0, aiCanvas.width, aiCanvas.height);
    
    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59, 130, 246, ${1 - dist / maxDistance})`; // Blue glow
          ctx.lineWidth = 0.5;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw and update nodes
    ctx.fillStyle = '#60A5FA';
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();

      // Move node
      node.x += node.vx;
      node.y += node.vy;

      // Bounce off edges
      if (node.x < 0 || node.x > aiCanvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > aiCanvas.height) node.vy *= -1;
    }
  };
  
  window.addEventListener('resize', resizeAiCanvas);
  requestAnimationFrame(drawNeuralNet);
}

// 11. Scene 5 (AI) Animations
gsap.from(".fade-up-scene5", {
  scrollTrigger: {
    trigger: "#scene-5",
    start: "top center",
  },
  y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out"
});

/*
gsap.from(".ai-card", {
  scrollTrigger: {
    trigger: "#scene-5",
    start: "top center",
  },
  y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out"
});
*/

// 12. Scene 6 (Creative) Animations
gsap.from(".fade-up-scene6", {
  scrollTrigger: {
    trigger: "#scene-6",
    start: "top center",
  },
  y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out"
});

// ─── Creative Portfolio — Horizontal Playing Card Spread ───
const tabBtns = document.querySelectorAll('.tab-btn');
const allFanCards = Array.from(document.querySelectorAll('.fan-card'));

// ── HOW IT WORKS (matching the reference images) ──────────────────────────
// Cards sit in a horizontal row, overlapping like a spread deck on a table.
// Each card is almost upright — only very slight tilt at the edges.
// On hover: hovered card rises 150px, left cards glide LEFT, right cards glide RIGHT.
// ─────────────────────────────────────────────────────────────────────────
const FAN = {
  cardWidth:    200,   // px  (must match CSS width)
  overlap:      90,    // px  cards overlap by this much (lower = more spread)
  restTilt:     1.5,   // degrees per step from center (very subtle tilt)
  hoverLift:    150,   // px  how high the hovered card rises
  neighborShift: 55,   // px  extra horizontal slide for each neighbor away from hover
  neighborTilt:  3,    // extra degrees each neighbor tilts away on hover
  dur:          0.35,  // animation duration
};

let currentCards = [];
let fanAC = null;   // AbortController for hover listeners

function getBaseX(i, total) {
  const step = FAN.cardWidth - FAN.overlap;
  const mid  = (total - 1) / 2;
  return (i - mid) * step;
}

function getBaseAngle(i, total) {
  const mid = (total - 1) / 2;
  return (i - mid) * FAN.restTilt;
}

function layoutFanCards(filter) {
  // Show / hide cards
  const visible = allFanCards.filter(card => {
    const show = filter === 'all' || card.classList.contains(filter);
    card.style.display = show ? 'block' : 'none';
    return show;
  });

  const total = visible.length;

  // Assign z-index so left cards go behind right cards (as in a real hand)
  visible.forEach((card, i) => {
    card._bx    = getBaseX(i, total);
    card._bAngle = getBaseAngle(i, total);
    card._idx   = i;
    card.style.zIndex = i + 10;

    // Animate into position
    gsap.fromTo(card,
      { opacity: 0, y: 40, x: card._bx, rotation: card._bAngle },
      {
        opacity:  1,
        x:        card._bx,
        y:        0,
        rotation: card._bAngle,
        duration: FAN.dur + 0.1,
        delay:    i * 0.04,
        ease:     'power3.out',
        overwrite: true,
      }
    );
  });

  currentCards = visible;
  attachHoverHandlers(visible);
}

function attachHoverHandlers(visible) {
  if (fanAC) fanAC.abort();
  fanAC = new AbortController();
  const { signal } = fanAC;

  visible.forEach((card, i) => {
    const video = card.querySelector('video');

    card.addEventListener('mouseenter', () => {
      card.classList.add('is-hovered');
      card.style.zIndex = 999;

      // Lift the hovered card straight up
      gsap.to(card, {
        y:        -FAN.hoverLift,
        x:        card._bx,
        rotation: 0,
        duration: FAN.dur,
        ease:     'power2.out',
        overwrite: true,
      });

      if (video) video.play().catch(() => {});

      // Push every other card away (left ones go more left, right ones more right)
      currentCards.forEach((sibling, j) => {
        if (sibling === card) return;
        const dir   = j < i ? -1 : 1;
        const steps = Math.abs(j - i);
        gsap.to(sibling, {
          y:        0,
          x:        sibling._bx + dir * FAN.neighborShift * Math.min(steps, 1.5),
          rotation: sibling._bAngle + dir * FAN.neighborTilt * steps,
          duration: FAN.dur,
          ease:     'power2.out',
          overwrite: true,
        });
      });
    }, { signal });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('is-hovered');
      card.style.zIndex = i + 10;
      if (video) video.pause();

      // Snap everyone back to base positions
      currentCards.forEach((sibling, j) => {
        sibling.style.zIndex = j + 10;
        gsap.to(sibling, {
          y:        0,
          x:        sibling._bx,
          rotation: sibling._bAngle,
          duration: FAN.dur,
          ease:     'power2.out',
          overwrite: true,
        });
      });
    }, { signal });
  });
}

// Boot
layoutFanCards('all');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    layoutFanCards(btn.getAttribute('data-filter'));
  });
});




// 13. Scene 7 (Experience) Animations
gsap.from(".fade-up-scene7", {
  scrollTrigger: {
    trigger: "#scene-7",
    start: "top center",
  },
  y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out"
});

// Scene 7 Counters
const expCounters = document.querySelectorAll('#scene-7 .count-number');
ScrollTrigger.create({
  trigger: "#scene-7",
  start: "top center",
  onEnter: () => {
    expCounters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      gsap.to(counter, {
        innerHTML: target,
        duration: 2,
        snap: { innerHTML: 1 },
        ease: "power2.out"
      });
    });
  },
  once: true
});

// 14. Scene 8 (Contact) Animations
gsap.from(".fade-up-scene8", {
  scrollTrigger: {
    trigger: "#scene-8",
    start: "top center",
  },
  y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out"
});

gsap.from(".credits-content", {
  scrollTrigger: {
    trigger: ".rolling-credits",
    start: "top bottom",
  },
  y: 50, opacity: 0, duration: 1.5, ease: "power2.out"
});



// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DETAIL MODAL — open/close system
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(function initModal() {
  const modal     = document.getElementById('detail-modal');
  const backdrop  = document.getElementById('modal-backdrop');
  const closeBtn  = document.getElementById('modal-close');
  const elTitle   = document.getElementById('modal-title');
  const elOrg     = document.getElementById('modal-org');
  const elPeriod  = document.getElementById('modal-period');
  const elLoc     = document.getElementById('modal-loc');
  const elBody    = document.getElementById('modal-body');
  const elTags    = document.getElementById('modal-tags');

  if (!modal) return;

  function openModal(el) {
    const d = el.dataset;
    elTitle.textContent  = d.modalTitle  || '';
    elOrg.textContent    = d.modalOrg    || '';
    elPeriod.textContent = d.modalPeriod || '';
    elLoc.textContent    = d.modalLoc    || '';
    elBody.textContent   = d.modalBody   || '';

    // Render tag pills
    elTags.innerHTML = '';
    if (d.modalTags) {
      d.modalTags.split('|').forEach(tag => {
        const span = document.createElement('span');
        span.className = 'modal-tag';
        span.textContent = tag.trim();
        elTags.appendChild(span);
      });
    }

    // Hide empty meta items
    elOrg.style.display    = elOrg.textContent    ? '' : 'none';
    elPeriod.style.display = elPeriod.textContent ? '' : 'none';
    elLoc.style.display    = elLoc.textContent    ? '' : 'none';

    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  // Delegate click to every .clickable-card
  document.addEventListener('click', e => {
    const card = e.target.closest('.clickable-card');
    if (card && card.dataset.modalTitle) {
      e.stopPropagation();
      openModal(card);
    }
  });

  // Close via backdrop or X button
  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
})();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONTACT FORM — EmailJS Integration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent standard page reload
      
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending... <span class="arrow">⌛</span>';
      submitBtn.disabled = true;

      // TODO: Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with actual EmailJS IDs
      // emailjs.sendForm('portfolio', 'template_fe9jm27', this)
      
      // We wrap the emailjs call in a try/catch in case the SDK didn't load or keys are missing
      try {
        emailjs.sendForm('portfolio', 'template_fe9jm27', this)
          .then(() => {
            console.log('SUCCESS!');
            submitBtn.innerHTML = 'Sent Successfully! <span class="arrow">✓</span>';
            submitBtn.style.backgroundColor = 'rgba(16, 185, 129, 0.2)'; // Green tint
            submitBtn.style.color = '#10B981';
            submitBtn.style.borderColor = '#10B981';
            contactForm.reset();
            
            // Show Success Toast
            const toast = document.getElementById('success-toast');
            if (toast) {
              toast.classList.add('show');
              setTimeout(() => toast.classList.remove('show'), 5000);
            }
            
            // Reset button after 3 seconds
            setTimeout(() => {
              submitBtn.innerHTML = originalText;
              submitBtn.style = ''; // Clear inline styles
              submitBtn.disabled = false;
            }, 3000);
          }, (error) => {
            console.log('FAILED...', error);
            submitBtn.innerHTML = 'Failed to Send <span class="arrow">✕</span>';
            submitBtn.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'; // Red tint
            submitBtn.style.color = '#EF4444';
            submitBtn.style.borderColor = '#EF4444';
            
            // Re-enable so they can try again
            setTimeout(() => {
              submitBtn.innerHTML = originalText;
              submitBtn.style = '';
              submitBtn.disabled = false;
            }, 3000);
          });
      } catch (err) {
        console.error("EmailJS Error (Missing Keys?):", err);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        alert("Email service isn't fully configured yet. Please set up the EmailJS keys in the code.");
      }
    });
  }
})();
