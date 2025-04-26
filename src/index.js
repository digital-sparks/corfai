import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
/* The following plugin is a Club GSAP perk */
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Centralized selectors for easy maintenance
const SELECTORS = {
  // Hero section
  HERO_SECTION: '.section_hero-full-screen',
  HERO_HEADING: '.section_hero-full-screen .heading-style-h0',
  HERO_SUBTITLE: '.section_hero-full-screen .heading-style-h5',
  HERO_LOTTIE: '.section_hero-full-screen .hero-lottie',
  HERO_REVEAL: '.section_hero-full-screen .reveal-element',

  // We Help section
  WE_HELP_SECTION: '.section_we-help',
  WE_HELP_HEADING: '.section_we-help .heading-style-h4',

  // Testimonials section
  TESTIMONIALS_SECTION: '.section_testimonials',
  TESTIMONIALS_HEADING: '.section_testimonials .heading-style-h1',
  TESTIMONIAL_CARD: '.testimonial_component',
  TESTIMONIAL_TITLE: '.heading-style-h6',
  TESTIMONIAL_DESCRIPTION: 'p',
};

// Store all SplitText instances for reverting on resize
let splitInstances = [];
let currentWidth = window.innerWidth;
let resizeTimeout;

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

// Initialize hero section animations
function initHeroAnimations() {
  const h1Heading = document.querySelector(SELECTORS.HERO_HEADING);
  const subTitle = document.querySelector(SELECTORS.HERO_SUBTITLE);

  if (!h1Heading || !subTitle) return;

  // Create and store SplitText instances
  let splitH1Heading = new SplitText(h1Heading, {
    type: 'words, lines',
    linesClass: 'split-text_lines',
  });
  splitInstances.push(splitH1Heading);

  let splitSubTitle = new SplitText(subTitle, {
    type: 'words, chars',
    linesClass: 'split-text_lines',
  });
  splitInstances.push(splitSubTitle);

  gsap.set(subTitle, { opacity: 0 });

  // Hero animation timeline
  gsap
    .timeline()
    .from(SELECTORS.HERO_LOTTIE, {
      duration: 6,
      opacity: 0,
      delay: 0.5,
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
          return index * 0.165 + (index >= 2 ? 0.85 : 0);
        },
      },
      '<'
    )
    .fromTo(
      SELECTORS.HERO_REVEAL,
      {
        width: '100%',
        scaleX: 0,
      },
      {
        transformOrigin: 'center left',
        ease: 'power2.inOut',
        duration: 0.5,
        scaleX: 1,
      },
      '>-0.25'
    )
    .to(
      SELECTORS.HERO_REVEAL,
      {
        onStart: () => {
          gsap.set(SELECTORS.HERO_SUBTITLE, { opacity: 1 });
        },
        transformOrigin: 'center right',
        ease: 'power2.out',
        scaleX: 0,
        duration: 0.5,
        delay: 0.05,
      },
      '>'
    );

  // Scroll-driven animation for hero section
  gsap
    .timeline({
      scrollTrigger: {
        trigger: SELECTORS.WE_HELP_SECTION,
        start: 'top bottom',
        scrub: true,
      },
    })
    .to(SELECTORS.HERO_LOTTIE, {
      yPercent: 25,
      scale: 1.05,
      ease: 'none',
    });
}

// Initialize We Help section animations
function initWeHelpAnimations() {
  const description2 = document.querySelectorAll(SELECTORS.WE_HELP_HEADING);
  if (!description2.length) return;

  let splitDescription2 = new SplitText(description2, {
    type: 'words, lines',
    linesClass: 'split-text_lines',
  });
  splitInstances.push(splitDescription2);

  gsap
    .timeline({
      scrollTrigger: {
        trigger: SELECTORS.WE_HELP_SECTION,
        start: 'center bottom',
        end: 'bottom top',
      },
    })
    .from(splitDescription2.lines, {
      opacity: 0,
      yPercent: 40,
      duration: 1,
      transformOrigin: 'left bottom',
      ease: 'power3.out',
      stagger: {
        each: 0.02,
      },
    });
}

// Initialize Testimonials section animations
function initTestimonialsAnimations() {
  const title3 = document.querySelectorAll(SELECTORS.TESTIMONIALS_HEADING);
  if (!title3.length) return;

  let splitTitle3 = new SplitText(title3, {
    type: 'words, lines',
    linesClass: 'split-text_lines',
    lineThreshold: 0.4,
  });
  splitInstances.push(splitTitle3);

  gsap
    .timeline({
      scrollTrigger: {
        trigger: title3,
        start: 'center bottom',
        end: 'bottom top',
      },
    })
    .from(splitTitle3.words, {
      yPercent: 100,
      opacity: 0.3,
      duration: 1,
      rotateZ: 6,
      transformOrigin: 'left bottom',
      ease: 'power3.out',
      stagger: function (index) {
        return index * 0.165;
      },
    });

  // Testimonial cards animations
  document.querySelectorAll(SELECTORS.TESTIMONIAL_CARD).forEach((card) => {
    const title = card.querySelectorAll(SELECTORS.TESTIMONIAL_TITLE);
    const description = card.querySelector(SELECTORS.TESTIMONIAL_DESCRIPTION);

    if (!title.length || !description) return;

    let hasAnimated = false;

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
        opacity: 0,
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
      );
  });
}

// Initialize on Webflow page load
window.Webflow ||= [];
window.Webflow.push(() => {
  document.fonts.ready.then(() => {
    initHeroAnimations();
    initWeHelpAnimations();
    initTestimonialsAnimations();
  });

  // Add resize listener
  window.addEventListener('resize', handleResize);
});
