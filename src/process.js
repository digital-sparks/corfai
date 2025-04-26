import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
/* The following plugin is a Club GSAP perk */
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Centralized selectors for easy maintenance
const SELECTORS = {
  PROCESS_CARD: '.process_card',
  PROCESS_CARD_BOTTOM: '.process_card-bottom',
  REVEAL_ELEMENT: '.reveal-element',
  NUMBER: '.heading-style-h3',
  TITLE: '.heading-style-h3', // Second h3 element is used as title
  DESCRIPTION: 'p',
  ICON: '.icon-1x1-large',

  // CSS Custom Properties
  CSS_PROPS: {
    BG_ALTERNATE: '--_semantics---background-color--bg-alternate',
    NAVY_300: '--_base--navy--navy-300',
  },
};

// Store all SplitText instances for reverting on resize
let splitInstances = [];
let currentWidth = window.innerWidth;
let resizeTimeout;

// Helper function to get CSS custom properties
const getProp = (value) => getComputedStyle(document.documentElement).getPropertyValue(value);

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

// Initialize process card animations
function initProcessCardAnimations() {
  document.querySelectorAll(SELECTORS.PROCESS_CARD).forEach((card) => {
    const revealElement = card.querySelector(SELECTORS.REVEAL_ELEMENT);
    const number = card.querySelector(SELECTORS.NUMBER);
    const title = card.querySelectorAll(SELECTORS.TITLE)[1]; // Get the second h3 as title
    const description = card.querySelector(SELECTORS.DESCRIPTION);
    const icon = card.querySelector(SELECTORS.ICON);
    const cardBottom = card.querySelector(SELECTORS.PROCESS_CARD_BOTTOM);

    if (!revealElement || !number || !title || !description || !icon || !cardBottom) return;

    let hasAnimated = false;

    // Create and store SplitText instances
    let splitTitle = new SplitText(title, {
      type: 'lines, words',
      linesClass: 'split-text_lines',
    });
    splitInstances.push(splitTitle);

    let splitDescription = new SplitText(description, {
      type: 'lines, words',
      linesClass: 'split-text_lines',
    });
    splitInstances.push(splitDescription);

    gsap.set(number, { opacity: 0 });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: card,
          start: '25% bottom',
          end: 'bottom center',
        },
        paused: true,
        onComplete: () => {
          hasAnimated = true;
        },
      })
      .from(card, {
        y: '2rem',
        duration: 1,
        rotateZ: 1,
        opacity: 0.4,
        transformOrigin: 'left bottom',
        ease: 'power3.out',
      })
      .from(
        splitTitle.words,
        {
          yPercent: 100,
          opacity: 0.3,
          duration: 1,
          rotateZ: 6,
          transformOrigin: 'left bottom',
          ease: 'power3.out',
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
      .fromTo(
        revealElement,
        {
          width: '100%',
          scaleX: 0,
        },
        {
          transformOrigin: 'center left',
          ease: 'power2.in',
          duration: 0.5,
          scaleX: 1,
          onComplete: () => {
            gsap.set(number, { opacity: 1 });
          },
        },
        '<'
      )
      .to(
        revealElement,
        {
          transformOrigin: 'center right',
          ease: 'power2.out',
          scaleX: 0,
          duration: 0.5,
          delay: 0.05,
        },
        '>'
      )
      .from(
        icon,
        {
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        },
        '<-0.2'
      );

    // Setup hover animations
    setupCardHoverEffects(card, icon, cardBottom, hasAnimated);
  });
}

// Setup hover effects for cards
function setupCardHoverEffects(card, icon, cardBottom, hasAnimated) {
  card.addEventListener('mouseenter', () => {
    gsap
      .timeline()
      .to(icon, {
        x: '0.5rem',
        y: '-0.5rem',
        duration: 0.5,
        ease: 'power3.out',
        scale: 1.1,
        transformOrigin: 'bottom left',
        ...(hasAnimated ? { opacity: 0.8 } : {}),
      })
      .to(
        cardBottom,
        {
          backgroundColor: getProp(SELECTORS.CSS_PROPS.NAVY_300),
          duration: 0.3,
          ease: 'power1.out',
        },
        '<'
      );
  });

  card.addEventListener('mouseleave', () => {
    gsap
      .timeline()
      .to(icon, {
        x: '0rem',
        y: '0rem',
        duration: 0.5,
        ease: 'power3.out',
        scale: 1,
        opacity: 1,
      })
      .to(
        cardBottom,
        {
          backgroundColor: getProp(SELECTORS.CSS_PROPS.BG_ALTERNATE),
          duration: 0.3,
          ease: 'power1.out',
        },
        '<'
      );
  });
}

// Initialize on Webflow page load
window.Webflow ||= [];
window.Webflow.push(() => {
  document.fonts.ready.then(() => {
    initProcessCardAnimations();
  });

  // Add resize listener
  window.addEventListener('resize', handleResize);
});
