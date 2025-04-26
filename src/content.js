import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
/* The following plugin is a Club GSAP perk */
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Centralized selectors for easy maintenance
const SELECTORS = {
  // Hero section
  HERO_HEADING: '.heading-style-h1',
  HERO_DESCRIPTION: 'p.rich-text-xlarge',
  HERO_IMAGE: '.thumbnail_wrapper img',
  DIVIDER: '.divider_component',

  // Divider classes
  DIVIDER_HORIZONTAL: 'is-horizontal',
  DIVIDER_HORIZONTAL_RIGHT: 'is-horizontal-right',
  DIVIDER_VERTICAL_BOTTOM: 'is-vertical-bottom',

  // Article cards
  ARTICLE: '.insights_article',
  ARTICLE_TITLE: '.heading-style-h4',
  ARTICLE_IMAGE: 'img',
  ARTICLE_ICON: '.icon-1x1-large',
  ARTICLE_LINKS: 'a:not(.button)',

  // CSS properties
  CSS_PROPS: {
    TEXT_PRIMARY: '--_semantics---text-color--text-primary',
    NAVY_300: '--_base--navy--navy-300',
  },
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
  const description = document.querySelector(SELECTORS.HERO_DESCRIPTION);
  const image = document.querySelector(SELECTORS.HERO_IMAGE);

  if (!heading || !description) return;

  // Create and store SplitText instances
  let splitHeading = new SplitText(heading, {
    type: 'words, lines',
    linesClass: 'split-text_lines',
  });
  splitInstances.push(splitHeading);

  let splitDescription = new SplitText(description, {
    type: 'words, lines',
    linesClass: 'split-text_lines',
  });
  splitInstances.push(splitDescription);

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
    )
    .from(
      image,
      {
        ease: 'power.out',
        scale: 1.05,
        opacity: 0,
        duration: 1,
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
    );
}

// Initialize article card animations
function initArticleAnimations() {
  document.querySelectorAll(SELECTORS.ARTICLE).forEach((card) => {
    const title = card.querySelectorAll(SELECTORS.ARTICLE_TITLE);
    const image = card.querySelector(SELECTORS.ARTICLE_IMAGE);
    const icon = card.querySelector(SELECTORS.ARTICLE_ICON);

    if (!title.length || !icon) return;

    let hasAnimated = false;

    // Create and store SplitText instances
    let splitTitle = new SplitText(title, {
      type: 'lines, words',
      linesClass: 'split-text_lines',
    });
    splitInstances.push(splitTitle);

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
    setupArticleHoverEffects(card, title, icon, image, hasAnimated);
  });
}

// Setup hover effects for article links
function setupArticleHoverEffects(card, title, icon, image, hasAnimated) {
  card.querySelectorAll(SELECTORS.ARTICLE_LINKS).forEach((link) => {
    link.addEventListener('mouseenter', () => {
      gsap
        .timeline()
        .to(icon, {
          x: '0.5rem',
          y: '-0.5rem',
          duration: 0.5,
          ease: 'power3.out',
          transformOrigin: 'bottom left',
          ...(hasAnimated ? { opacity: 0.8 } : {}),
        })
        .to(
          title,
          {
            color: getProp(SELECTORS.CSS_PROPS.NAVY_300),
            duration: 0.3,
            ease: 'power1.out',
          },
          '<'
        )
        .to(
          image,
          {
            scale: 1.05,
            duration: 0.5,
            ease: 'power3.out',
          },
          '<'
        );
    });

    link.addEventListener('mouseleave', () => {
      gsap
        .timeline()
        .to(icon, {
          x: '0rem',
          y: '0rem',
          duration: 0.5,
          ease: 'power3.out',
          opacity: 1,
        })
        .to(
          title,
          {
            color: getProp(SELECTORS.CSS_PROPS.TEXT_PRIMARY),
            duration: 0.3,
            ease: 'power1.out',
          },
          '<'
        )
        .to(
          image,
          {
            scale: 1,
            duration: 0.5,
            ease: 'power3.out',
          },
          '<'
        );
    });
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
      initAllAnimations();
    }
  }, 100);
}

// Main function to initialize all animations
function initAllAnimations() {
  document.fonts.ready.then(() => {
    initHeroAnimations();
    initArticleAnimations();
  });
}

// Initialize on Webflow page load
window.Webflow ||= [];
window.Webflow.push(() => {
  initAllAnimations();

  // Add resize listener
  window.addEventListener('resize', handleResize);
});
