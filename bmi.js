// Theme Management
class ThemeManager {
  constructor() {
      this.currentTheme = 'dark';
      this.toggleSwitch = document.getElementById('theme-switch');
      this.init();
  }

  init() {
      // Set initial theme
      document.documentElement.setAttribute('data-theme', this.currentTheme);
      this.toggleSwitch.checked = this.currentTheme === 'light';
      
      // Add event listener
      this.toggleSwitch.addEventListener('change', () => {
          this.toggleTheme();
      });
  }

  toggleTheme() {
      this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', this.currentTheme);
      
      // Animate theme transition
      document.body.style.transition = 'all 0.3s ease';
      setTimeout(() => {
          document.body.style.transition = '';
      }, 300);
  }
}

// BMI Calculator
class BMICalculator {
  constructor() {
      this.form = document.getElementById('bmi-form');
      this.weightInput = document.getElementById('weight');
      this.heightInput = document.getElementById('height');
      this.calculateBtn = document.getElementById('calculate-btn');
      this.btnText = this.calculateBtn.querySelector('.btn-text');
      this.btnLoader = this.calculateBtn.querySelector('.btn-loader');
      this.resultContainer = document.getElementById('result-container');
      this.bmiValueElement = document.getElementById('bmi-value');
      this.resultCategoryElement = document.getElementById('result-category');
      this.chartContainer = document.getElementById('chart-container');
      this.bmiChart = document.getElementById('bmi-chart');
      
      this.init();
  }

  init() {
      this.form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.calculateBMI();
      });

      // Add input animations
      [this.weightInput, this.heightInput].forEach(input => {
          input.addEventListener('focus', () => {
              input.parentElement.style.transform = 'scale(1.02)';
          });
          
          input.addEventListener('blur', () => {
              input.parentElement.style.transform = 'scale(1)';
          });

          // Real-time validation
          input.addEventListener('input', () => {
              this.validateInput(input);
          });
      });
  }

  validateInput(input) {
      const value = parseFloat(input.value);
      const isValid = !isNaN(value) && value > 0;
      
      if (input.value && !isValid) {
          input.style.borderColor = 'var(--color-error)';
          input.style.boxShadow = '0 0 10px rgba(231, 76, 60, 0.3)';
      } else {
          input.style.borderColor = 'var(--input-border)';
          input.style.boxShadow = 'none';
      }
      
      return isValid;
  }

  async calculateBMI() {
      const weight = parseFloat(this.weightInput.value);
      const height = parseFloat(this.heightInput.value);

      // Validate inputs
      if (!this.validateInput(this.weightInput) || !this.validateInput(this.heightInput)) {
          this.showError('Please enter valid weight and height values');
          return;
      }

      if (!weight || !height) {
          this.showError('Please fill in both weight and height fields');
          return;
      }

      // Show loading state
      this.showLoading(true);

      // Simulate calculation delay for smooth UX
      await this.delay(800);

      // Calculate BMI
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      const category = this.getBMICategory(bmi);

      // Hide loading and show results
      this.showLoading(false);
      this.displayResults(bmi, category);
      this.showChart(category);
  }

  getBMICategory(bmi) {
      if (bmi < 18.5) {
          return {
              name: 'Underweight',
              id: 'underweight',
              color: '#e74c3c'
          };
      } else if (bmi >= 18.5 && bmi <= 24.9) {
          return {
              name: 'Normal',
              id: 'normal',
              color: '#2ecc71'
          };
      } else if (bmi >= 25.0 && bmi <= 29.9) {
          return {
              name: 'Overweight',
              id: 'overweight',
              color: '#f39c12'
          };
      } else {
          return {
              name: 'Obese',
              id: 'obese',
              color: '#e67e22'
          };
      }
  }

  displayResults(bmi, category) {
      // Animate BMI value counting
      this.animateCounter(this.bmiValueElement, 0, bmi, 1000);

      // Set category styling
      const categoryText = this.resultCategoryElement.querySelector('.category-text');
      if (!categoryText) {
          this.resultCategoryElement.innerHTML = `<span class="category-text">${category.name}</span>`;
      } else {
          categoryText.textContent = category.name;
      }

      this.resultCategoryElement.style.backgroundColor = category.color;
      this.resultCategoryElement.style.color = 'white';

      // Show result container with animation
      this.resultContainer.classList.remove('hidden');
      setTimeout(() => {
          this.resultContainer.classList.add('show');
      }, 50);
  }

  showChart(category) {
      // Reset previous highlights
      const allRows = this.bmiChart.querySelectorAll('.chart-row');
      allRows.forEach(row => {
          row.classList.remove('highlight');
      });

      // Show chart container with animation
      this.chartContainer.classList.remove('hidden');
      setTimeout(() => {
          this.chartContainer.classList.add('show');
          
          // Highlight the relevant category row after chart appears
          setTimeout(() => {
              const targetRow = this.bmiChart.querySelector(`[data-category="${category.id}"]`);
              if (targetRow) {
                  targetRow.classList.add('highlight');
                  
                  // Smooth scroll to chart
                  this.chartContainer.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center'
                  });
              }
          }, 300);
      }, 100);
  }

  animateCounter(element, start, end, duration) {
      const startTime = performance.now();
      const range = end - start;

      const updateCounter = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function for smooth animation
          const easedProgress = this.easeOutCubic(progress);
          const currentValue = start + (range * easedProgress);
          
          element.textContent = currentValue.toFixed(1);

          if (progress < 1) {
              requestAnimationFrame(updateCounter);
          }
      };

      requestAnimationFrame(updateCounter);
  }

  easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
  }

  showLoading(show) {
      if (show) {
          this.btnText.style.opacity = '0';
          this.btnLoader.classList.remove('hidden');
          this.calculateBtn.disabled = true;
          this.calculateBtn.style.cursor = 'not-allowed';
      } else {
          this.btnText.style.opacity = '1';
          this.btnLoader.classList.add('hidden');
          this.calculateBtn.disabled = false;
          this.calculateBtn.style.cursor = 'pointer';
      }
  }

  showError(message) {
      // Create error element if it doesn't exist
      let errorElement = document.querySelector('.error-message');
      if (!errorElement) {
          errorElement = document.createElement('div');
          errorElement.className = 'error-message';
          errorElement.style.cssText = `
              color: var(--color-error);
              background-color: rgba(231, 76, 60, 0.1);
              border: 1px solid var(--color-error);
              padding: 10px 15px;
              border-radius: 8px;
              margin-top: 10px;
              font-size: var(--font-size-sm);
              text-align: center;
              animation: fadeInSlideUp 0.3s ease;
          `;
          this.form.appendChild(errorElement);
      }

      errorElement.textContent = message;
      errorElement.style.display = 'block';

      // Auto hide error after 3 seconds
      setTimeout(() => {
          if (errorElement) {
              errorElement.style.opacity = '0';
              setTimeout(() => {
                  if (errorElement.parentNode) {
                      errorElement.parentNode.removeChild(errorElement);
                  }
              }, 300);
          }
      }, 3000);
  }

  delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  reset() {
      // Reset form
      this.form.reset();
      
      // Hide results and chart
      this.resultContainer.classList.remove('show');
      this.chartContainer.classList.remove('show');
      
      setTimeout(() => {
          this.resultContainer.classList.add('hidden');
          this.chartContainer.classList.add('hidden');
      }, 300);

      // Clear highlights
      const allRows = this.bmiChart.querySelectorAll('.chart-row');
      allRows.forEach(row => {
          row.classList.remove('highlight');
      });
  }
}

