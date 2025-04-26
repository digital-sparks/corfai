import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Centralized selectors for easy maintenance
const SELECTORS = {
  // Navigation and footer elements
  FOOTER_WRAP: '.footer_wrap',
  FOOTER: 'footer',
  FOOTER_ICON: '.footer_icon',
  FOOTER_LINKS: 'footer a',
  NAV_COMPONENT: '.nav_component > div',
  BUTTON: '.button',
  BUTTON_ICON: '.icon-1x1-medium',

  // CSS Custom Properties
  CSS_PROPS: {
    TEXT_PRIMARY: '--_semantics---text-color--text-primary',
    NAVY_300: '--_base--navy--navy-300',
  },
};

window.Webflow ||= [];
window.Webflow.push(() => {
  // Initialize smooth scrolling with Lenis
  initSmoothScrolling();

  // Process hyphenated words
  processHyphenatedWords();

  // Initialize animations
  initFooterAnimations();
  initNavAnimations();
  initButtonAnimations();
});

/**
 * Initialize Lenis smooth scrolling
 */
function initSmoothScrolling() {
  'use strict'; // fix lenis in safari
  let lenis;

  // Only initialize if not in the Webflow Editor
  if (Webflow.env('editor') === undefined) {
    lenis = new Lenis({ lerp: 0.15 });

    // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // Convert time from seconds to milliseconds
    });

    // Disable lag smoothing in GSAP to prevent any delay in scroll animations
    gsap.ticker.lagSmoothing(0);

    // Setup Lenis controls
    setupLenisControls(lenis);

    // Handle resize events
    setupLenisResize(lenis);
  }
}

/**
 * Set up Lenis start and stop controls
 * @param {Lenis} lenis - The Lenis instance
 */
function setupLenisControls(lenis) {
  document.querySelectorAll('[data-lenis-start]').forEach((element) => {
    element.addEventListener('click', () => {
      lenis.start();
    });
  });

  document.querySelectorAll('[data-lenis-stop]').forEach((element) => {
    element.addEventListener('click', () => {
      lenis.stop();
    });
  });
}

/**
 * Set up window resize handling for Lenis
 * @param {Lenis} lenis - The Lenis instance
 */
function setupLenisResize(lenis) {
  let resizeTimer;
  window.addEventListener('resize', () => {
    // Clear the previous timer
    clearTimeout(resizeTimer);
    // Set a new timer (debounce)
    resizeTimer = setTimeout(() => {
      lenis.start();
    }, 300);
  });
}

/**
 * Initialize footer animations
 */
function initFooterAnimations() {
  const footerIcons = document.querySelectorAll(SELECTORS.FOOTER_ICON);
  if (!footerIcons.length) return;

  // Set initial state
  gsap.set(footerIcons[1], { opacity: 0 });

  // Footer scroll animation
  gsap.from(SELECTORS.FOOTER_WRAP, {
    scrollTrigger: {
      trigger: SELECTORS.FOOTER,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: true,
    },
    y: '2rem',
    scale: 0.98,
    transformOrigin: 'center bottom',
    opacity: 0,
  });

  // Footer link hover effects
  document.querySelectorAll(SELECTORS.FOOTER_LINKS).forEach((link) => {
    link.addEventListener('mouseenter', () => {
      gsap.to(footerIcons, {
        x: '0.5rem',
        y: '-0.5rem',
        duration: 0.4,
        ease: 'power3.out',
        scale: 1,
        transformOrigin: 'bottom left',
        opacity: (i) => (i == 1 ? 0.1 : 1),
        overwrite: true,
      });
    });

    link.addEventListener('mouseleave', () => {
      gsap.to(footerIcons, {
        x: '0rem',
        y: '0rem',
        duration: 0.3,
        ease: 'power3.out',
        scale: 1,
        transformOrigin: 'bottom left',
        opacity: (i) => (i == 1 ? 0 : 1),
        delay: 0.2,
      });
    });
  });
}

/**
 * Initialize navigation animations
 */
function initNavAnimations() {
  gsap.from(SELECTORS.NAV_COMPONENT, {
    opacity: 0,
    duration: 1.2,
    delay: 0.4,
  });
}

/**
 * Initialize button animations
 */
function initButtonAnimations() {
  document.querySelectorAll(SELECTORS.BUTTON).forEach((button) => {
    setupButtonAnimation(button);
  });
}

/**
 * Set up animation for a single button
 * @param {HTMLElement} button - The button element to animate
 */
