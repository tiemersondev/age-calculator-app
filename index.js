const form = document.getElementById('age-form');
const dayInput = document.getElementById('day');
const monthInput = document.getElementById('month');
const yearInput = document.getElementById('year');
const yearsSpan = document.getElementById('years');
const monthsSpan = document.getElementById('months');
const daysSpan = document.getElementById('days');

// Helper: check if a date is valid (handles leap years, month days)
function isValidDate(day, month, year) {
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

// Helper: calculate age
function calculateAge(birthDate) {
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    // Get last day of previous month
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

// Clear all errors
function clearErrors() {
  document.querySelectorAll('.input-group').forEach(group => {
    group.classList.remove('error');
    group.querySelector('.error-message').textContent = '';
  });
}

// Show error on a specific field
function setFieldError(fieldId, message) {
  const group = document.getElementById(fieldId).closest('.input-group');
  group.classList.add('error');
  group.querySelector('.error-message').textContent = message;
}

// Validate form
function validate(day, month, year) {
  clearErrors();
  let isValid = true;

  // Empty fields
  if (!day) {
    setFieldError('day', 'This field is required');
    isValid = false;
  }
  if (!month) {
    setFieldError('month', 'This field is required');
    isValid = false;
  }
  if (!year) {
    setFieldError('year', 'This field is required');
    isValid = false;
  }

  if (!isValid) return false;

  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  // Day range
  if (dayNum < 1 || dayNum > 31) {
    setFieldError('day', 'Must be a valid day');
    isValid = false;
  }

  // Month range
  if (monthNum < 1 || monthNum > 12) {
    setFieldError('month', 'Must be a valid month');
    isValid = false;
  }

  // Year in the future
  const currentYear = new Date().getFullYear();
  if (yearNum > currentYear) {
    setFieldError('year', 'Must be in the past');
    isValid = false;
  }

  if (!isValid) return false;

  // Check if date is valid (e.g., 31/04/1991)
  if (!isValidDate(dayNum, monthNum, yearNum)) {
    // Show error on all fields as per design
    setFieldError('day', 'Must be a valid date');
    setFieldError('month', '');
    setFieldError('year', '');
    isValid = false;
  }

  // Check if date is in the future
  const inputDate = new Date(yearNum, monthNum - 1, dayNum);
  if (inputDate > new Date()) {
    setFieldError('year', 'Must be in the past');
    isValid = false;
  }

  return isValid;
}

// Animate number from start to end
function animateValue(element, start, end, duration = 800) {
  const range = end - start;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.floor(progress * range + start);
    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = end; // ensure final value
    }
  }

  requestAnimationFrame(update);
}

// Display result with animation
function displayResult(years, months, days) {
  animateValue(yearsSpan, 0, years);
  animateValue(monthsSpan, 0, months);
  animateValue(daysSpan, 0, days);
}

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const day = dayInput.value.trim();
  const month = monthInput.value.trim();
  const year = yearInput.value.trim();

  if (!validate(day, month, year)) return;

  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  const birthDate = new Date(yearNum, monthNum - 1, dayNum);
  const age = calculateAge(birthDate);
  displayResult(age.years, age.months, age.days);
});

// Optional: reset result when inputs change
[dayInput, monthInput, yearInput].forEach(input => {
  input.addEventListener('input', () => {
    yearsSpan.textContent = '--';
    monthsSpan.textContent = '--';
    daysSpan.textContent = '--';
    clearErrors();
  });
});