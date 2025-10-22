

import React, { useState, useEffect, useRef, memo, MouseEventHandler } from 'react';
import { createRoot } from 'react-dom/client';

declare const gsap: any;

// --- DATA & CONFIG ---

const servicesSubLinks = [
  { name: 'Architectural Design', href: 'architectural-design.html', icon: 'fas fa-archway', description: 'Innovative and functional spaces from concept to construction.', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60' },
  { name: 'Engineering Consultancy', href: 'engineering-consultancy.html', icon: 'fas fa-cogs', description: 'Expert technical advice and solutions for robust project outcomes.', image: 'https://images.unsplash.com/photo-1518692113669-e34fa251a37c?w=800&auto=format&fit=crop&q=60' },
  { name: 'Project Management Consultancy', href: 'project-management.html', icon: 'fas fa-tasks', description: 'Overseeing projects from inception to completion on time and budget.', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60' },
  { name: 'Sustainability & Energy', href: 'sustainability-energy.html', icon: 'fas fa-leaf', description: 'Integrating green principles for environmentally responsible designs.', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop&q=60' },
];

const aboutUsSubLinks = [
  { name: 'Who We Are', href: '#who-we-are', icon: 'fas fa-building' },
  { name: 'Our Core Values', href: '#our-values', icon: 'fas fa-gem' },
  { name: 'Meet The Team', href: '#our-team', icon: 'fas fa-users' },
];

const navLinks = [
  { name: 'Home', href: '/index.html' },
  { name: 'About Us', href: '/about.html', subLinks: aboutUsSubLinks },
  { name: 'Works/Projects', href: '/index.html#works' },
  { name: 'Services', href: '/index.html#our-services', subLinks: servicesSubLinks },
  { name: 'Blog', href: '/index.html#blog' },
  { name: 'Careers', href: '/careers.html' },
  { name: 'Contact', href: '/contact.html' },
];

const teamMembers = [
    { name: 'John Doe', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=500&auto=format&fit=crop&q=60' },
    { name: 'Jane Smith', role: 'Lead Architect', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=500&auto=format&fit=crop&q=60' },
    { name: 'Mike Johnson', role: 'Head of Engineering', image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=500&h=500&auto=format&fit=crop&q=60' },
    { name: 'Emily White', role: 'Project Director', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&auto=format&fit=crop&q=60' },
];


// --- SHARED & LAYOUT COMPONENTS ---

const AppLink = ({ href, className = '', children, onClick, ...props }: {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  [key: string]: any;
}) => {
    const isToggle = href === '#';

    const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
        if (isToggle) {
            e.preventDefault();
        }
        
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <a 
            href={href} 
            className={className} 
            onClick={onClick ? handleClick : undefined} 
            {...props}
        >
            {children}
        </a>
    );
};

const MobileNav = ({ isOpen, onClose }) => {
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const navContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const focusableElements = navContainerRef.current?.querySelectorAll<HTMLElement>(
                'a[href], button, [tabindex]:not([tabindex="-1"])'
            );
            if (!focusableElements || focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            setTimeout(() => firstElement.focus(), 100);

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    onClose();
                    return;
                }
                if (e.key === 'Tab') {
                    if (e.shiftKey) { 
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else { 
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            };
            
            const container = navContainerRef.current;
            container?.addEventListener('keydown', handleKeyDown);
            return () => container?.removeEventListener('keydown', handleKeyDown);

        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) {
            setOpenSubmenu(null);
        }
    }, [isOpen]);

    const handleSubmenuToggle = (linkName: string) => {
        setOpenSubmenu(prev => prev === linkName ? null : linkName);
    }
    
    return (
        <div ref={navContainerRef} className={`mobile-nav-overlay ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-hidden={!isOpen} id="mobile-nav">
            <button className="mobile-nav-close" onClick={onClose} aria-label="Close navigation menu">
                <i className="fas fa-times" aria-hidden="true"></i>
            </button>
            <nav className="mobile-nav">
                <ul>
                    {navLinks.map(link => (
                         <li key={link.name}>
                             <AppLink 
                                href={link.subLinks ? '#' : link.href} 
                                onClick={link.subLinks ? () => handleSubmenuToggle(link.name) : onClose}
                                aria-haspopup={!!link.subLinks}
                                aria-expanded={link.subLinks ? openSubmenu === link.name : undefined}
                                aria-controls={link.subLinks ? `mobile-${link.name.toLowerCase().replace(' ', '-')}-submenu` : undefined}
                                id={link.subLinks ? `mobile-${link.name.toLowerCase().replace(' ', '-')}-toggle` : undefined}
                             >
                                 {link.name}
                                 {link.subLinks && <i className={`fas fa-chevron-down dropdown-indicator ${openSubmenu === link.name ? 'open' : ''}`} aria-hidden="true"></i>}
                             </AppLink>
                             {link.subLinks && (
                                 <ul id={`mobile-${link.name.toLowerCase().replace(' ', '-')}-submenu`} className={`mobile-submenu ${openSubmenu === link.name ? 'open' : ''}`} aria-hidden={openSubmenu !== link.name}>
                                     {link.subLinks.map(subLink => (
                                         <li key={subLink.name}><AppLink href={subLink.href} onClick={onClose}>{subLink.name}</AppLink></li>
                                     ))}
                                 </ul>
                             )}
                         </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

const SkipToContentLink = () => (
    <a href="#main-content" className="skip-to-content-link">
        Skip to main content
    </a>
);

const Header = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const burgerMenuRef = useRef<HTMLButtonElement>(null);
  const dropdownContainerRefs = useRef<Record<string, HTMLLIElement | null>>({});

  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
    burgerMenuRef.current?.focus();
  };

  const closeDropdowns = (shouldFocusToggle = true) => {
    if (!openDropdown) return;

    if (!shouldFocusToggle) {
        setOpenDropdown(null);
        return;
    }

    const toggleButton = dropdownContainerRefs.current[openDropdown]?.querySelector('a');
    if (toggleButton) {
        toggleButton.focus();
    }
    setOpenDropdown(null);
  };

  useEffect(() => {
    if (openDropdown) {
      const firstItem = dropdownContainerRefs.current[openDropdown]?.querySelector<HTMLAnchorElement>('.dropdown-menu a');
      firstItem?.focus();
    }
  }, [openDropdown]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDropdowns();
      }
    };
    const handleClickOutside = (event: MouseEvent) => {
        if (openDropdown && dropdownContainerRefs.current[openDropdown] && !dropdownContainerRefs.current[openDropdown]!.contains(event.target as Node)) {
            closeDropdowns(false);
        }
    };

    if (openDropdown) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);
  
  const handleDropdownToggle = (e: React.MouseEvent, linkName: string) => {
    e.preventDefault();
    setOpenDropdown(prev => (prev === linkName ? null : linkName));
  };

  const handleDropdownItemKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (!openDropdown) return;
    const container = dropdownContainerRefs.current[openDropdown];
    if (!container) return;

    const items = Array.from(
      container.querySelectorAll<HTMLAnchorElement>('.dropdown-link-item')
    );
    const currentIndex = items.indexOf(e.currentTarget);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(currentIndex + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(currentIndex - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Tab' && !e.shiftKey && currentIndex === items.length - 1) {
      closeDropdowns(false);
    } else if (e.key === 'Tab' && e.shiftKey && currentIndex === 0) {
      closeDropdowns(false);
    }
  };

  return (
    <header className={`app-header`}>
      <div className="logo">
        <AppLink href="/index.html">
          <img src="https://res.cloudinary.com/dj3vhocuf/image/upload/v1760896759/Blue_Bold_Office_Idea_Logo_250_x_80_px_7_uatyqd.png" alt="Taj Design Consult Logo" className="logo-image" />
        </AppLink>
      </div>
      <nav className="main-nav" aria-label="Main navigation">
        <ul>
          {navLinks.map((link) => (
             <li 
              key={link.name} 
              className={`${link.subLinks ? 'has-dropdown' : ''} ${openDropdown === link.name ? 'open' : ''}`}
              ref={(el) => dropdownContainerRefs.current[link.name] = el}
            >
              <AppLink 
                href={link.href}
                id={`${link.name.toLowerCase().replace(' ', '-')}-menu-toggle`}
                onClick={(e) => link.subLinks && handleDropdownToggle(e, link.name)}
                aria-haspopup={!!link.subLinks}
                aria-expanded={openDropdown === link.name}
                aria-controls={link.subLinks ? `${link.name.toLowerCase().replace(' ', '-')}-dropdown-menu` : undefined}
              >
                {link.name}
                {link.subLinks && <i className="fas fa-chevron-down dropdown-indicator" aria-hidden="true"></i>}
              </AppLink>
              {link.subLinks && (
                <div id={`${link.name.toLowerCase().replace(' ', '-')}-dropdown-menu`} className="dropdown-menu" role="menu" aria-labelledby={`${link.name.toLowerCase().replace(' ', '-')}-menu-toggle`}>
                  <ul className="dropdown-links" role="none">
                      {link.subLinks.map((subLink, index) => (
                          <li role="presentation" key={subLink.name}>
                              <AppLink
                                  href={subLink.href}
                                  role="menuitem"
                                  onKeyDown={handleDropdownItemKeyDown}
                                  className="dropdown-link-item"
                                  onClick={() => setOpenDropdown(null)}
                                  style={{ '--delay': `${index * 0.05}s` } as React.CSSProperties}
                              >
                                  <i className={`${subLink.icon} dropdown-link-icon`} aria-hidden="true"></i>
                                  <span>{subLink.name}</span>
                              </AppLink>
                          </li>
                      ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <button 
        ref={burgerMenuRef}
        className="burger-menu" 
        onClick={() => setIsMobileNavOpen(true)}
        aria-label="Open navigation menu"
        aria-controls="mobile-nav"
        aria-expanded={isMobileNavOpen}
      >
        <i className="fas fa-bars" aria-hidden="true"></i>
      </button>
      <MobileNav isOpen={isMobileNavOpen} onClose={closeMobileNav} />
    </header>
  );
};

const LeftSidebar = () => {
  return (
    <aside className="left-sidebar">
      <div className="sidebar-top">
        <div className="divider" />
        <div className="home-text">ABOUT US</div>
      </div>
      <div className="social-icons">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f" aria-hidden="true"></i></a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fab fa-twitter" aria-hidden="true"></i></a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram" aria-hidden="true"></i></a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in" aria-hidden="true"></i></a>
      </div>
      <div className="sidebar-footer">
        <p>© Taj Design Consult 2024. All rights reserved.</p>
      </div>
    </aside>
  );
};

const WaveAnimation = memo(() => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let animationFrameId: number;

        const waves = [
            { amp: 15, freq: 0.02, phase: 0, color: 'rgba(212, 175, 55, 0.2)', speed: 0.01 },
            { amp: 20, freq: 0.015, phase: 1, color: 'rgba(212, 175, 55, 0.3)', speed: 0.015 },
            { amp: 25, freq: 0.01, phase: 2, color: 'rgba(212, 175, 55, 0.4)', speed: 0.02 },
        ];
        
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        const draw = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            waves.forEach(wave => {
                wave.phase += wave.speed;
                ctx.beginPath();
                ctx.moveTo(0, canvas.height);
                for (let x = 0; x < canvas.width; x++) {
                    const y = Math.sin(x * wave.freq + wave.phase) * wave.amp + (canvas.height / 1.5);
                    ctx.lineTo(x, y);
                }
                ctx.lineTo(canvas.width, canvas.height);
                ctx.closePath();
                ctx.fillStyle = wave.color;
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(draw);
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} id="footer-wave-canvas" aria-hidden="true" />;
});

const CustomCursor = memo(() => {
    const dotRef = useRef<HTMLDivElement>(null);
    const outlineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const dot = dotRef.current;
        const outline = outlineRef.current;
        if (!dot || !outline) return;

        gsap.set([dot, outline], { xPercent: -50, yPercent: -50 });

        const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
        const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });
        const outlineX = gsap.quickTo(outline, "x", { duration: 0.3, ease: "power3" });
        const outlineY = gsap.quickTo(outline, "y", { duration: 0.3, ease: "power3" });

        const mouseMove = (e: MouseEvent) => {
            dotX(e.clientX);
            dotY(e.clientY);
            outlineX(e.clientX);
            outlineY(e.clientY);
        };
        
        const showCursor = () => {
            dot.classList.add('visible');
            outline.classList.add('visible');
        };
        const hideCursor = () => {
            dot.classList.remove('visible');
            outline.classList.remove('visible');
        };
        
        const handleMouseEnterHoverTarget = () => {
            dot.classList.add('cursor-hover');
            outline.classList.add('cursor-hover');
        };

        const handleMouseLeaveHoverTarget = () => {
            dot.classList.remove('cursor-hover');
            outline.classList.remove('cursor-hover');
        };
        
        window.addEventListener("mousemove", mouseMove);
        document.body.addEventListener("mouseleave", hideCursor);
        document.body.addEventListener("mouseenter", showCursor);

        const hoverTargets = document.querySelectorAll(
            'a, button, [role="button"], input, .value-card, .team-member-card, .whatsapp-widget, select, textarea, label'
        );
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', handleMouseEnterHoverTarget);
            target.addEventListener('mouseleave', handleMouseLeaveHoverTarget);
        });

        return () => {
            window.removeEventListener("mousemove", mouseMove);
            document.body.removeEventListener("mouseleave", hideCursor);
            document.body.removeEventListener("mouseenter", showCursor);
            hoverTargets.forEach(target => {
                target.removeEventListener('mouseenter', handleMouseEnterHoverTarget);
                target.removeEventListener('mouseleave', handleMouseLeaveHoverTarget);
            });
        };
    }, []);

    return (
        <>
            <div ref={outlineRef} className="custom-cursor-outline"></div>
            <div ref={dotRef} className="custom-cursor-dot"></div>
        </>
    );
});

const WhatsAppChatWidget = () => (
    <a
        href="https://wa.me/97477123400"
        className="whatsapp-widget"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
    >
        <div className="whatsapp-ring"></div>
        <div className="whatsapp-ring-delay"></div>
        <i className="fab fa-whatsapp whatsapp-icon" aria-hidden="true"></i>
    </a>
);


const CallToAction = () => (
    <section className="cta-section scroll-trigger fade-up">
        <div className="container">
            <h2 className="scroll-trigger fade-up" style={{ transitionDelay: '0.1s' }}>Let's Build the Future Together</h2>
            <p className="scroll-trigger fade-up" style={{ transitionDelay: '0.2s' }}>
                Have a vision for your next project? Our team of experts is ready to help you bring it to life. Contact us today to discuss your ideas.
            </p>
            <a href="/contact.html" className="cta-button scroll-trigger fade-up" style={{ transitionDelay: '0.3s' }}>Get in Touch</a>
        </div>
    </section>
);


const Footer = () => {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <footer id="footer" className="app-footer">
            <WaveAnimation />
            <div className="container">
                <div className="copyright-section">
                    <span>2024 © Taj Design Consult. All rights reserved.</span>
                    <button className="to-top" onClick={scrollToTop} aria-label="Scroll back to top">To Top ↑</button>
                </div>
            </div>
          </footer>
    )
}

const TeamSection = () => (
    <section id="our-team" className="content-section">
        <div className="container">
            <h2 className="section-title scroll-trigger fade-up" style={{ textAlign: 'center' }}>Meet Our <strong>Leadership</strong></h2>
            <div className="team-grid">
                {teamMembers.map((member, index) => (
                    <div className="team-member-card scroll-trigger fade-up" key={index} style={{ transitionDelay: `${index * 0.1}s` }}>
                        <div className="team-member-image">
                            <img src={member.image} alt={`Portrait of ${member.name}`} />
                        </div>
                        <div className="team-member-info">
                            <h3>{member.name}</h3>
                            <p>{member.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const AboutPage = () => {

    const values = [
        { icon: 'fas fa-lightbulb', title: 'Innovation', description: 'We embrace creativity and cutting-edge technology to deliver forward-thinking solutions that redefine industry standards.' },
        { icon: 'fas fa-handshake', title: 'Integrity', description: 'Our commitment to honesty and transparency builds lasting relationships with our clients, partners, and community.' },
        { icon: 'fas fa-star', title: 'Excellence', description: 'We pursue the highest standards in every aspect of our work, from initial concept to final execution and delivery.' },
        { icon: 'fas fa-users', title: 'Collaboration', description: 'We believe the best results come from teamwork, integrating diverse expertise to achieve a unified vision.' },
    ];


  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) { document.querySelectorAll('.scroll-trigger').forEach(el => el.classList.add('visible')); return; }
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const elementsToReveal = document.querySelectorAll('.scroll-trigger');
    elementsToReveal.forEach((el) => observer.observe(el));
    return () => elementsToReveal.forEach((el) => observer.unobserve(el));
  }, []);
  
  return (
    <>
      <section id="about-hero" className="about-hero-section scroll-trigger fade-up">
        <h1>About <strong>Taj Design Consult</strong></h1>
      </section>

      <section id="who-we-are" className="content-section">
        <div className="container">
            <div className="about-content-grid">
                <div className="about-main-content scroll-trigger fade-up" style={{transitionDelay: '0.1s'}}>
                    <h2 className="section-title">Who <strong>We Are</strong></h2>
                    <p>
                        Established with a vision to redefine the architectural and engineering landscape in Qatar, Taj Design Consult is a premier multidisciplinary consultancy firm. We are a collective of passionate architects, engineers, project managers, and sustainability experts dedicated to creating spaces that are not only aesthetically compelling but also functionally robust and environmentally responsible.
                    </p>
                    <p>
                        Our portfolio spans a diverse range of sectors, including commercial, residential, hospitality, and public infrastructure. At the core of our philosophy is a commitment to evidence-led design, where every decision is informed by rigorous analysis, technical precision, and a deep understanding of our clients' aspirations. We pride ourselves on turning ambitious ideas into tangible, high-quality realities, delivered on time and within budget.
                    </p>
                </div>
                <div className="about-sidebar-image scroll-trigger fade-up" style={{transitionDelay: '0.2s'}}>
                  <img src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&auto=format&fit=crop&q=60" alt="A modern architectural building with clean lines" />
                </div>
            </div>
        </div>
      </section>

      <section id="our-values" className="content-section section-bg-light">
          <div className="container">
            <h2 className="section-title scroll-trigger fade-up" style={{textAlign: 'center'}}>Our Core <strong>Values</strong></h2>
            <div className="values-grid">
                {values.map((value, index) => (
                    <div className="value-card scroll-trigger fade-up" key={index} style={{ transitionDelay: `${index * 0.1}s` }}>
                        <div className="value-icon-wrapper">
                            <i className={`value-icon ${value.icon}`} aria-hidden="true"></i>
                        </div>
                        <h3>{value.title}</h3>
                        <p>{value.description}</p>
                    </div>
                ))}
            </div>
          </div>
      </section>

      <TeamSection />

      <CallToAction />
    </>
  );
};

const App = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.body.style.backgroundColor = '#fff';
        const timer = setTimeout(() => setLoading(false), 200);
        return () => {
            document.body.style.backgroundColor = '';
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className={`app ${loading ? 'loading' : ''}`}>
            <SkipToContentLink />
            <CustomCursor />
            <WhatsAppChatWidget />
            <Header />
            <div className="main-container">
                <LeftSidebar />
                <main className="main-content" id="main-content" tabIndex={-1}>
                    <AboutPage />
                    <Footer />
                </main>
            </div>
        </div>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
