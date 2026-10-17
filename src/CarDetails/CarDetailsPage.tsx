import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import type { FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CarDetailsPage.css";
import type { Car, Reservation } from "../data/cars";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Fuel,
  Gauge,
  Luggage,
  Users,
  Settings2,
  MessageCircle,
  ShieldCheck,
  Star,
  Sparkles,
} from "lucide-react";
import { LoadingScreen } from "../components/LoadingScreen";

gsap.registerPlugin(ScrollTrigger);

type CarDetailsPageProps = {
  cars: Car[];
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
};

function CarDetailsPage({
  cars,
  reservations,
  setReservations,
}: CarDetailsPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const pageRef = useRef<HTMLElement | null>(null);

  const car = cars.find((item) => item.id === Number(id));

  const [reservationMessage, setReservationMessage] = useState("");
  const [reservationError, setReservationError] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [returnLocation, setReturnLocation] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date().toLocaleDateString("en-CA");

  const changeImage = (image: string) => {
    setSelectedImage(image);
  };

  const AddBookingCar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setReservationMessage("");
    setReservationError(false);

    if (!car) {
      setReservationMessage("Vehicle not found. Please select another car.");
      setReservationError(true);
      return;
    }

    if (startDate < today) {
      setReservationMessage("Pickup date cannot be in the past.");
      setReservationError(true);
      return;
    }

    if (endDate <= startDate) {
      setReservationMessage("Return date must be after pickup date.");
      setReservationError(true);
      return;
    }

    const hasDateConflict = reservations.some(
      (reservation) =>
        reservation.car.id === car.id &&
        startDate < reservation.endDate &&
        endDate > reservation.startDate,
    );

    if (hasDateConflict) {
      setReservationMessage(
        "This vehicle is already reserved for part of those dates.",
      );
      setReservationError(true);
      return;
    }

    const rentalDays = Math.ceil(
      (new Date(`${endDate}T00:00:00`).getTime() -
        new Date(`${startDate}T00:00:00`).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    const newReservation: Reservation = {
      car,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientPhone: clientPhone.trim(),
      startDate,
      endDate,
      pickupLocation: pickupLocation.trim(),
      returnLocation: returnLocation.trim(),
      totalPrice: rentalDays * car.pricePerDay,
    };

    setReservations((currentReservations) => [
      ...currentReservations,
      newReservation,
    ]);

    setReservationMessage(
      `Your reservation request has been submitted successfully! Total: ${newReservation.totalPrice.toLocaleString("en-US")} MAD.`,
    );

    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setStartDate("");
    setEndDate("");
    setPickupLocation("");
    setReturnLocation("");

    navigate("/confirmation");
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => window.clearTimeout(timer);
  }, []);

  useLayoutEffect(() => {
    if (isLoading || !car || !pageRef.current) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const page = pageRef.current;

    const ctx = gsap.context(() => {
      const entranceTimeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      entranceTimeline
        .fromTo(
          ".car-breadcrumb",
          {
            autoAlpha: 0,
            y: 12,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            clearProps: "opacity,visibility,transform",
          },
        )
        .fromTo(
          ".car-gallery-main",
          {
            autoAlpha: 0,
            y: 22,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            clearProps: "opacity,visibility,transform",
          },
          "-=0.2",
        )
        .fromTo(
          ".car-gallery-thumbnails button",
          {
            autoAlpha: 0,
            y: 12,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.09,
            clearProps: "opacity,visibility,transform",
          },
          "-=0.35",
        )
        .fromTo(
          ".car-information > *",
          {
            autoAlpha: 0,
            y: 16,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.07,
            clearProps: "opacity,visibility,transform",
          },
          "-=0.5",
        );

      gsap.fromTo(
        ".car-features .car-section-heading",
        {
          autoAlpha: 0,
          y: 24,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: ".car-features .car-section-heading",
            start: "top 88%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".car-feature",
        {
          autoAlpha: 0,
          y: 22,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: ".car-features-grid",
            start: "top 88%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".car-reservation .car-section-heading",
        {
          autoAlpha: 0,
          y: 20,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: ".car-reservation .car-section-heading",
            start: "top 88%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".car-form-group",
        {
          autoAlpha: 0,
          y: 14,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: "power2.out",
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: ".car-reservation-form",
            start: "top 85%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".car-reservation-form > button",
        {
          autoAlpha: 0,
          y: 12,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: ".car-reservation-form",
            start: "top 85%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".car-cta > *",
        {
          autoAlpha: 0,
          y: 18,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: ".car-cta",
            start: "top 88%",
            once: true,
          },
        },
      );

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, page);

    return () => {
      ctx.revert();
    };
  }, [isLoading, car]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!car) {
    return (
      <>
        <Header />

        <main className="car-details">
          <h1>Vehicle Not Found</h1>
          <p>The vehicle you are looking for does not exist.</p>
          <Link to="/fleet">Back to Fleet</Link>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="car-details" ref={pageRef}>
        <section className="car-hero">
          <div className="car-gallery">
            <div className="car-gallery-main">
              <img src={selectedImage || car.image} alt={car.name} />
            </div>

            <div className="car-gallery-thumbnails">
              {car.images.slice(0, 3).map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  aria-label={`View vehicle image ${index + 1}`}
                  aria-pressed={selectedImage === image}
                  onClick={() => changeImage(image)}
                >
                  <img src={image} alt={`${car.name} view ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="car-information">
            <div className="car-info-top">
              <span className="car-category">
                <span className="category-dot"></span>
                {car.category}
              </span>

              <span className="car-availability">
                <CheckCircle2 size={15} />
                Available for booking
              </span>
            </div>

            <h1 className="car-info-title">{car.name}</h1>

            <p className="car-description">
              Experience refined comfort, exceptional performance, and
              effortless luxury on every journey through Marrakech.
            </p>

            <div className="car-price-card">
              <div className="price-card-left">
                <span className="price-label">Your journey starts at</span>

                <div className="price-value">
                  <h2>{car.pricePerDay.toLocaleString("en-US")}</h2>
                  <span className="price-currency">MAD</span>
                </div>

                <span className="price-period">Per day · Taxes included</span>
              </div>

              <div className="price-card-icon">
                <Gauge size={27} strokeWidth={1.5} />
              </div>
            </div>

            <div className="car-specifications">
              <div className="car-specification">
                <div className="specification-icon">
                  <Settings2 size={19} />
                </div>
                <div className="specification-content">
                  <span>Transmission</span>
                  <strong>{car.transmission}</strong>
                </div>
              </div>

              <div className="car-specification">
                <div className="specification-icon">
                  <Users size={19} />
                </div>
                <div className="specification-content">
                  <span>Passengers</span>
                  <strong>{car.seats} Seats</strong>
                </div>
              </div>

              <div className="car-specification">
                <div className="specification-icon">
                  <Luggage size={19} />
                </div>
                <div className="specification-content">
                  <span>Luggage</span>
                  <strong>{car.luggage}</strong>
                </div>
              </div>

              <div className="car-specification">
                <div className="specification-icon">
                  <Fuel size={19} />
                </div>
                <div className="specification-content">
                  <span>Fuel type</span>
                  <strong>{car.fuel}</strong>
                </div>
              </div>

              <div className="car-specification">
                <div className="specification-icon">
                  <Gauge size={19} />
                </div>
                <div className="specification-content">
                  <span>Speed</span>
                  <strong>{car.speed} /KM</strong>
                </div>
              </div>
            </div>

            <div className="car-booking-note">
              <ShieldCheck size={19} />
              <p>Premium service and personalized assistance in Marrakech.</p>
            </div>

            <div className="car-actions">
              <a href="#reservation" className="car-reserve-button">
                Reserve This Vehicle
                <ArrowRight size={18} />
              </a>

              <a
                href="https://wa.me/"
                className="car-contact-button"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={18} />
                Contact Us
              </a>
            </div>

            <p className="car-booking-caption">
              <ShieldCheck size={14} />
              Secure booking · Personalized service
            </p>
          </div>
        </section>

        <section className="car-features">
          <div className="car-section-heading">
            <div className="features-heading-label">
              <span className="features-heading-line"></span>
              <span>THE DETAILS</span>
            </div>

            <div className="features-heading-content">
              <div>
                <h2>Designed for Every Journey</h2>
                <p>
                  Discover the details that make your driving experience
                  exceptional.
                </p>
              </div>

              <div className="features-heading-icon">
                <Sparkles size={22} />
              </div>
            </div>
          </div>

          <div className="car-features-grid">
            {car.features.slice(0, 4).map((feature, index) => {
              const featureIcons = [
                <Gauge size={23} strokeWidth={1.7} />,
                <ShieldCheck size={23} strokeWidth={1.7} />,
                <Sparkles size={23} strokeWidth={1.7} />,
                <Star size={23} strokeWidth={1.7} />,
              ];

              return (
                <article className="car-feature" key={`${feature}-${index}`}>
                  <div className="car-feature-top">
                    <span className="car-feature-icon">
                      {featureIcons[index]}
                    </span>

                    <span className="car-feature-number">0{index + 1}</span>
                  </div>

                  <div className="car-feature-content">
                    <h3>{feature}</h3>
                    <span className="car-feature-indicator">
                      <span></span>
                      Included with your vehicle
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="car-reservation" id="reservation">
          <div className="car-section-heading">
            <span>/ Reservation</span>
            <h2>Plan Your Journey</h2>
            <p>
              Tell us about yourself and your travel plans to request your VELOX
              experience.
            </p>
          </div>

          <form className="car-reservation-form" onSubmit={AddBookingCar}>
            <div className="car-form-group">
              <label htmlFor="client-name">Full Name</label>
              <input
                id="client-name"
                name="clientName"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                required
              />
            </div>

            <div className="car-form-group">
              <label htmlFor="client-email">Email Address</label>
              <input
                id="client-email"
                name="clientEmail"
                type="email"
                autoComplete="email"
                placeholder="Enter your email address"
                value={clientEmail}
                onChange={(event) => setClientEmail(event.target.value)}
                required
              />
            </div>

            <div className="car-form-group">
              <label htmlFor="client-phone">Phone Number</label>
              <input
                id="client-phone"
                name="clientPhone"
                type="tel"
                autoComplete="tel"
                placeholder="+212 600 000 000"
                value={clientPhone}
                onChange={(event) => setClientPhone(event.target.value)}
                required
              />
            </div>

            <div className="car-form-group">
              <label htmlFor="pickup-date">Pickup Date</label>
              <input
                id="pickup-date"
                name="startDate"
                type="date"
                min={today}
                value={startDate}
                onChange={(event) => {
                  setStartDate(event.target.value);

                  if (
                    endDate &&
                    event.target.value &&
                    endDate <= event.target.value
                  ) {
                    setEndDate("");
                  }
                }}
                required
              />
            </div>

            <div className="car-form-group">
              <label htmlFor="return-date">Return Date</label>
              <input
                id="return-date"
                name="endDate"
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                required
              />
            </div>

            <div className="car-form-group">
              <label htmlFor="pickup-location">Pickup Location</label>
              <input
                id="pickup-location"
                name="pickupLocation"
                type="text"
                autoComplete="street-address"
                placeholder="e.g. Marrakech Menara Airport"
                value={pickupLocation}
                onChange={(event) => setPickupLocation(event.target.value)}
                required
              />
            </div>

            <div className="car-form-group">
              <label htmlFor="return-location">Return Location</label>
              <input
                id="return-location"
                name="returnLocation"
                type="text"
                placeholder="Enter return location"
                value={returnLocation}
                onChange={(event) => setReturnLocation(event.target.value)}
                required
              />
            </div>

            <div className="car-form-group reservation-car-summary">
              <label>Selected Vehicle</label>
              <p>{car.name}</p>
              <span>{car.pricePerDay.toLocaleString("en-US")} MAD / day</span>
            </div>

            {startDate && endDate && endDate > startDate && (
              <div className="car-form-group reservation-total">
                <label>Estimated Total</label>
                <p>
                  {(
                    Math.ceil(
                      (new Date(`${endDate}T00:00:00`).getTime() -
                        new Date(`${startDate}T00:00:00`).getTime()) /
                        (1000 * 60 * 60 * 24),
                    ) * car.pricePerDay
                  ).toLocaleString("en-US")}{" "}
                  MAD
                </p>
              </div>
            )}

            {reservationMessage && (
              <div
                className={`reservation-message ${
                  reservationError
                    ? "reservation-message-error"
                    : "reservation-message-success"
                }`}
                role={reservationError ? "alert" : "status"}
                aria-live="polite"
              >
                {reservationError ? (
                  <XCircle size={20} aria-hidden="true" />
                ) : (
                  <CheckCircle2 size={20} aria-hidden="true" />
                )}

                <p>{reservationMessage}</p>
              </div>
            )}

            <button type="submit">Request Reservation</button>
          </form>
        </section>

        <section className="car-cta">
          <span>VELOX Marrakech</span>
          <h2>Your Journey Begins Here.</h2>
          <p>Discover a new standard of luxury mobility.</p>
          <Link to="/fleet">Explore the Fleet</Link>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default CarDetailsPage;
