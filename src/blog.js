import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText'; // Club GSAP perk

gsap.registerPlugin(ScrollTrigger, SplitText);

// Configurable selectors for easy updates
const SELECTORS = {
  // Article and card selectors
  ARTICLE: '.insights_article',
  CARD: '.insights_col-wrap',
  THUMBNAIL: '.horizontal-image-wrap img',
  TITLE: '.heading-style-h3',
  DESCRIPTION: 'p',
  ICON_LARGE: '.icon-1x1-large',
  ICON_MEDIUM: '.icon-1x1-medium',
  BUTTON: '.button',
  LINKS: 'a:not(.button)',

  // CSS Custom Properties
  CSS_PROPS: {
    TEXT_PRIMARY: '--_semantics---text-color--text-primary',
    NAVY_300: '--_base--navy--navy-300',
  },
};

// Store all SplitText instances for reverting on resize
let splitInstances = [];
let currentWidth = window.innerWidth;
let resizeTimeout;

const getProp = (value) => getComputedStyle(document.documentElement).getPropertyValue(value);

// Handle button animations
function setupButtonAnimation(button) {
  const icons = button.querySelectorAll(SELECTORS.ICON_MEDIUM);
  if (icons.length < 2) return;

  let currentTimeline = null;
  let buttonState = 'idle'; // 'idle', 'entering', 'entered', 'leaving'

  button.addEventListener('mouseenter', () => {
    if (currentTimeline) currentTimeline.kill();

    // Determine starting positions based on current state
    const startPos0 =
      buttonState === 'leaving'
        ? {
            yPercent: gsap.getProperty(icons[0], 'yPercent'),
            xPercent: gsap.getProperty(icons[0], 'xPercent'),
          }
        : { yPercent: 0, xPercent: 0 };

    const startPos1 =
      buttonState === 'leaving'
        ? {
            yPercent: gsap.getProperty(icons[1], 'yPercent'),
            xPercent: gsap.getProperty(icons[1], 'xPercent'),
          }
        : { yPercent: 100, xPercent: -100 };

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
      currentTimeline.eventCallback('onComplete', () => {
        runLeaveAnimation();
        currentTimeline.eventCallback('onComplete', null);
      });
    } else if (buttonState === 'entered') {
      runLeaveAnimation();
    }
  });

  function runLeaveAnimation() {
    if (currentTimeline) currentTimeline.kill();

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

// Handle article animations
function setupArticleAnimation(article) {
  const thumbnail = article.querySelector(SELECTORS.THUMBNAIL);
  if (thumbnail) {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: thumbnail,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onEnter: () => {
            gsap.fromTo(
              thumbnail,
              { scale: 1.15, opacity: 0 },
              {
                ease: 'power.out',
                scale: 1.1,
                opacity: 1,
                duration: 1,
              }
            );
          },
        },
      })
      .fromTo(thumbnail, { yPercent: -5 }, { yPercent: 5 });
  }

  // Insights column animations
  const card = article.querySelector(SELECTORS.CARD);
  if (!card) return;

  const title = card.querySelector(SELECTORS.TITLE);
  const description = card.querySelector(SELECTORS.DESCRIPTION);
  const icon = card.querySelector(SELECTORS.ICON_LARGE);

  if (!title || !description || !icon) return;

  let hasAnimated = false;

  // Create SplitText instances and store them
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
        stagger: { each: 0.01 },
      },
      '<+0.3'
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

  // Set up hover animations for links
  article.querySelectorAll(SELECTORS.LINKS).forEach((link) => {
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
          thumbnail,
          {
            scale: 1.15,
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
          thumbnail,
          {
            scale: 1.1,
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
      initializeResourceAnimations();
    }
  }, 100);
}

// Main initialization function
function initializeResourceAnimations(container = document) {
  // Skip if container is not visible
  if (container !== document) {
    const opacity = window.getComputedStyle(container).opacity;
    if (!opacity || opacity === '1') return;
  }

  // Set up button animations
  container.querySelectorAll(SELECTORS.BUTTON).forEach(setupButtonAnimation);

  // Set up article animations
  container.querySelectorAll(SELECTORS.ARTICLE).forEach(setupArticleAnimation);
}

// Initialize on page load
window.Webflow ||= [];
window.Webflow.push(() => {
  document.fonts.ready.then(() => {
    initializeResourceAnimations();

    // Add resize listener
    window.addEventListener('resize', handleResize);
  });
});

// For the FSAttributes integration
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsload',
  (listInstances) => {
    const [listInstance] = listInstances;
    if (listInstance) {
      listInstance.on('renderitems', (renderedItems) => {
        renderedItems.forEach((renderedItem) => {
          initializeResourceAnimations(renderedItem.element);
        });
      });
    }
  },
]);
