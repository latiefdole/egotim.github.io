document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Smooth Scroll (Lenis)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // 2. Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Only active on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows exactly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with lag
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });
    }

    // 3. GSAP Animations with ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Hero Text Reveal
    const heroTitle = new SplitType('.hero-title h1', { types: 'chars' });
    
    gsap.from(heroTitle.chars, {
        opacity: 0,
        y: 100,
        rotateX: -90,
        stagger: 0.05,
        duration: 2,
        ease: 'power4.out',
        delay: 0.5
    });

    gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 20,
        duration: 1.5,
        delay: 1.2,
        ease: 'power3.out'
    });

    // Skew on Scroll (makes elements skew based on velocity)
    /* 
    let proxy = { skew: 0 },
        skewSetter = gsap.quickSetter(".service-card", "skewY", "deg"), // fast
        clamp = gsap.utils.clamp(-20, 20); // don't let it skew too much

    ScrollTrigger.create({
        onUpdate: (self) => {
            let skew = clamp(self.getVelocity() / -300);
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
                proxy.skew = skew;
                gsap.to(proxy, {skew: 0, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => skewSetter(proxy.skew)});
            }
        }
    });
    */

    // Reveal Sections on Scroll
    const sections = document.querySelectorAll('.section-title, .service-card, .project-item');

    sections.forEach(section => {
        gsap.fromTo(section, 
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%', // Trigger when top of element hits 85% of viewport
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Parallax Effect for any element with data-speed
    const parallaxElements = document.querySelectorAll('[data-speed]');
    parallaxElements.forEach(el => {
        const speed = el.getAttribute('data-speed');
        gsap.to(el, {
            y: (i, target) => -ScrollTrigger.maxScroll(window) * target.dataset.speed,
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 0
            }
        });
    });

    // Magnetic Buttons (optional refinement)
    // Add logic here if needed
});
