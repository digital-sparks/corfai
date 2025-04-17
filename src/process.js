import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* The following plugin is a Club GSAP perk */
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

window.Webflow ||= [];
window.Webflow.push(() => {
  const getProp = (value) => getComputedStyle(document.documentElement).getPropertyValue(value);

  document.querySelectorAll('.process_card').forEach((card) => {
    const revealElement = card.querySelector('.reveal-element');
    const number = card.querySelector('.heading-style-h3');
    const title = card.querySelectorAll('.heading-style-h3')[1];
    const description = card.querySelector('p');
    const icon = card.querySelector('.icon-1x1-large');
    let hasAnimated = false;

    let splitTitle = new SplitText(title, {
      type: 'lines, words',
      linesClass: 'split-text_lines',
    });

    let splitDescription = new SplitText(description, {
      type: 'lines, words',
      linesClass: 'split-text_lines',
    });

    gsap.set(number, { opacity: 0 });

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
          //   stagger: function (index) {
          //     return index * 0.165 + (index >= 2 ? 0.85 : 0);
          //   },
          // delay: 1.5,
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
          //   onStart: () => {
          //     gsap.set(number, { opacity: 1 });
          //   },
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
          card.querySelector('.process_card-bottom'),
          {
            backgroundColor: getProp('--_base--navy--navy-300'),
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
          card.querySelector('.process_card-bottom'),
          {
            backgroundColor: getProp('--_semantics---background-color--bg-alternate'),
            duration: 0.3,
            ease: 'power1.out',
          },
          '<'
        );
    });
  });
});
