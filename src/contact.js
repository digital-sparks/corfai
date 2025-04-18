import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* The following plugin is a Club GSAP perk */
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

window.Webflow ||= [];
window.Webflow.push(() => {
  const h1Heading = document.querySelector('.contact_component .heading-style-h2');
  const description = document.querySelector('.contact_component p');

  document.fonts.ready.then(() => {
    let splitH1Heading = new SplitText(h1Heading, {
      type: 'words, lines',
      linesClass: 'split-text_lines',
    });

    let splitDescription = new SplitText(description, {
      type: 'words, lines',
      linesClass: 'split-text_lines',
    });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: '.contact_component',
          start: 'center bottom',
          // markers: true,
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
            return index * 0.165; //+ (index >= 2 ? 0.85 : 0);
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
        '.contact_component .divider_component',
        {
          scaleX: (i, target) => (target.classList.contains('is-horizontal') ? 0 : 1),
          scaleY: (i, target) => (target.classList.contains('is-horizontal') ? 1 : 0),
          transformOrigin: (i, target) => {
            const isHorizontal = target.classList.contains('is-horizontal');
            return isHorizontal ? 'left center' : 'center top';
          },
          ease: 'power2.inOut',
          duration: 1,
        },
        '<'
      )
      .from(
        ' .contact_component .contact_col-2',
        {
          opacity: 0,
          y: '1rem',
          duration: 2,
          ease: 'power3.out',
        },
        '<+0.35'
      )
      .from(
        '.contact_icon-wrap',
        {
          opacity: 0,
          duration: 2,
          ease: 'power3.out',
        },
        '<'
      );
  });
});
