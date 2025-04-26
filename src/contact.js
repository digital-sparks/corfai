import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Centralized selectors for easy maintenance
const SELECTORS = {
  CONTAINER: '.contact_component',
  HEADING: '.contact_component .heading-style-h2',
  DESCRIPTION: '.contact_component p',
  DIVIDER: '.contact_component .divider_component',
  COLUMN_2: '.contact_component .contact_col-2',
  ICON_WRAP: '.contact_icon-wrap',
  DIVIDER_HORIZONTAL: 'is-horizontal',
};

// Store split text instances for resize handling
let splitInstances = [];
let currentWidth = window.innerWidth;
let resizeTimeout;

// Initialize animations for contact section
function initContactAnimations() {
  document.fonts.ready.then(() => {
    const h1Heading = document.querySelector(SELECTORS.HEADING);
    const description = document.querySelector(SELECTORS.DESCRIPTION);

    if (!h1Heading || !description) return;

    // Create and store split text instances
    let splitH1Heading = new SplitText(h1Heading, {
      type: 'words, lines',
      linesClass: 'split-text_lines',
    });
    splitInstances.push(splitH1Heading);

    let splitDescription = new SplitText(description, {
      type: 'words, lines',
      linesClass: 'split-text_lines',
    });
    splitInstances.push(splitDescription);

    // Create timeline animation
    gsap
      .timeline({
        scrollTrigger: {
          trigger: SELECTORS.CONTAINER,
          start: 'center bottom',
        },
      })
      .from(
        splitH1Heading.words,
        {
          yPercent: 100,
          opacity: 0.3,
          duration: 1,
          rotateZ: 6,
          transformOrigin: 'left bottom',
          ease: 'power3.out',
          stagger: function (index) {
            return index * 0.165;
          },
        },
        '<'
      )
      .from(
        splitDescription.lines,
        {
          opacity: 0,
          yPercent: 40,
          duration: 1,
          ease: 'power3.out',
          stagger: {
            each: 0.01,
          },
        },
        '<+0.3'
      )
      .from(
        SELECTORS.DIVIDER,
        {
          scaleX: (i, target) => (target.classList.contains(SELECTORS.DIVIDER_HORIZONTAL) ? 0 : 1),
          scaleY: (i, target) => (target.classList.contains(SELECTORS.DIVIDER_HORIZONTAL) ? 1 : 0),
          transformOrigin: (i, target) => {
            return target.classList.contains(SELECTORS.DIVIDER_HORIZONTAL)
              ? 'left center'
              : 'center top';
          },
          ease: 'power2.inOut',
          duration: 1,
        },
        '<'
      )
      .from(
        SELECTORS.COLUMN_2,
        {
          opacity: 0,
          y: '1rem',
          duration: 2,
          ease: 'power3.out',
        },
        '<+0.35'
      )
      .from(
        SELECTORS.ICON_WRAP,
        {
          opacity: 0,
          duration: 2,
          ease: 'power3.out',
        },
        '<'
      );
  });
}

// Handle resize and revert SplitText
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (window.innerWidth !== currentWidth) {
      currentWidth = window.innerWidth;

      // Revert all split text instances
      splitInstances.forEach((instance) => {
        if (instance && typeof instance.revert === 'function') {
          instance.revert();
        }
      });

      // Clear the instances array
      splitInstances = [];

      // Reinitialize animations
      initContactAnimations();
    }
  }, 100);
}

// Initialize on Webflow page load
window.Webflow ||= [];
window.Webflow.push(() => {
  initContactAnimations();

  // Add resize listener
  window.addEventListener('resize', handleResize);
});
