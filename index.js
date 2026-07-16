document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation Toggle ---
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && e.target !== navToggle) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
      }
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  // --- Navbar Scroll Styling ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- Scroll Active Highlight ---
  const sections = document.querySelectorAll('section, header');
  const scrollOffset = 150; // offset for triggers

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - scrollOffset;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // --- Phone Mockup Carousel ---
  const phoneButtons = document.querySelectorAll('.phone-control-btn');
  const phoneSlides = document.querySelectorAll('.phone-slide-img');
  let autoplayInterval;
  const slideOrder = ['onboarding', 'dashboard', 'diet', 'workout', 'trends'];
  let currentSlideIndex = 0;
  let userInteracted = false;

  function switchPhoneSlide(slideId) {
    // Update buttons
    phoneButtons.forEach(btn => {
      if (btn.getAttribute('data-slide') === slideId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update images
    phoneSlides.forEach(slide => {
      if (slide.getAttribute('id') === `slide-${slideId}`) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Sync index
    currentSlideIndex = slideOrder.indexOf(slideId);
  }

  // Button clicks
  phoneButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      userInteracted = true;
      clearInterval(autoplayInterval); // Stop autoplay
      const slideId = btn.getAttribute('data-slide');
      switchPhoneSlide(slideId);
    });
  });

  // Autoplay function
  function startPhoneAutoplay() {
    autoplayInterval = setInterval(() => {
      if (!userInteracted) {
        currentSlideIndex = (currentSlideIndex + 1) % slideOrder.length;
        const nextSlideId = slideOrder[currentSlideIndex];
        switchPhoneSlide(nextSlideId);
      }
    }, 4500);
  }
  startPhoneAutoplay();


  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionButton = item.querySelector('.faq-question');
    const answerDiv = item.querySelector('.faq-answer');

    questionButton.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all first (Accordion style)
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      // Open clicked one if it wasn't active
      if (!isActive) {
        item.classList.add('active');
        answerDiv.style.maxHeight = answerDiv.scrollHeight + 'px';
      }
    });
  });


  // --- AI Chat Assistant Simulator ---
  const chatBody = document.getElementById('chat-body');
  const suggestButtons = document.querySelectorAll('.chat-suggest-btn');

  // Answers based on app logs shown in screenshots
  const responses = {
    'Why am I feeling tired today?': "Based on your logs, you slept 9 hours 55 minutes, but you're only at 15g protein out of your 100g goal today. Since it's **Cycle Day 1** (Menstrual Phase), progesterone levels are low. Let's skip intense training today and focus on our recommended 25-minute **Restorative Stretch**.",
    
    'What should I eat tonight?': "You've only tracked 190 kcal so far (15g Protein, 10g Carbs, 10g Fats). I suggest a low glycemic index, high-protein meal tonight to stabilize blood sugar and hit your goals. Try a **Grilled Chicken Salad** (20g protein, Low GI) or a warm **Chickpea Curry** (15g protein, Low GI).",
    
    'Why are my cramps worse this cycle?': "Analyzing your records: your previous cycles were 28 days (Apr 8) and 36 days (May 6). There's a correlation where less sleep and higher carbohydrate intakes during the late Luteal phase correspond with stronger cramps on **Cycle Day 1**. Let's stay hydrated and do a gentle pelvic-tension workout today."
  };

  suggestButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.getAttribute('data-q');
      if (!query || btn.disabled) return;

      // Disable buttons temporarily
      suggestButtons.forEach(b => b.disabled = true);

      // Append user bubble
      appendMessage(query, 'user');

      // Simulated typing delay
      setTimeout(() => {
        // Append bot typing placeholder
        const typingId = appendTypingIndicator();

        setTimeout(() => {
          // Remove typing placeholder and add actual message
          removeTypingIndicator(typingId);
          appendMessage(responses[query] || "I'm analyzing your symptom patterns right now. Let me review your diet and sleep logs.", 'bot');
          
          // Re-enable buttons
          suggestButtons.forEach(b => b.disabled = false);
        }, 1200);
      }, 400);
    });
  });

  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    msgDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function appendTypingIndicator() {
    const indicatorDiv = document.createElement('div');
    indicatorDiv.className = 'chat-msg bot typing-indicator';
    indicatorDiv.id = 'typing-indicator-temp';
    indicatorDiv.innerHTML = '<span></span><span></span><span></span>';
    
    // Typing indicator CSS overrides inside JS
    indicatorDiv.style.display = 'inline-flex';
    indicatorDiv.style.gap = '4px';
    indicatorDiv.style.alignItems = 'center';
    indicatorDiv.style.padding = '12px 18px';
    
    const dots = indicatorDiv.innerHTML;
    indicatorDiv.innerHTML = `
      <style>
        .typing-indicator span {
          width: 6px;
          height: 6px;
          background-color: var(--text-muted);
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.4s infinite both;
        }
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      </style>
      <span></span><span></span><span></span>
    `;

    chatBody.appendChild(indicatorDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    return indicatorDiv.id;
  }

  function removeTypingIndicator(id) {
    const indicator = document.getElementById(id);
    if (indicator) {
      chatBody.removeChild(indicator);
    }
  }

});
