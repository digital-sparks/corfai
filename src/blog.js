import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* The following plugin is a Club GSAP perk */
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const getProp = (value) => getComputedStyle(document.documentElement).getPropertyValue(value);

// Initialize animations function that can work with all or specific elements
function initializeResourceAnimations(container = document) {
  if (container !== document) {
    const opacity = window.getComputedStyle(container).opacity;
    if (!opacity || opacity === '1') return;
  }

  container.querySelectorAll('.insights_article').forEach((article) => {
    const thumbnail = article.querySelector('.horizontal-image-wrap img');

    gsap
      .timeline({
        scrollTrigger: {
          trigger: thumbnail,
          start: 'top bottom', // when the top of the trigger hits the top of the viewport
          end: 'bottom top', // end after scrolling 500px beyond the start
          scrub: true,
          //   toggleActions: 'play reverse play reverse',
          //   markers: true,
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
      .fromTo(
        thumbnail,
        {
          yPercent: -5,
        },
        { yPercent: 5 }
      );

    // Insights column animations

    const card = article.querySelector('.insights_col-wrap');
    const title = card.querySelector('.heading-style-h3');
    const description = card.querySelector(' p');
    const icon = card.querySelector(' .icon-1x1-large');
    let hasAnimated = false;

    let splitTitle = new SplitText(title, {
      type: 'lines, words',
      linesClass: 'split-text_lines',
    });

    let splitDescription = new SplitText(description, {
      type: 'lines, words',
      linesClass: 'split-text_lines',
    });

    // gsap.set(number, { opacity: 0 });

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
        // rotateZ: 1,
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
      .from(
        icon,
        {
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        },
        '<-0.2'
      );

    article.querySelectorAll('a:not(.button)').forEach((link) => {
      link.addEventListener('mouseenter', () => {
        gsap
          .timeline()
          .to(icon, {
            x: '0.5rem',
            y: '-0.5rem',
            duration: 0.5,
            ease: 'power3.out',
            // scale: 1.1,
            transformOrigin: 'bottom left',
            ...(hasAnimated ? { opacity: 0.8 } : {}),
          })
          .to(
            title,
            {
              color: getProp('--_base--navy--navy-300'),
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
            // scale: 1,
            opacity: 1,
          })
          .to(
            title,
            {
              color: getProp('--_semantics---text-color--text-primary'),
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
  });
}

window.Webflow ||= [];
window.Webflow.push(() => {
  document.fonts.ready.then(() => {
    initializeResourceAnimations();
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
