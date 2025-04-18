import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* The following plugin is a Club GSAP perk */
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

window.Webflow ||= [];
window.Webflow.push(() => {
  document.fonts.ready.then(() => {
    const h1Heading = document.querySelector('.section_hero-full-screen .heading-style-h0');

    let splitH1Heading = new SplitText(h1Heading, {
      type: 'words, lines',
      linesClass: 'split-text_lines',
    });

    const subTitle = document.querySelector('.section_hero-full-screen .heading-style-h5');

    let splitSubTitle = new SplitText(subTitle, {
      type: 'chars',
      linesClass: 'split-text_lines',
    });

    gsap.set(subTitle, { opacity: 0 });

    gsap
      .timeline()

      .from('.section_hero-full-screen .hero-lottie', {
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
          // delay: 1.5,
        },
        '<'
      )
      .fromTo(
        '.section_hero-full-screen .reveal-element',
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
        '.section_hero-full-screen .reveal-element',
        {
          onStart: () => {
            gsap.set('.heading-style-h5', { opacity: 1 });
          },
          transformOrigin: 'center right',
          ease: 'power2.out',
          scaleX: 0,
          duration: 0.5,
          delay: 0.05,
        },
        '>'
      );

    gsap
      .timeline({
        scrollTrigger: {
          trigger: '.section_we-help',
          start: 'top bottom', // when the top of the trigger hits the top of the viewport
          // end: '+=500', // end after scrolling 500px beyond the start
          scrub: true, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
          // markers: true,
        },
      })
      .to('.hero-lottie', { yPercent: 25, scale: 1.05, ease: 'none' });
    // .to(
    //   '.section_hero-full-screen .title_component',
    //   { opacity: 0, scale: 1.05, ease: 'none' },
    //   '<'
    // );

    // gsap.from(
    //   '.card-border-gradient',
    //   {
    //     // scaleX: 0,
    //     // transformOrigin: 'left center',
    //     ease: 'power2.inOut',
    //     duration: 1,
    //     backgroundImage: 'linear-gradient(70deg, #0e193f, #0e193f)',
    //   },
    //   '<'
    // );

    const description2 = document.querySelectorAll('.section_we-help .heading-style-h4');

    let splitDescription2 = new SplitText(description2, {
      type: 'words, lines',
      linesClass: 'split-text_lines',
    });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: '.section_we-help',
          start: 'center bottom',
          end: 'bottom top',
          // markers: true,
          //   toggleActions: 'play reverse play reverse',
        },
      })
      .from(splitDescription2.lines, {
        opacity: 0,
        yPercent: 40,
        duration: 1,
        // rotateZ: 1,
        transformOrigin: 'left bottom',
        ease: 'power3.out',
        stagger: {
          each: 0.02,
        },
      });

    const title3 = document.querySelectorAll('.section_testimonials .heading-style-h1');

    let splitTitle3 = new SplitText(title3, {
      type: 'words, lines',
      linesClass: 'split-text_lines',
      lineThreshold: 0.4,
    });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: title3,
          start: 'center bottom',
          end: 'bottom top',
          // markers: true,
          //   toggleActions: 'play reverse play reverse',
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

    document.querySelectorAll('.testimonial_component').forEach((card) => {
      // const revealElement = card.querySelector('.reveal-element');
      // const number = card.querySelector('.heading-style-h3');
      const title = card.querySelectorAll('.heading-style-h6');
      const description = card.querySelector('p');
      // const image = card.querySelector('img');
      // const icon = card.querySelector('.icon-1x1-large');
      let hasAnimated = false;

      let splitTitle = new SplitText(title, {
        type: 'lines, words',
        linesClass: 'split-text_lines',
      });

      let splitDescription = new SplitText(description, {
        type: 'lines, words',
        linesClass: 'split-text_lines',
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: card,
            start: '25% bottom', // when the top of the trigger hits the top of the viewport
            end: 'bottom center', // end after scrolling 500px beyond the start
            //   toggleActions: 'play reverse play reverse',
            //   markers: true,
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
            //   stagger: function (index) {
            //     return index * 0.165 + (index >= 2 ? 0.85 : 0);
            //   },
            // delay: 1.5,
          },
          '<'
        );
    });
  });
});
