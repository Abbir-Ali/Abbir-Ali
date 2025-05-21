// Before-After Image Slider
class BeforeAfterSlider {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    
    this.overlay = this.container.querySelector('.img-comp-overlay');
    if (!this.overlay) return;
    
    this.init();
  }
  
  init() {
    // Create slider handle
    this.slider = document.createElement('DIV');
    this.slider.setAttribute('class', 'img-comp-slider');
    this.overlay.parentElement.insertBefore(this.slider, this.overlay);
    
    // Position the slider in the middle
    const width = this.overlay.offsetWidth;
    this.slider.style.left = (width / 2) - (this.slider.offsetWidth / 2) + 'px';
    
    this.isDragging = false;
    
    // Add event listeners
    this.addEventListeners();
  }
  
  addEventListeners() {
    // Mouse events
    this.slider.addEventListener('mousedown', (e) =&gt; {
      e.preventDefault();
      this.isDragging = true;
    });
    
    // Touch events
    this.slider.addEventListener('touchstart', (e) =&gt; {
      e.preventDefault();
      this.isDragging = true;
    });
    
    // Mouse move
    window.addEventListener('mousemove', (e) =&gt; {
      if (!this.isDragging) return;
      this.moveSlider(e);
    });
    
    // Touch move
    window.addEventListener('touchmove', (e) =&gt; {
      if (!this.isDragging) return;
      this.moveSlider(e, true);
    });
    
    // Stop dragging
    window.addEventListener('mouseup', () =&gt; {
      this.isDragging = false;
    });
    
    window.addEventListener('touchend', () =&gt; {
      this.isDragging = false;
    });
  }
  
  moveSlider(e, isTouch = false) {
    // Get cursor position
    const containerRect = this.container.querySelector('.img-comp-container').getBoundingClientRect();
    let x;
    
    if (isTouch) {
      x = e.touches[0].clientX - containerRect.left;
    } else {
      x = e.clientX - containerRect.left;
    }
    
    // Constrain to container bounds
    if (x &lt; 0) x = 0;
    if (x &gt; containerRect.width) x = containerRect.width;
    
    // Set width of overlay and position of slider
    this.overlay.style.width = x + 'px';
    this.slider.style.left = x - (this.slider.offsetWidth / 2) + 'px';
  }
}

// Initialize all before-after sliders on the page
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit to ensure images are loaded
  setTimeout(function() {
    // Find all before-after containers
    const containers = document.querySelectorAll('[id^="before-after-container-"]');
    
    // Initialize each container
    containers.forEach(container =&gt; {
      new BeforeAfterSlider(container.id);
    });
  }, 500);
});
