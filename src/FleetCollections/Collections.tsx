import { useMemo, useState, useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LoadingScreen } from "../components/LoadingScreen";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import type { Car } from "../data/cars";
import "./Collections.css";

gsap.registerPlugin(ScrollTrigger);

type FleetCollectionsProps = {
  cars: Car[];
};

function FleetCollections({ cars }: FleetCollectionsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTransmission, setSelectedTransmission] = useState("All");
  const [selectedSeats, setSelectedSeats] = useState("All");
  const [selectedBudget, setSelectedBudget] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [isLoading, setIsLoading] = useState(true);

  const pageRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(
    () => [...new Set(cars.map((car) => car.category))].sort(),
    [cars],
  );

  const filteredCars = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const result = cars.filter((car) => {
      const searchMatches =
        search === "" ||
        car.name.toLowerCase().includes(search) ||
        car.brand.toLowerCase().includes(search) ||
        car.category.toLowerCase().includes(search) ||
        car.fuel.toLowerCase().includes(search) ||
        car.transmission.toLowerCase().includes(search);

      const categoryMatches =
        selectedCategory === "All" || car.category === selectedCategory;

      const transmissionMatches =
        selectedTransmission === "All" ||
        car.transmission === selectedTransmission;

      const seatsMatches =
        selectedSeats === "All" || car.seats === Number(selectedSeats);

      let budgetMatches = true;

      if (selectedBudget === "under-1000") {
        budgetMatches = car.pricePerDay < 1000;
      } else if (selectedBudget === "1000-2000") {
        budgetMatches = car.pricePerDay >= 1000 && car.pricePerDay <= 2000;
      } else if (selectedBudget === "over-2000") {
        budgetMatches = car.pricePerDay > 2000;
      }

      return (
        searchMatches &&
        categoryMatches &&
        transmissionMatches &&
        seatsMatches &&
        budgetMatches &&
        car.available
      );
    });

    const sortedCars = [...result];

    if (sortBy === "price-low") {
      sortedCars.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortBy === "price-high") {
      sortedCars.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (sortBy === "name") {
      sortedCars.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sortedCars;
  }, [
    cars,
    searchTerm,
    selectedCategory,
    selectedTransmission,
    selectedSeats,
    selectedBudget,
    sortBy,
  ]);

  // Resets all search and sorting options to their default values.
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedTransmission("All");
    setSelectedSeats("All");
    setSelectedBudget("All");
    setSortBy("featured");
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedCategory !== "All" ||
    selectedTransmission !== "All" ||
    selectedSeats !== "All" ||
    selectedBudget !== "All" ||
    sortBy !== "featured";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => window.clearTimeout(timer);
  }, []);

  useLayoutEffect(() => {
    if (isLoading || !pageRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            ".fleet-hero-content > *",
            ".fleet-hero-index",
            ".fleet-section-heading > *",
            ".fleet-filter-panel",
            ".fleet-results-meta",
          ],
          { clearProps: "all" },
        );

        return;
      }

      const heroTimeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      heroTimeline
        .fromTo(
          ".fleet-hero-content .fleet-eyebrow",
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7 },
        )
        .fromTo(
          ".fleet-hero-content h1",
          { y: 55, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1 },
          "-=0.4",
        )
        .fromTo(
          ".fleet-hero-content > p",
          { y: 25, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7 },
          "-=0.55",
        )
        .fromTo(
          ".fleet-hero-link",
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.65 },
          "-=0.4",
        )
        .fromTo(
          ".fleet-hero-index",
          { x: 25, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.7 },
          "-=0.5",
        );

      gsap.fromTo(
        ".fleet-section-heading > *",
        {
          y: 35,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".fleet-section-heading",
            start: "top 85%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".fleet-filter-panel",
        {
          y: 35,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".fleet-filter-panel",
            start: "top 88%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".fleet-results-meta",
        {
          y: 18,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".fleet-results-meta",
            start: "top 92%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".fleet-hero-overlay",
        { backgroundPosition: "center 0%" },
        {
          backgroundPosition: "center 20%",
          ease: "none",
          scrollTrigger: {
            trigger: ".fleet-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        },
      );

      gsap.fromTo(
        ".fleet-empty-state",
        {
          y: 25,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.65,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".fleet-empty-state",
            start: "top 88%",
            once: true,
          },
        },
      );
    }, pageRef);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      ctx.revert();
    };
  }, [isLoading]);

  useLayoutEffect(() => {
    if (isLoading || !cardsRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".fleet-car-card");

      if (prefersReducedMotion) {
        gsap.set(cards, {
          clearProps: "all",
        });

        return;
      }

      if (cards.length === 0) return;

      gsap.fromTo(
        cards,
        {
          y: 45,
          autoAlpha: 0,
          scale: 0.97,
        },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.75,
          stagger: {
            each: 0.12,
            from: "start",
          },
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 88%",
            once: true,
          },
        },
      );

      cards.forEach((card) => {
        const image = card.querySelector(".fleet-car-image img");

        if (!image) return;

        gsap.fromTo(
          image,
          {
            scale: 1.12,
          },
          {
            scale: 1,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true,
            },
          },
        );
      });
    }, cardsRef);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      ctx.revert();
    };
  }, [filteredCars, isLoading]);

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Header />

      <main className="fleet-page" ref={pageRef}>
        <section className="fleet-hero">
          <div className="fleet-hero-overlay" />

          <div className="fleet-hero-content">
            <span className="fleet-eyebrow">
              <span className="fleet-eyebrow-line" />
              VELOX MARRAKECH
            </span>

            <h1>
              Find Your
              <br />
              <span>Perfect Drive.</span>
            </h1>

            <p>
              Discover a carefully curated collection of exceptional vehicles,
              designed for every journey in Marrakech.
            </p>

            <a href="#fleet-collection" className="fleet-hero-link">
              EXPLORE THE FLEET
              <span className="material-symbols-outlined">arrow_downward</span>
            </a>
          </div>

          <div className="fleet-hero-index">
            <span>01</span>
            <span className="fleet-index-line" />
            <span>THE COLLECTION</span>
          </div>
        </section>

        <section className="fleet-collection-section" id="fleet-collection">
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

              <div className="fleet-heading-count">
                <span className="fleet-count-number">
                  {String(filteredCars.length).padStart(2, "0")}
                </span>
                <span className="fleet-count-label">VEHICLES AVAILABLE</span>
              </div>
            </div>

            <div className="fleet-filter-panel">
              <div className="fleet-filter-top">
                <div className="fleet-filter-title">
                  <span className="material-symbols-outlined">tune</span>
                  <span>Refine your search</span>
                </div>

                <button
                  type="button"
                  className="fleet-reset-button"
                  onClick={resetFilters}
                >
                  <span className="material-symbols-outlined">restart_alt</span>
                  Reset filters
                </button>
              </div>

              <div className="fleet-filter-bar">
                <label className="fleet-search">
                  <span className="material-symbols-outlined">search</span>
                  <input
                    type="search"
                    placeholder="Search vehicles or brands..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    aria-label="Search vehicles"
                  />
                </label>

                <div className="fleet-select">
                  <label htmlFor="fleet-category">Category</label>
                  <select
                    id="fleet-category"
                    value={selectedCategory}
                    onChange={(event) =>
                      setSelectedCategory(event.target.value)
                    }
                  >
                    <option value="All">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined fleet-select-arrow">
                    expand_more
                  </span>
                </div>

                <div className="fleet-select">
                  <label htmlFor="fleet-transmission">Transmission</label>
                  <select
                    id="fleet-transmission"
                    value={selectedTransmission}
                    onChange={(event) =>
                      setSelectedTransmission(event.target.value)
                    }
                  >
                    <option value="All">All Transmissions</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                  <span className="material-symbols-outlined fleet-select-arrow">
                    expand_more
                  </span>
                </div>

                <div className="fleet-select">
                  <label htmlFor="fleet-seats">Passengers</label>
                  <select
                    id="fleet-seats"
                    value={selectedSeats}
                    onChange={(event) => setSelectedSeats(event.target.value)}
                  >
                    <option value="All">Any Seats</option>
                    <option value="2">2 Seats</option>
                    <option value="4">4 Seats</option>
                    <option value="5">5 Seats</option>
                    <option value="7">7 Seats</option>
                  </select>
                  <span className="material-symbols-outlined fleet-select-arrow">
                    expand_more
                  </span>
                </div>

                <div className="fleet-select">
                  <label htmlFor="fleet-budget">Daily budget</label>
                  <select
                    id="fleet-budget"
                    value={selectedBudget}
                    onChange={(event) => setSelectedBudget(event.target.value)}
                  >
                    <option value="All">Any Budget</option>
                    <option value="under-1000">Under 1,000 DH</option>
                    <option value="1000-2000">1,000–2,000 DH</option>
                    <option value="over-2000">Over 2,000 DH</option>
                  </select>
                  <span className="material-symbols-outlined fleet-select-arrow">
                    expand_more
                  </span>
                </div>

                <div className="fleet-select fleet-sort-select">
                  <label htmlFor="fleet-sort">Sort by</label>
                  <select
                    id="fleet-sort"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                  <span className="material-symbols-outlined fleet-select-arrow">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            <div className="fleet-results-meta">
              <p>
                Showing <strong>{filteredCars.length}</strong>{" "}
                {filteredCars.length === 1 ? "vehicle" : "vehicles"}
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="fleet-clear-link"
                  onClick={resetFilters}
                >
                  Clear all filters
                </button>
              )}
            </div>

            {filteredCars.length > 0 ? (
              <div className="fleet-cars-grid" ref={cardsRef}>
                {filteredCars.map((car) => (
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
            ) : (
              <div className="fleet-empty-state">
                <span className="material-symbols-outlined">
                  directions_car
                </span>
                <h3>No vehicles found</h3>
                <p>
                  Try changing your search or adjusting the filters to discover
                  more vehicles.
                </p>
                <button
                  type="button"
                  className="fleet-empty-reset"
                  onClick={resetFilters}
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default FleetCollections;
