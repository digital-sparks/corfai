import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Centralized selectors for easy maintenance
const SELECTORS = {
  // Hero section
  HERO_HEADING: '.heading-style-h6',
  DIVIDER: '.divider_component',

  // Divider classes
  DIVIDER_HORIZONTAL: 'is-horizontal',
  DIVIDER_HORIZONTAL_RIGHT: 'is-horizontal-right',
  DIVIDER_VERTICAL_BOTTOM: 'is-vertical-bottom',
};

// Store all SplitText instances for reverting on resize
let splitInstances = [];
let currentWidth = window.innerWidth;
let resizeTimeout;

// Helper function to get CSS custom properties
const getProp = (value) => getComputedStyle(document.documentElement).getPropertyValue(value);

// Initialize hero section animations
function initHeroAnimations() {
  const heading = document.querySelector(SELECTORS.HERO_HEADING);

  if (!heading) return;

  // Create and store SplitText instances
  let splitHeading = new SplitText(heading, {
    type: 'words, lines',
    linesClass: 'split-text_lines',
  });
  splitInstances.push(splitHeading);

  gsap
    .timeline({
      scrollTrigger: {
        trigger: heading,
        start: 'center bottom',
      },
    })
    .from(
      splitHeading.words,
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
      SELECTORS.DIVIDER,
      {
        scaleX: (i, target) =>
          target.classList.contains(SELECTORS.DIVIDER_HORIZONTAL) ||
          target.classList.contains(SELECTORS.DIVIDER_HORIZONTAL_RIGHT)
            ? 0
            : 1,
        scaleY: (i, target) =>
          target.classList.contains(SELECTORS.DIVIDER_HORIZONTAL) ||
          target.classList.contains(SELECTORS.DIVIDER_HORIZONTAL_RIGHT)
            ? 1
            : 0,
        transformOrigin: (i, target) => {
          const isHorizontal = target.classList.contains(SELECTORS.DIVIDER_HORIZONTAL);
          const isHorizontalRight = target.classList.contains(SELECTORS.DIVIDER_HORIZONTAL_RIGHT);
          const isVerticalBottom = target.classList.contains(SELECTORS.DIVIDER_VERTICAL_BOTTOM);

          return isHorizontal
            ? 'left center'
            : isHorizontalRight
              ? 'right center'
              : isVerticalBottom
                ? 'center bottom'
                : 'center top';
        },
        ease: 'power2.inOut',
        duration: 1,
      },
      '<'
    );
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
    }
  }, 100);
}

// Initialize on Webflow page load
window.Webflow ||= [];
window.Webflow.push(() => {
  document.fonts.ready.then(() => {
    initHeroAnimations();
  });

  // Add resize listener
  window.addEventListener('resize', handleResize);
});