function setupButtonAnimation(button) {
  const icons = button.querySelectorAll(SELECTORS.BUTTON_ICON);
  if (icons.length < 2) return;

  let currentTimeline = null;
  let buttonState = 'idle'; // 'idle', 'entering', 'entered', 'leaving'

  button.addEventListener('mouseenter', () => {
    // Clear any existing animations
    if (currentTimeline) {
      currentTimeline.kill();
    }

    // Determine starting positions based on current state
    let startPos0, startPos1;
    if (buttonState === 'leaving') {
      // Get current position values for smooth transition
      startPos0 = {
        yPercent: gsap.getProperty(icons[0], 'yPercent'),
        xPercent: gsap.getProperty(icons[0], 'xPercent'),
      };
      startPos1 = {
        yPercent: gsap.getProperty(icons[1], 'yPercent'),
        xPercent: gsap.getProperty(icons[1], 'xPercent'),
      };
    } else {
      // Default starting positions
      startPos0 = { yPercent: 0, xPercent: 0 };
      startPos1 = { yPercent: 100, xPercent: -100 };
    }

    buttonState = 'entering';

    currentTimeline = gsap.timeline({
      onComplete: () => {
        buttonState = 'entered';
      },
    });

    currentTimeline
      .fromTo(icons[0], startPos0, {
        yPercent: -100,
        xPercent: 100,
        duration: 0.2,
        ease: 'power3.in',
      })
      .fromTo(
        icons[1],
        startPos1,
        {
          yPercent: -100,
          xPercent: 0,
          duration: 0.3,
          ease: 'power3.out',
        },
        '<+0.2'
      );
  });

  button.addEventListener('mouseleave', () => {
    // Handle different button states
    if (buttonState === 'entering') {
      // Add a callback to run leave animation after enter completes
      currentTimeline.eventCallback('onComplete', () => {
        runLeaveAnimation();
        // Clear the callback to prevent multiple calls
        currentTimeline.eventCallback('onComplete', null);
      });
    } else if (buttonState === 'entered') {
      // If already entered, run leave animation immediately
      runLeaveAnimation();
    }
  });

  function runLeaveAnimation() {
    if (currentTimeline) {
      currentTimeline.kill();
    }

    buttonState = 'leaving';

    currentTimeline = gsap.timeline({
      onComplete: () => {
        buttonState = 'idle';
      },
    });

    currentTimeline
      .to(icons[1], {
        yPercent: 100,
        xPercent: -100,
        duration: 0.2,
        ease: 'power3.in',
      })
      .to(
        icons[0],
        {
          yPercent: 0,
          xPercent: 0,
          duration: 0.3,
          ease: 'power3.out',
        },
        '<+0.2'
      );
  }
}

/**
 * Processes text elements on the page to wrap hyphenated words in spans
 * @param {string} selector - CSS selector for targeting specific elements
 * @returns {number} The number of elements processed
 */
function processHyphenatedWords(selector = 'p, h1, h2, h3, h4, h5, h6, div, span, li, a') {
  const elements = document.querySelectorAll(selector);
  let processedCount = 0;

  elements.forEach((element) => {
    // Skip elements that shouldn't be processed
    if (['SCRIPT', 'STYLE', 'CODE', 'PRE', 'IFRAME'].includes(element.tagName)) {
      return;
    }

    processElementContent(element);
    processedCount++;
  });

  return processedCount;

  /**
   * Process the content of an element, wrapping hyphenated words in spans
   * @param {HTMLElement} element - The element to process
   */
  function processElementContent(element) {
    // Get all text nodes that are direct children of this element
    const childNodes = Array.from(element.childNodes);

    // Process each child node
    childNodes.forEach((node) => {
      // If it's a text node with content
      if (node.nodeType === 3 && node.textContent.trim() !== '') {
        // Check if it contains hyphenated words
        if (node.textContent.match(/\w+-\w+/)) {
          // Create a temporary element to hold the HTML
          const tempDiv = document.createElement('div');

          // Replace hyphenated words with spans
          tempDiv.innerHTML = node.textContent.replace(
            /(\w+)-(\w+)/g,
            '$1<span class="hyphen">-</span>$2'
          );

          // Replace the text node with our new span elements
          const fragment = document.createDocumentFragment();
          while (tempDiv.firstChild) {
            fragment.appendChild(tempDiv.firstChild);
          }
          node.parentNode.replaceChild(fragment, node);
        }
      }
      // If it's an element node, process its children recursively
      // Skip processing elements that might cause problems
      else if (
        node.nodeType === 1 &&
        !['SCRIPT', 'STYLE', 'CODE', 'PRE', 'IFRAME'].includes(node.tagName)
      ) {
        processElementContent(node);
      }
    });
  }
}
