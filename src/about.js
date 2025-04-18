import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';

/* The following plugin is a Club GSAP perk */
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText, Observer);

window.Webflow ||= [];
window.Webflow.push(() => {
  const h1Heading = document.querySelector('.heading-style-h0');

  document.fonts.ready.then(() => {
    let splitH1Heading = new SplitText(h1Heading, {
      type: 'words, lines',
      linesClass: 'split-text_lines',
    });

    const subTitle = document.querySelector('.heading-style-h5');

    let splitSubTitle = new SplitText(subTitle, {
      type: 'chars',
      linesClass: 'split-text_lines',
    });

    gsap.set('.heading-style-h5', { opacity: 0 });

    gsap
      .timeline()

      .from('.section_hero-full-screen img:not(.logos_image)', {
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
          stagger: function (index) {
            return index * 0.165;
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
        '.reveal-element',
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

    document.querySelectorAll('.section_2col').forEach((section) => {
      const heading = section.querySelector('.heading-style-h3');
      const description = section.querySelectorAll('.w-richtext p');
      const image = section.querySelector('.horizontal-image-wrap img');

      let splitHeading = new SplitText(heading, {
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
            trigger: section,
            start: 'center bottom',
            end: 'bottom top',
            //   markers: true,
            //   toggleActions: 'play reverse play reverse',
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
              return index * 0.165; //+ (index >= 2 ? 0.85 : 0);
            },
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
    });

    // ————— LOGO SLIDER MARQUEE ————— //
    document.querySelectorAll('.logos_wrapper').forEach((item, index) => {
      let tl = gsap.timeline({ repeat: -1, onReverseComplete: () => tl.progress(1) });

      tl.to(item.querySelectorAll('.logos_component'), {
        xPercent: index % 2 ? 100 : -100,
        duration: 70,
        ease: 'none',
      });

      let object = { value: 1 };

      Observer.create({
        target: window,
        type: 'wheel,touch',
        wheelSpeed: -1,
        onChangeY: (self) => {
          let v = self.velocityY * -0.015;
          v = gsap.utils.clamp(-5, 5, v);
          tl.timeScale(v);
          let resting = 1;
          if (v < 0) resting = -1;
          gsap.fromTo(
            object,
            { value: v },
            { value: resting, duration: 1, onUpdate: () => tl.timeScale(object.value) }
          );
        },
      });
    });
    // ————— LOGO SLIDER MARQUEE ————— //

    // .from(
    //   '.contact_component .divider_component',
    //   {
    //     scaleX: (i, target) => (target.classList.contains('is-horizontal') ? 0 : 1),
    //     scaleY: (i, target) => (target.classList.contains('is-horizontal') ? 1 : 0),
    //     transformOrigin: (i, target) => {
    //       const isHorizontal = target.classList.contains('is-horizontal');
    //       return isHorizontal ? 'left center' : 'center top';
    //     },
    //     ease: 'power2.inOut',
    //     duration: 1,
    //   },
    //   '<'
    // )
    // .from(
    //   '.contact_component .text-size-xlarge, .contact_component .contact_col-2',
    //   {
    //     opacity: 0,
    //     y: '1.5rem',
    //     duration: 2,
    //     ease: 'power3.out',
    //     stagger: {
    //       each: 0.1,
    //     },
    //   },
    //   '<+0.35'
    // )
    // .from(
    //   '.contact_icon-wrap',
    //   {
    //     opacity: 0,
    //     duration: 2,
    //     ease: 'power3.out',
    //   },
    //   '<'
    // );
  });
});
