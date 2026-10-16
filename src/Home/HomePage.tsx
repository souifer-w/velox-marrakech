import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Link } from "react-router-dom";
import { LoadingScreen } from "../components/LoadingScreen";
import "./HomePage.css";

import type { Car } from "../data/cars";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type HomePageProps = {
  cars: Car[];
  setCars: React.Dispatch<React.SetStateAction<Car[]>>;
};

// HomePage displays the fleet and coordinates the loading and scroll animations.
export function HomePage({ cars }: HomePageProps) {
  // Controls how long the initial loading screen is displayed.
  const [isLoading, setIsLoading] = useState(true);

  // Scopes GSAP selectors and animations to this page.
  const homeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Starts the homepage after the loading screen delay.
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => window.clearTimeout(timer);
  }, []);

  useLayoutEffect(() => {
    if (isLoading || !homeRef.current) return;

    // Avoids entrance animations for visitors who prefer reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Keeps all animations scoped and cleans them up on unmount.
    const context = gsap.context(() => {
      const hero = ".hero-section";
      const heroContent = ".hero-content";

      // Hero content enters in a smooth cinematic sequence.
      gsap.from(`${heroContent} .eyebrow`, {
        y: 25,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.1,
      });

      gsap.from(`${heroContent} h1`, {
        y: 65,
        opacity: 0,
        duration: 1.15,
        ease: "power4.out",
        delay: 0.2,
      });

      gsap.from(`${heroContent} .hero-description`, {
        y: 25,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.45,
      });

      gsap.from(`${heroContent} .hero-actions`, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.6,
      });

      gsap.from(`${heroContent} .hero-location`, {
        y: 15,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.75,
      });

      gsap.from(".hero-bottom span", {
        y: 15,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.8,
        ease: "power3.out",
      });

      // The hero background moves subtly while scrolling.
      gsap.to(`${hero} .hero-overlay`, {
        opacity: 0.85,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Trust items reveal one after another.
      gsap.from(".trust-item", {
        y: 35,
        opacity: 0,
        duration: 0.75,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".trust-section",
          start: "top 85%",
          once: true,
        },
      });

      // Fleet heading and introduction reveal on entry.
      gsap.from(".fleet-section-heading > div:first-child", {
        x: -45,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".fleet-section-heading",
          start: "top 85%",
          once: true,
        },
      });

      gsap.from(".home-fleet-cta", {
        x: 35,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".fleet-section-heading",
          start: "top 85%",
          once: true,
        },
      });

      // Car cards appear with a staggered premium reveal.
      gsap.from(".fleet-car-card", {
        y: 55,
        opacity: 0,
        scale: 0.97,
        duration: 0.8,
        stagger: 0.13,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".fleet-cars-grid",
          start: "top 82%",
          once: true,
        },
      });

      // Vehicle photography gets a gentle zoom as each card appears.
      gsap.utils
        .toArray<HTMLImageElement>(".fleet-car-image img")
        .forEach((image) => {
          gsap.fromTo(
            image,
            { scale: 1.08 },
            {
              scale: 1,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: image,
                start: "top 90%",
                once: true,
              },
            },
          );
        });

      // The fleet CTA enters after the vehicle cards.
      gsap.from(".hero-actions2", {
        y: 25,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".hero-actions2",
          start: "top 90%",
          once: true,
        },
      });

      // Experience image and text move in from opposite directions.
      gsap.from(".experience-image", {
        x: -65,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".experience-section",
          start: "top 78%",
          once: true,
        },
      });

      gsap.from(".experience-content", {
        x: 65,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".experience-section",
          start: "top 78%",
          once: true,
        },
      });

      // Experience benefits appear sequentially.
      gsap.from(".experience-list li", {
        x: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".experience-list",
          start: "top 88%",
          once: true,
        },
      });

      // Final booking section gets a soft upward reveal.
      gsap.from(".booking-section > *", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".booking-section",
          start: "top 82%",
          once: true,
        },
      });

      // Refreshes trigger positions after the page layout is ready.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, homeRef);

    return () => context.revert();
  }, [isLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div id="top" className="home-page" ref={homeRef}>
      <Header />

      <main>
        <section className="hero-section">
          <div className="hero-overlay" />

          <div className="hero-content">
            <p className="eyebrow">THE ART OF LUXURY DRIVING</p>

            <h1>
              Drive Beyond
              <br />
              <span>Ordinary.</span>
            </h1>

            <p className="hero-description">
              Discover Marrakech with an exceptional collection of luxury
              vehicles, tailored to your journey.
            </p>

            <div className="hero-actions">
              <Link to="/fleet" className="button button-gold">
                Explore Our Fleet <span>↗</span>
              </Link>
            </div>

            <div className="hero-location">
              <span className="location-dot" />
              MARRAKECH, MOROCCO
            </div>
          </div>

          <div className="hero-bottom">
            <span>EXCELLENCE IN EVERY DETAIL</span>
            <span>01 — 04</span>
          </div>
        </section>

        <section className="trust-section" id="services">
          <div className="trust-item">
            <span className="trust-icon">✦</span>
            <div>
              <h3>Premium Fleet</h3>
              <p>Exceptional vehicles</p>
            </div>
          </div>

          <div className="trust-item">
            <span className="trust-icon">◷</span>
            <div>
              <h3>24/7 Assistance</h3>
              <p>Here whenever you need us</p>
            </div>
          </div>

          <div className="trust-item">
            <span className="trust-icon">⌖</span>
            <div>
              <h3>Flexible Delivery</h3>
              <p>Airport, hotel or your location</p>
            </div>
          </div>

          <div className="trust-item">
            <span className="trust-icon">♧</span>
            <div>
              <h3>Personal Service</h3>
              <p>Your journey, your way</p>
            </div>
          </div>
        </section>

        <section className="fleet-section section-padding" id="fleet">
          <div className="fleet-container">
            <div className="fleet-section-heading">
              <div>
                <span className="fleet-section-kicker">
                  THE VELOX SELECTION
                </span>

                <h2>
                  Our <span>Fleet</span>
                </h2>

                <p>Exceptional vehicles. Unforgettable journeys.</p>
              </div>

              <div className="home-fleet-cta">
                <Link to="/fleet" className="button button-gold">
                  Explore the Full Fleet <span>↗</span>
                </Link>
              </div>
            </div>

            <div className="fleet-cars-grid">
              {cars
                .filter((car) => car.available)
                .slice(0, 6)
                .map((car) => (
                  <article className="fleet-car-card" key={car.id}>
                    <Link
                      className="fleet-car-image-link"
                      to={`/carDetails/${car.id}`}
                      aria-label={`View ${car.name} details`}
                    >
                      <div className="fleet-car-image">
                        <img src={car.image} alt={car.name} loading="lazy" />

                        <span className="fleet-car-category">
                          {car.category}
                        </span>

                        <span
                          className={`car-availability ${
                            car.available ? "is-available" : "is-unavailable"
                          }`}
                        >
                          <span className="availability-dot" />
                          {car.available ? "Available" : "Unavailable"}
                        </span>

                        <span className="fleet-car-image-arrow">
                          <span className="material-symbols-outlined">
                            arrow_outward
                          </span>
                        </span>
                      </div>
                    </Link>

                    <div className="fleet-car-content">
                      <div className="fleet-car-title-row">
                        <div className="fleet-car-title">
                          <span className="fleet-car-brand">{car.brand}</span>
                          <h3>{car.name}</h3>
                        </div>

                        <div className="fleet-car-price">
                          <strong>
                            {car.pricePerDay.toLocaleString("en-US")}
                          </strong>
                          <span>DH / DAY</span>
                        </div>
                      </div>

                      <div className="fleet-car-specs">
                        <span>
                          <span className="material-symbols-outlined">
                            settings
                          </span>
                          {car.transmission}
                        </span>

                        <span>
                          <span className="material-symbols-outlined">
                            airline_seat_recline_normal
                          </span>
                          {car.seats} seats
                        </span>

                        <span>
                          <span className="material-symbols-outlined">
                            local_gas_station
                          </span>
                          {car.fuel}
                        </span>
                      </div>

                      <div className="fleet-car-footer">
                        <span className="fleet-car-location">
                          <span className="material-symbols-outlined">
                            location_on
                          </span>
                          Marrakech, Morocco
                        </span>

                        <Link
                          to={`/carDetails/${car.id}`}
                          className="fleet-car-details-link"
                        >
                          View details
                          <span className="material-symbols-outlined">
                            arrow_forward
                          </span>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </div>

          <div className="hero-actions2">
            <Link to="/fleet" className="button button-gold">
              Explore Our Fleet <span>↗</span>
            </Link>
          </div>
        </section>

        <section className="experience-section" id="experience">
          <div className="experience-image" />

          <div className="experience-content">
            <p className="eyebrow">MORE THAN A RENTAL</p>

            <h2>
              Your Journey.
              <br />
              <span>Our Passion.</span>
            </h2>

            <p>
              At VELOX Marrakech, luxury is more than the car you drive. It is
              the comfort, attention and freedom that accompany every kilometre.
            </p>

            <ul className="experience-list">
              <li>✦ Carefully selected premium vehicles</li>
              <li>✦ Personalised booking assistance</li>
              <li>✦ Convenient vehicle delivery</li>
            </ul>

            <Link to="/fleet" className="button button-gold">
              Experience VELOX <span>↗</span>
            </Link>
          </div>
        </section>

        <section className="booking-section" id="booking">
          <p className="eyebrow">YOUR NEXT JOURNEY STARTS HERE</p>

          <h2>
            Ready to <span>Take the Wheel?</span>
          </h2>

          <p>
            Let us help you find the perfect vehicle for your next Marrakech
            adventure.
          </p>

          <Link
            to="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            className="button button-gold"
          >
            Contact Our Team <span>↗</span>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
