import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(() => {
  // Initialize a new Lenis instance for smooth scrolling

  ('use strict'); // fix lenis in safari
  let lenis;
  if (Webflow.env('editor') === undefined) {
    lenis = new Lenis({ lerp: 0.15 });

    // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
    lenis.on('scroll', ScrollTrigger.update);
    // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
    // This ensures Lenis's smooth scroll animation updates on each GSAP tick
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // Convert time from seconds to milliseconds
    });
    // Disable lag smoothing in GSAP to prevent any delay in scroll animations
    gsap.ticker.lagSmoothing(0);

    const footerIcon = document.querySelectorAll('.footer_icon');
    gsap.set(footerIcon[1], { opacity: 0 });

    document.querySelectorAll('[data-lenis-start]').forEach((attribute) => {
      attribute.addEventListener('click', () => {
        lenis.start();
      });
    });

    document.querySelectorAll('[data-lenis-stop]').forEach((attribute) => {
      attribute.addEventListener('click', () => {
        lenis.stop();
      });
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      // Clear the previous timer
      clearTimeout(resizeTimer);
      // Set a new timer (300ms debounce)
      resizeTimer = setTimeout(() => {
        lenis.start();
      }, 300);
    });
  }

  document.querySelectorAll('footer a').forEach((link) => {
    link.addEventListener('mouseenter', () => {
      gsap.to(footerIcon, {
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
      gsap.to(footerIcon, {
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

  gsap.from('.footer_wrap', {
    scrollTrigger: {
      trigger: 'footer',
      start: 'top bottom', // when the top of the trigger hits the top of the viewport
      end: 'bottom bottom', // end after scrolling 500px beyond the start
      //   toggleActions: 'play reverse play reverse',
      //   markers: true,
      scrub: true,
    },
    y: '2rem',
    scale: 0.98,
    transformOrigin: 'center bottom',
    opacity: 0,
  });

  gsap.from('.nav_component > div', {
    opacity: 0,
    duration: 1.2,
    delay: 0.4,
  });

  document.querySelectorAll('.button').forEach((button) => {
    const icons = button.querySelectorAll('.icon-1x1-medium');
    let currentTimeline = null;
    let buttonState = 'idle'; // 'idle', 'entering', 'entered', 'leaving'

    button.addEventListener('mouseenter', () => {
      // Clear any existing animations
      if (currentTimeline) {
        currentTimeline.kill();
      }

      // If we were in the middle of leaving, we need to start from the current position
      // Otherwise, we start fresh
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
      // If still entering, wait until completion
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
      // If already leaving or idle, do nothing
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
  });
});
