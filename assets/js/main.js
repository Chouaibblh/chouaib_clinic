(function () {
  "use strict";

  // === Highlight active page in navigation ===
  function setActiveNav() {
    const current = location.pathname.split('/').slice(-1)[0] || 'index.html';
    document.querySelectorAll('.nav a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === current) {
        link.classList.add('active');
      }
    });
  }

  // Run on load and on history changes
  window.addEventListener('load', setActiveNav);
  window.addEventListener('popstate', setActiveNav);

  // === Mobile nav toggle (hamburger) ===
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', function () {
      document.body.classList.toggle('mobile-nav-active');
      this.classList.toggle('bi-list');
      this.classList.toggle('bi-x');
    });
  }

  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
      if (document.body.classList.contains('mobile-nav-active')) {
        document.body.classList.remove('mobile-nav-active');
        mobileNavToggleBtn?.classList.add('bi-list');
        mobileNavToggleBtn?.classList.remove('bi-x');
      }
    });
  });

  // === jQuery Functionalities ===
  $(document).ready(function() {
    // Hover effects on nav links and buttons
    $('.nav a, .btn').hover(
      function() {
        $(this).animate({ opacity: 0.7 }, 200);
      },
      function() {
        $(this).animate({ opacity: 1 }, 200);
      }
    );

    // Accordion on services page
    $('.accordion-header').click(function() {
      $(this).toggleClass('active');
      $(this).nextAll('.accordion-body:first').slideToggle(300);
    });

    // Dynamic form on appointment page
    const serviceSelect = $('select[name="service"]');
    const doctorSelect = $('select[name="doctor"]');
    const timeSlotLabel = $('#time-slot-label');

    if (serviceSelect.length) {
      const doctorsByService = {
        'Family Medicine': [
          { value: 'dr-jane-smith', text: 'Dr. Jane Smith – Family Medicine' }
        ],
        'Internal Medicine': [
          { value: 'dr-omar-reyes', text: 'Dr. Omar Reyes – Internal Medicine' }
        ],
        'Pediatrics': [
          { value: 'dr-priya-patel', text: 'Dr. Priya Patel – Pediatrics' }
        ],
        'Special Consultation': [
          { value: 'dr-jane-smith', text: 'Dr. Jane Smith – Family Medicine' },
          { value: 'dr-omar-reyes', text: 'Dr. Omar Reyes – Internal Medicine' },
          { value: 'dr-priya-patel', text: 'Dr. Priya Patel – Pediatrics' }
        ]
      };

      serviceSelect.change(function() {
        const service = $(this).val();
        doctorSelect.empty().append('<option value="" disabled selected>Select a doctor</option>');
        
        if (doctorsByService[service]) {
          doctorsByService[service].forEach(doc => {
            doctorSelect.append(`<option value="${doc.value}">${doc.text}</option>`);
          });
        }

        // Show/hide preferred time slot for special consultation
        timeSlotLabel.toggle(service === 'Special Consultation');
      });
    }
  });

  // === Appointment form handler ===
  const appointmentForm = document.getElementById('appointment-form');
  if (appointmentForm) {
    // Age calculation on birthdate change
    const birthdateInput = document.querySelector('input[name="birthdate"]');
    const ageDisplay = document.getElementById('age-display');
    if (birthdateInput && ageDisplay) {
      birthdateInput.addEventListener('change', () => {
        const birthDate = new Date(birthdateInput.value);
        const today = new Date('2025-11-28'); // Using provided current date
        if (!isNaN(birthDate)) {
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          ageDisplay.textContent = (age >= 0) ? `Age: ${age}` : '';
        } else {
          ageDisplay.textContent = '';
        }
      });
    }

    // Form submission with validation
    appointmentForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let valid = true;

      // Clear previous errors
      document.querySelectorAll('.error').forEach(el => el.textContent = '');

      // Name
      const name = document.querySelector('input[name="name"]');
      if (!name.value.trim()) {
        name.nextElementSibling.textContent = 'Name is required';
        valid = false;
      }

      // Email
      const email = document.querySelector('input[name="email"]');
      if (!email.value.trim()) {
        email.nextElementSibling.textContent = 'Email is required';
        valid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
        email.nextElementSibling.textContent = 'Invalid email format';
        valid = false;
      }

      // Phone (optional, but validate if provided)
      const phone = document.querySelector('input[name="phone"]');
      const phoneValue = phone.value.trim().replace(/\D/g, ''); // Remove non-digits
      if (phoneValue && (phoneValue.length < 10 || phoneValue.length > 15)) {
        phone.nextElementSibling.textContent = 'Phone should be 10-15 digits';
        valid = false;
      }

      // Service
      const service = document.querySelector('select[name="service"]');
      if (!service.value) {
        service.nextElementSibling.textContent = 'Please select a service';
        valid = false;
      }

      // Doctor
      const doctor = document.querySelector('select[name="doctor"]');
      if (!doctor.value) {
        doctor.nextElementSibling.textContent = 'Please select a doctor';
        valid = false;
      }

      // Birthdate
      const birthdate = document.querySelector('input[name="birthdate"]');
      if (!birthdate.value) {
        birthdate.parentElement.querySelector('.error').textContent = 'Birthdate is required';
        valid = false;
      }

      // Date
      const apptDate = document.querySelector('input[name="date"]');
      if (!apptDate.value) {
        apptDate.nextElementSibling.textContent = 'Date is required';
        valid = false;
      }

      // Time
      const time = document.querySelector('select[name="time"]');
      if (!time.value) {
        time.nextElementSibling.textContent = 'Please select a time';
        valid = false;
      }

      // Time Slot (if shown and required for special)
      const timeSlot = document.querySelector('input[name="time_slot"]');
      if (timeSlot && timeSlot.parentElement.style.display !== 'none' && !timeSlot.value.trim()) {
        timeSlot.nextElementSibling.textContent = 'Custom time slot is required for special consultation';
        valid = false;
      }

      if (valid) {
        appointmentForm.style.display = 'none';
        document.getElementById('appointment-success').style.display = 'block';
        // In a real app, send data via fetch/AJAX here
      }
    });
  }

  // === Scroll top button (if added later) ===
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    const toggleScrollTop = () => scrollTop.classList.toggle('active', window.scrollY > 100);
    scrollTop.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', toggleScrollTop);
    window.addEventListener('load', toggleScrollTop);
  }

  // === AOS init (if used later) ===
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }

})();