// Animation Controller
class AnimationController {
  constructor() {
      this.init();
  }

  init() {
      // Add entrance animations to elements
      this.observeElements();
      
      // Add hover effects
      this.addHoverEffects();
  }

  observeElements() {
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  entry.target.style.animationPlayState = 'running';
              }
          });
      }, {
          threshold: 0.1
      });

      // Observe animated elements
      const animatedElements = document.querySelectorAll('.calculator-container, .chart-container');
      animatedElements.forEach(el => observer.observe(el));
  }

  addHoverEffects() {
      // Add subtle animations to interactive elements
      const interactiveElements = document.querySelectorAll('.input-field, .calculate-btn');
      
      interactiveElements.forEach(element => {
          element.addEventListener('mouseenter', () => {
              if (!element.disabled) {
                  element.style.transform = 'translateY(-2px)';
              }
          });

          element.addEventListener('mouseleave', () => {
              if (!element.disabled) {
                  element.style.transform = 'translateY(0)';
              }
          });
      });
  }
}

// Particle Background Effect (Optional)
class ParticleBackground {
  constructor() {
      this.particles = [];
      this.init();
  }

  init() {
      // Create subtle floating particles
      this.createParticles();
      this.animate();
  }

  createParticles() {
      for (let i = 0; i < 20; i++) {
          const particle = {
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              size: Math.random() * 3 + 1,
              speedX: (Math.random() - 0.5) * 0.5,
              speedY: (Math.random() - 0.5) * 0.5,
              opacity: Math.random() * 0.3 + 0.1
          };
          this.particles.push(particle);
      }
  }

  animate() {
      // This would typically use canvas, but for simplicity we'll create CSS elements
      this.particles.forEach((particle, index) => {
          let element = document.getElementById(`particle-${index}`);
          
          if (!element) {
              element = document.createElement('div');
              element.id = `particle-${index}`;
              element.style.cssText = `
                  position: fixed;
                  pointer-events: none;
                  border-radius: 50%;
                  background: rgba(255, 255, 255, ${particle.opacity});
                  z-index: -1;
                  transition: all 0.1s linear;
              `;
              document.body.appendChild(element);
          }

          // Update particle position
          particle.x += particle.speedX;
          particle.y += particle.speedY;

          // Wrap around screen edges
          if (particle.x < 0) particle.x = window.innerWidth;
          if (particle.x > window.innerWidth) particle.x = 0;
          if (particle.y < 0) particle.y = window.innerHeight;
          if (particle.y > window.innerHeight) particle.y = 0;

          // Update element position
          element.style.left = particle.x + 'px';
          element.style.top = particle.y + 'px';
          element.style.width = particle.size + 'px';
          element.style.height = particle.size + 'px';
      });

      requestAnimationFrame(() => this.animate());
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  const themeManager = new ThemeManager();
  const bmiCalculator = new BMICalculator();
  const animationController = new AnimationController();
  const particleBackground = new ParticleBackground();

  // Add keyboard shortcuts
  document.addEventListener('keydown', (e) => {
      // Toggle theme with Ctrl/Cmd + T
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
          e.preventDefault();
          themeManager.toggleTheme();
      }
      
      // Reset calculator with Escape
      if (e.key === 'Escape') {
          bmiCalculator.reset();
      }
  });

  // Add window resize handler
  window.addEventListener('resize', () => {
      // Update particle positions on resize
      particleBackground.particles.forEach(particle => {
          if (particle.x > window.innerWidth) particle.x = window.innerWidth;
          if (particle.y > window.innerHeight) particle.y = window.innerHeight;
      });
  });

  console.log('BMI Calculator initialized successfully! 🚀');
});
