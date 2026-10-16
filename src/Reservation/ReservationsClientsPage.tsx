import {
  CalendarDays,
  CarFront,
  Download,
  Mail,
  MapPin,
  ArrowRight,
  Phone,
} from "lucide-react";
import { useRef, useState, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jsPDF from "jspdf";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import type { Reservation } from "../data/cars";
import "./ReservationsClientsPage.css";
import { Link } from "react-router-dom";
import { LoadingScreen } from "../components/LoadingScreen";

gsap.registerPlugin(ScrollTrigger);

type ReservationsClientProps = {
  reservations: Reservation[];
};

export function ReservationsClientsPage({
  reservations,
}: ReservationsClientProps) {
  const [isLoading, setIsLoading] = useState(true);
  const pageRef = useRef<HTMLElement | null>(null);

  const handleDownloadReservation = (reservation: Reservation) => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();

    const blue: [number, number, number] = [36, 87, 230];
    const blueLight: [number, number, number] = [71, 118, 255];
    const black: [number, number, number] = [17, 19, 24];
    const white: [number, number, number] = [255, 255, 255];
    const muted: [number, number, number] = [115, 121, 135];
    const border: [number, number, number] = [230, 232, 237];
    const blueSoft: [number, number, number] = [238, 243, 255];

    const drawIcon = (type: string, x: number, y: number) => {
      pdf.setDrawColor(...blue);
      pdf.setLineWidth(0.5);

      switch (type) {
        case "user":
          pdf.circle(x + 3, y + 2, 1.5, "S");
          pdf.line(x + 0.5, y + 7, x + 5.5, y + 7);
          pdf.line(x + 0.5, y + 7, x + 1.2, y + 5);
          pdf.line(x + 5.5, y + 7, x + 4.8, y + 5);
          break;

        case "car":
          pdf.roundedRect(x, y + 3, 8, 3.5, 0.8, 0.8, "S");
          pdf.line(x + 1, y + 3, x + 2.5, y);
          pdf.line(x + 2.5, y, x + 6, y);
          pdf.line(x + 6, y, x + 7.5, y + 3);
          pdf.circle(x + 2, y + 6.5, 0.7, "S");
          pdf.circle(x + 6, y + 6.5, 0.7, "S");
          break;

        case "calendar":
          pdf.roundedRect(x, y + 1, 7, 6.5, 0.5, 0.5, "S");
          pdf.line(x, y + 3, x + 7, y + 3);
          pdf.line(x + 2, y, x + 2, y + 2);
          pdf.line(x + 5, y, x + 5, y + 2);
          pdf.line(x + 2, y + 4.5, x + 3, y + 4.5);
          pdf.line(x + 4.5, y + 4.5, x + 5.5, y + 4.5);
          break;

        case "location":
          pdf.circle(x + 3.5, y + 3, 2.5, "S");
          pdf.circle(x + 3.5, y + 3, 0.7, "S");
          pdf.line(x + 1.5, y + 5, x + 3.5, y + 8);
          pdf.line(x + 5.5, y + 5, x + 3.5, y + 8);
          break;

        case "mail":
          pdf.roundedRect(x, y + 1, 8, 5.5, 0.5, 0.5, "S");
          pdf.line(x, y + 1, x + 4, y + 4);
          pdf.line(x + 8, y + 1, x + 4, y + 4);
          break;

        case "phone":
          pdf.roundedRect(x + 1, y, 5, 8, 0.8, 0.8, "S");
          pdf.line(x + 2.5, y + 6.5, x + 4.5, y + 6.5);
          break;

        case "price":
          pdf.circle(x + 3.5, y + 3.5, 3, "S");
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(8);
          pdf.setTextColor(...blue);
          pdf.text("D", x + 1.6, y + 5);
          break;
      }
    };

    const drawSection = (title: string, y: number) => {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(...black);
      pdf.text(title.toUpperCase(), 18, y);

      pdf.setDrawColor(...border);
      pdf.setLineWidth(0.3);
      pdf.line(18, y + 3, pageWidth - 18, y + 3);
    };

    const drawInfo = (
      icon: string,
      label: string,
      value: string | number,
      x: number,
      y: number,
      valueWidth = 75,
    ) => {
      drawIcon(icon, x, y - 4);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(...muted);
      pdf.text(label.toUpperCase(), x + 12, y);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(...black);

      const text = String(value || "Not provided");
      const lines = pdf.splitTextToSize(text, valueWidth);

      pdf.text(lines, x + 12, y + 6);
    };

    pdf.setFillColor(...black);
    pdf.rect(0, 0, pageWidth, 48, "F");

    pdf.setFillColor(...blue);
    pdf.rect(0, 0, 3, 48, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(23);
    pdf.setTextColor(...white);
    pdf.text("VELOX", 18, 20);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(...blueLight);
    pdf.text("M A R R A K E C H", 18, 27);

    pdf.setDrawColor(...blue);
    pdf.setLineWidth(0.6);
    pdf.line(18, 34, pageWidth - 18, 34);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(...white);
    pdf.text("VEHICLE RESERVATION", 18, 42);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(210, 215, 225);
    pdf.text("BOOKING DOCUMENT", pageWidth - 18, 42, {
      align: "right",
    });

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.setTextColor(...black);
    pdf.text("Reservation Details", 18, 62);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(...muted);
    pdf.text("Your booking information at a glance.", 18, 69);

    pdf.setFillColor(...blueSoft);
    pdf.roundedRect(pageWidth - 54, 55, 36, 10, 2, 2, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    pdf.setTextColor(...blue);
    pdf.text("RESERVATION", pageWidth - 36, 61, {
      align: "center",
    });

    drawSection("Client Information", 84);

    drawInfo("user", "Client name", reservation.clientName, 18, 96);
    drawInfo("mail", "Email address", reservation.clientEmail, 108, 96, 68);
    drawInfo("phone", "Phone number", reservation.clientPhone, 18, 117);

    drawSection("Vehicle Information", 141);

    drawInfo("car", "Vehicle", reservation.car.name, 18, 153, 75);

    drawInfo(
      "car",
      "Brand / Year",
      `${reservation.car.brand} / ${reservation.car.year}`,
      108,
      153,
      68,
    );

    drawSection("Booking Information", 176);

    drawInfo("calendar", "Pickup date", reservation.startDate, 18, 188);
    drawInfo("calendar", "Return date", reservation.endDate, 108, 188, 68);

    drawInfo(
      "location",
      "Pickup location",
      reservation.pickupLocation,
      18,
      210,
      155,
    );

    pdf.setFillColor(...blueSoft);
    pdf.roundedRect(18, 235, pageWidth - 36, 26, 2, 2, "F");

    pdf.setFillColor(...blue);
    pdf.roundedRect(18, 235, 2, 26, 1, 1, "F");

    drawIcon("price", 25, 244);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(...black);
    pdf.text("TOTAL RESERVATION PRICE", 38, 245);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(...muted);
    pdf.text("Total booking amount", 38, 251);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(17);
    pdf.setTextColor(...blue);
    pdf.text(`${reservation.totalPrice} MAD`, pageWidth - 24, 251, {
      align: "right",
    });

    pdf.setDrawColor(...border);
    pdf.setLineWidth(0.4);
    pdf.line(18, 273, pageWidth - 18, 273);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(...black);
    pdf.text("VELOX MARRAKECH", 18, 282);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(...muted);
    pdf.text("Thank you for choosing VELOX.", pageWidth - 18, 282, {
      align: "right",
    });

    pdf.setFontSize(7);
    pdf.setTextColor(...blue);
    pdf.text("LUXURY CAR RENTAL", 18, 287);

    const safeName = reservation.clientName
      .trim()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "");

    pdf.save(`VELOX-Reservation-${safeName || "Client"}.pdf`);
  };

  const calculateRentalDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const difference = end.getTime() - start.getTime();

    return Math.max(1, Math.ceil(difference / (1000 * 60 * 60 * 24)));
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => window.clearTimeout(timer);
  }, []);

  useLayoutEffect(() => {
    if (isLoading) return;

    const page = pageRef.current;

    if (!page) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const hero = page.querySelector(".reservations-hero");
      const heroVisual = page.querySelector(".reservations-hero-visual");
      const breadcrumb = page.querySelector(".reservations-breadcrumb");
      const heroLabel = page.querySelector(".reservations-hero-label");
      const heroTitle = page.querySelector(".reservations-hero-content h1");
      const heroDescription = page.querySelector(
        ".reservations-hero-description",
      );
      const heroBottom = page.querySelector(".reservations-hero-bottom");
      const sectionHeading = page.querySelector(
        ".reservations-section-heading",
      );
      const cards = gsap.utils.toArray<HTMLElement>(
        page.querySelectorAll(".reservation-card"),
      );

      const emptyCard = page.querySelector(".empty-reservations-card");

      if (emptyCard) {
        gsap.fromTo(
          emptyCard,
          {
            autoAlpha: 0,
            y: 28,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
          },
        );

        return;
      }

      if (hero) {
        gsap.fromTo(
          hero,
          {
            autoAlpha: 0,
          },
          {
            autoAlpha: 1,
            duration: 0.5,
            ease: "power1.out",
            clearProps: "opacity,visibility",
          },
        );
      }

      const heroTimeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      if (breadcrumb) {
        heroTimeline.fromTo(
          breadcrumb,
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
          0.05,
        );
      }

      if (heroLabel) {
        heroTimeline.fromTo(
          heroLabel,
          {
            autoAlpha: 0,
            y: 14,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            clearProps: "opacity,visibility,transform",
          },
          0.15,
        );
      }

      if (heroTitle) {
        heroTimeline.fromTo(
          heroTitle,
          {
            autoAlpha: 0,
            y: 22,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            clearProps: "opacity,visibility,transform",
          },
          0.22,
        );
      }

      if (heroDescription) {
        heroTimeline.fromTo(
          heroDescription,
          {
            autoAlpha: 0,
            y: 18,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            clearProps: "opacity,visibility,transform",
          },
          0.32,
        );
      }

      if (heroBottom) {
        heroTimeline.fromTo(
          heroBottom,
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
          0.42,
        );
      }

      if (heroVisual) {
        heroTimeline.fromTo(
          heroVisual,
          {
            autoAlpha: 0,
            x: 24,
          },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "opacity,visibility,transform",
          },
          0.2,
        );
      }

      if (sectionHeading) {
        gsap.fromTo(
          sectionHeading,
          {
            autoAlpha: 0,
            y: 22,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
            scrollTrigger: {
              trigger: sectionHeading,
              start: "top 88%",
              once: true,
            },
          },
        );
      }

      if (cards.length > 0) {
        cards.forEach((card) => {
          const image = card.querySelector(".reservation-card-image");
          const body = card.querySelector(".reservation-card-body");
          const cardHeader = card.querySelector(".reservation-card-header");
          const divider = card.querySelector(".reservation-card-divider");
          const details = card.querySelectorAll(".reservation-info-item");
          const footer = card.querySelector(".reservation-card-footer");

          const cardTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true,
            },
          });

          cardTimeline.fromTo(
            card,
            {
              autoAlpha: 0,
              y: 32,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.65,
              ease: "power3.out",
              clearProps: "opacity,visibility,transform",
            },
          );

          if (image) {
            cardTimeline.fromTo(
              image,
              {
                autoAlpha: 0,
                scale: 0.97,
              },
              {
                autoAlpha: 1,
                scale: 1,
                duration: 0.6,
                ease: "power2.out",
                clearProps: "opacity,visibility,transform",
              },
              0.08,
            );
          }

          if (body) {
            cardTimeline.fromTo(
              body,
              {
                autoAlpha: 0,
                y: 14,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.55,
                ease: "power2.out",
                clearProps: "opacity,visibility,transform",
              },
              0.12,
            );
          }

          if (cardHeader) {
            cardTimeline.fromTo(
              cardHeader,
              {
                autoAlpha: 0,
                y: 10,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.45,
                ease: "power2.out",
                clearProps: "opacity,visibility,transform",
              },
              0.18,
            );
          }

          if (divider) {
            cardTimeline.fromTo(
              divider,
              {
                scaleX: 0,
                transformOrigin: "left center",
              },
              {
                scaleX: 1,
                duration: 0.45,
                ease: "power2.out",
                clearProps: "transform",
              },
              0.22,
            );
          }

          if (details.length > 0) {
            cardTimeline.fromTo(
              details,
              {
                autoAlpha: 0,
                y: 10,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.06,
                ease: "power2.out",
                clearProps: "opacity,visibility,transform",
              },
              0.25,
            );
          }

          if (footer) {
            cardTimeline.fromTo(
              footer,
              {
                autoAlpha: 0,
                y: 10,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out",
                clearProps: "opacity,visibility,transform",
              },
              0.35,
            );
          }
        });
      }

      const emptyPageHeading = page.querySelector(
        ".empty-reservations-icon, .empty-reservations-eyebrow, .empty-reservations-card h1, .empty-reservations-description, .empty-reservations-actions, .empty-reservations-footer",
      );

      if (emptyPageHeading) {
        gsap.fromTo(
          emptyPageHeading,
          {
            autoAlpha: 0,
            y: 16,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
            scrollTrigger: {
              trigger: emptyPageHeading,
              start: "top 90%",
              once: true,
            },
          },
        );
      }
    }, page);

    const refreshFrame = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      ctx.revert();
    };
  }, [isLoading, reservations.length]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!reservations || reservations.length === 0) {
    return (
      <>
        <Header />

        <main className="empty-reservations-page" ref={pageRef}>
          <div className="empty-reservations-container">
            <div className="empty-reservations-card">
              <div className="empty-reservations-icon">
                <CalendarDays size={34} strokeWidth={1.5} />
                <span className="empty-reservations-icon-badge">
                  <CarFront size={17} strokeWidth={2} />
                </span>
              </div>

              <span className="empty-reservations-eyebrow">
                YOUR JOURNEY STARTS HERE
              </span>

              <h1>No reservations yet</h1>

              <p className="empty-reservations-description">
                You haven't booked a vehicle yet. Discover our collection of
                premium cars and find the perfect ride for your next journey in
                Marrakech.
              </p>

              <div className="empty-reservations-actions">
                <Link to="/fleet" className="empty-reservations-primary-button">
                  Explore Our Fleet
                  <ArrowRight size={18} />
                </Link>

                <Link to="/" className="empty-reservations-secondary-button">
                  Back to Home
                </Link>
              </div>

              <div className="empty-reservations-footer">
                <span className="empty-reservations-footer-dot" />
                Premium car rental in Marrakech
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="reservations-page" ref={pageRef}>
        <div className="reservations-container">
          <section className="reservations-hero">
            <div className="reservations-hero-glow" />
            <div className="reservations-hero-grid" />

            <div className="reservations-hero-content">
              <div className="reservations-breadcrumb">
                <span>VELOX</span>
                <span className="reservations-breadcrumb-separator">/</span>
                <span>Dashboard</span>
                <span className="reservations-breadcrumb-separator">/</span>
                <span className="reservations-breadcrumb-current">
                  Reservations
                </span>
              </div>

              <div className="reservations-hero-label">
                <span className="reservations-hero-label-dot" />
                VELOX MARRAKECH · CLIENT SERVICES
              </div>

              <h1>
                Reservations
                <span className="reservations-hero-title-accent">.</span>
              </h1>

              <p className="reservations-hero-description">
                Every journey starts with a reservation. Manage client
                information, vehicle details, and booking documents in one
                place.
              </p>

              <div className="reservations-hero-bottom">
                <div className="reservations-hero-line" />
                <span>YOUR FLEET. YOUR CLIENTS. YOUR SERVICE.</span>
              </div>
            </div>

            <div className="reservations-hero-visual">
              <div className="reservations-hero-orbit reservations-hero-orbit-one" />
              <div className="reservations-hero-orbit reservations-hero-orbit-two" />

              <div className="reservations-hero-icon">
                <CalendarDays size={34} strokeWidth={1.4} />
              </div>

              <div className="reservations-hero-floating-card">
                <div className="reservations-hero-floating-icon">
                  <CarFront size={20} />
                </div>

                <div className="reservations-hero-floating-copy">
                  <span>BOOKING MANAGEMENT</span>
                  <h3>Every detail, in one place.</h3>
                  <p>Clients · Vehicles · Documents</p>
                </div>
              </div>

              <div className="reservations-hero-decoration" />
            </div>
          </section>

          <section className="reservations-section">
            <div className="reservations-section-heading">
              <div>
                <span className="reservations-section-eyebrow">
                  CLIENT MANAGEMENT
                </span>
                <h2>YOUR reservations</h2>
                <p>
                  View booking information, contact details, and reservation
                  documents.
                </p>
              </div>

              <div className="reservations-section-icon">
                <CalendarDays size={21} />
              </div>
            </div>

            <div className="reservations-list">
              {reservations.map((reservation) => (
                <article
                  className="reservation-card"
                  key={`${reservation.clientEmail}-${reservation.car.id}-${reservation.startDate}-${reservation.endDate}`}
                >
                  <div className="reservation-card-image">
                    <img
                      src={reservation.car.image}
                      alt={reservation.car.name}
                    />

                    <div className="reservation-image-overlay">
                      <span>VEHICLE RESERVATION</span>
                      <div className="reservation-image-line" />
                      <p>VELOX MARRAKECH</p>
                    </div>
                  </div>

                  <div className="reservation-card-body">
                    <div className="reservation-card-header">
                      <div className="reservation-client-heading">
                        <span className="reservation-label">
                          CLIENT RESERVATION
                        </span>
                        <h2>{reservation.clientName}</h2>
                        <p className="reservation-client-subtitle">
                          Personal booking information
                        </p>
                      </div>

                      <div className="reservation-car-title">
                        <div className="reservation-car-icon">
                          <CarFront size={22} />
                        </div>

                        <div>
                          <h3>{reservation.car.name}</h3>
                          <p>
                            {reservation.car.brand} · {reservation.car.year}
                          </p>
                        </div>
                      </div>

                      <div className="reservation-car-title">
                        <div className="reservation-car-icon">
                          <CalendarDays size={17} />
                        </div>

                        <div>
                          <h3>
                            {calculateRentalDays(
                              reservation.startDate,
                              reservation.endDate,
                            )}{" "}
                            {calculateRentalDays(
                              reservation.startDate,
                              reservation.endDate,
                            ) === 1
                              ? "Day"
                              : "Days"}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="reservation-card-divider" />

                    <div className="reservation-client-details">
                      <div className="reservation-info-item">
                        <div className="reservation-info-icon">
                          <Mail size={17} />
                        </div>

                        <div>
                          <span>Email address</span>
                          <p>{reservation.clientEmail}</p>
                        </div>
                      </div>

                      <div className="reservation-info-item">
                        <div className="reservation-info-icon">
                          <Phone size={17} />
                        </div>

                        <div>
                          <span>Phone number</span>
                          <p>{reservation.clientPhone}</p>
                        </div>
                      </div>

                      <div className="reservation-info-item">
                        <div className="reservation-info-icon">
                          <CalendarDays size={17} />
                        </div>

                        <div>
                          <span>Pickup date</span>
                          <p>{reservation.startDate}</p>
                        </div>
                      </div>

                      <div className="reservation-info-item">
                        <div className="reservation-info-icon">
                          <CalendarDays size={17} />
                        </div>

                        <div>
                          <span>Return date</span>
                          <p>{reservation.endDate}</p>
                        </div>
                      </div>

                      <div className="reservation-info-item">
                        <div className="reservation-info-icon">
                          <MapPin size={17} />
                        </div>

                        <div>
                          <span>Pickup location</span>
                          <p>{reservation.pickupLocation}</p>
                        </div>
                      </div>

                      <div className="reservation-info-item">
                        <div className="reservation-info-icon">
                          <CarFront size={17} />
                        </div>

                        <div>
                          <span>Total price</span>
                          <p>{reservation.totalPrice} MAD</p>
                        </div>
                      </div>
                    </div>

                    <div className="reservation-card-footer">
                      <div className="reservation-client-label" />

                      <div className="reservation-actions">
                        <button
                          type="button"
                          onClick={() => handleDownloadReservation(reservation)}
                          className="reservation-button reservation-button-download"
                        >
                          <Download size={17} />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
