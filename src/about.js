import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import { SplitText } from 'gsap/SplitText';

// Register all plugins once
gsap.registerPlugin(ScrollTrigger, SplitText, Observer);

// Store split text instances
let splitInstances = [];
let currentWidth = window.innerWidth;
let resizeTimeout;

window.Webflow ||= [];
window.Webflow.push(() => {
  // Wait for fonts to load before initializing animations
  document.fonts.ready.then(() => {
    // Initialize hero section animations
    initHeroSection();

    // Initialize 2-column section animations
    init2ColSections();

    // Initialize logo slider
    initLogoSlider();

    // Handle window resize for text splits
    window.addEventListener('resize', handleResize);
  });
});

function handleResize() {
  // Clear any existing timeout to prevent rapid execution
  clearTimeout(resizeTimeout);

  // Set a timeout to avoid excessive re-renders during resize
  resizeTimeout = setTimeout(() => {
    // Only revert splits if width changes (horizontal resize)
    if (window.innerWidth !== currentWidth) {
      currentWidth = window.innerWidth;

      // Simply revert all split text instances
      splitInstances.forEach((instance) => {
        if (instance && typeof instance.revert === 'function') {
          instance.revert();
        }
      });

      // Clear the instances array
      splitInstances = [];
    }
  }, 100); // Wait 100ms after resize ends
}

function initHeroSection() {
  const section = document.querySelector('.section_hero-full-screen');
  if (!section) return;

  const h1Heading = section.querySelector('.heading-style-h0');
  const subTitle = section.querySelector('.heading-style-h5');
  const image = section.querySelector('img:not(.logos_image)');
  const revealElement = section.querySelector('.reveal-element');

  if (!h1Heading || !subTitle) return;

  // Split text once for better performance
  const splitH1Heading = new SplitText(h1Heading, {
    type: 'words, lines',
    linesClass: 'split-text_lines',
  });

  const splitSubTitle = new SplitText(subTitle, {
    type: 'words, chars',
    linesClass: 'split-text_lines',
  });

  // Store split instances for cleanup
  splitInstances.push(splitH1Heading, splitSubTitle);

  // Set initial state
  gsap.set(subTitle, { opacity: 0 });

  // Create hero timeline
  const heroTl = gsap.timeline();

  // Add animations to timeline
  heroTl
    .from(image, {
      duration: 2,
      scale: 1.1,
      ease: 'power1.out',
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
        stagger: (index) => index * 0.165,
      },
      '<'
    )
    .fromTo(
      revealElement,
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
      revealElement,
      {
        onStart: () => gsap.set(subTitle, { opacity: 1 }),
        transformOrigin: 'center right',
        ease: 'power2.out',
        scaleX: 0,
        duration: 0.5,
        delay: 0.05,
      },
      '>'
    );
}

function init2ColSections() {
  document.querySelectorAll('.section_2col').forEach((section) => {
    const heading = section.querySelector('.heading-style-h3');
    const description = section.querySelectorAll('.w-richtext p');
    const image = section.querySelector('.horizontal-image-wrap img');

    if (!heading || !description.length || !image) return;

    // Split text elements
    const splitHeading = new SplitText(heading, {
      type: 'words, lines',
      linesClass: 'split-text_lines',
    });

    const splitDescription = new SplitText(description, {
      type: 'words, lines',
      linesClass: 'split-text_lines',
    });

    // Store split instances for cleanup
    splitInstances.push(splitHeading, splitDescription);

    // Create scroll-triggered animation
    gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: 'center bottom',
          end: 'bottom top',
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
          stagger: (index) => index * 0.165,
        },
        '<'
      )
      .from(
        image,
        {
          ease: 'power1.out',
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
          stagger: 0.01,
        },
        '<+0.3'
      );
  });
}

function initLogoSlider() {
  // Constants for logo slider
  const ANIMATION_DURATION = 70;
  const VELOCITY_MULTIPLIER = -0.015;
  const MAX_VELOCITY = 5;

  document.querySelectorAll('.logos_wrapper').forEach((wrapper, index) => {
    const isEven = index % 2 === 0;
    const logos = wrapper.querySelectorAll('.logos_component');

    if (!logos.length) return;

    // Create infinite timeline
    const logoTl = gsap.timeline({ repeat: -1 });

    // Animate logos
    logoTl.to(logos, {
      xPercent: isEven ? -100 : 100,
      duration: ANIMATION_DURATION,
      ease: 'none',
    });

    // Handle scroll interaction
    const scrollState = { value: 1 };

    Observer.create({
      target: window,
      type: 'wheel,touch',
      wheelSpeed: -1,
      onChangeY: (self) => {
        // Calculate velocity and clamp it
        let velocity = self.velocityY * VELOCITY_MULTIPLIER;
        velocity = gsap.utils.clamp(-MAX_VELOCITY, MAX_VELOCITY, velocity);

        // Set timeline speed based on scroll velocity
        logoTl.timeScale(velocity);

        // Return to normal speed when scrolling stops
        const restingValue = velocity < 0 ? -1 : 1;

        gsap.to(scrollState, {
          value: restingValue,
          duration: 1,
          overwrite: true,
          onUpdate: () => logoTl.timeScale(scrollState.value),
        });
      },
    });
  });
}
