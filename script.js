(() => {
  const nav = document.querySelector('.main-nav');

  if (nav) {
    document.querySelectorAll('.nav-button').forEach((button) => {
      const text = button.textContent.trim();
      if (text.startsWith('Vårt folk')) {
        const chevron = button.querySelector('.chevron');
        button.childNodes[0].nodeValue = 'Toastteamet ';
        if (chevron) chevron.textContent = '⌄';
      }
    });

    if (!nav.querySelector('a[href="onskelista.html"]')) {
      const wishlist = document.createElement('a');
      wishlist.href = 'onskelista.html';
      wishlist.className = 'nav-link';
      wishlist.textContent = 'Önskelista';
      if (location.pathname.endsWith('/onskelista.html') || location.pathname.endsWith('onskelista.html')) {
        wishlist.classList.add('active');
      }
      const faq = nav.querySelector('a[href="faq.html"]');
      nav.insertBefore(wishlist, faq || nav.querySelector('.nav-osa'));
    }
  }

  const dropdownItems = document.querySelectorAll('.has-dropdown');

  dropdownItems.forEach((item) => {
    const button = item.querySelector('.nav-button');
    if (!button) return;

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const willOpen = !item.classList.contains('open');

      dropdownItems.forEach((other) => {
        other.classList.remove('open');
        const otherButton = other.querySelector('.nav-button');
        if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
      });

      if (willOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });

    item.querySelectorAll('.dropdown a').forEach((link) => {
      link.addEventListener('click', () => {
        item.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
      });
    });
  });

  document.addEventListener('click', () => {
    dropdownItems.forEach((item) => {
      item.classList.remove('open');
      const button = item.querySelector('.nav-button');
      if (button) button.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    dropdownItems.forEach((item) => {
      item.classList.remove('open');
      const button = item.querySelector('.nav-button');
      if (button) button.setAttribute('aria-expanded', 'false');
    });
  });

  const countdown = document.querySelector('[data-countdown]');
  if (countdown) {
    const target = new Date(countdown.dataset.countdown).getTime();
    const daysEl = countdown.querySelector('[data-days]');
    const hoursEl = countdown.querySelector('[data-hours]');
    const minutesEl = countdown.querySelector('[data-minutes]');
    const secondsEl = countdown.querySelector('[data-seconds]');

    const updateCountdown = () => {
      const diff = Math.max(0, target - Date.now());
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (daysEl) daysEl.textContent = String(days);
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    };

    updateCountdown();
    window.setInterval(updateCountdown, 1000);
  }

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('visible'));
  }
})();
