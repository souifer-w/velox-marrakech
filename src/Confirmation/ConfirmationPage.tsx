import {
  CalendarDays,
  CarFront,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  Gauge,
  KeyRound,
  MapPin,
  PlaneLanding,
  PlaneTakeoff,
  ShieldCheck,
  Zap,
  Mail,
  Headset,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import type { Reservation } from "../data/cars";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LoadingScreen } from "../components/LoadingScreen";
import { useEffect, useState } from "react";
import "./Confirmation.css";

type ReservationPageProps = {
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
};

export function ConfirmedPage({ reservations }: ReservationPageProps) {
  const [isLoading, setIsLoading] = useState(true);

  const lastReservation = reservations[reservations.length - 1];
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

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Header />

      <main className="confirmed-page">
        <div className="confirmed-container">
          <div className="confirmed-glow confirmed-glow-top" />
          <div className="confirmed-glow confirmed-glow-right" />

          <div className="confirmed-content">
            <section className="confirmation-header">
              <div className="confirmation-seal">
                <div className="seal-circle">
                  <div className="seal-icon-box">
                    <Check size={34} strokeWidth={1.5} />
                  </div>
                </div>

                <span className="seal-status">
                  <CheckCircle2 size={14} />
                  VERIFIED
                </span>
              </div>

              <div className="confirmation-eyebrow">
                <span className="status-dot" />
                RESERVATION CONFIRMED · VELOX MARRAKECH
              </div>

              <h1 className="confirmation-title">
                Your reservation request is confirmed.
              </h1>

              <p className="confirmation-description">
                Your reservation details are ready. Review your vehicle,
                collection details, and booking reference below.
              </p>
            </section>

            {/* Booking reference */}
            <section className="booking-reference">
              <div className="reference-details"></div>

              <div className="reference-badges">
                <span className="confirmed-badge">
                  <CheckCircle2 size={15} />
                  CONFIRMED
                </span>

                <span className="terminal-badge">VELOX MARRAKECH</span>
              </div>
            </section>

            {/* Reservation details: display only the last reservation */}
            <section className="booking-dossier">
              <div className="booking-section-heading">
                <div>
                  <span className="booking-section-eyebrow">
                    YOUR RESERVATION
                  </span>
                  <h2>Reservation Details</h2>
                </div>

                <div className="reservations-section-icon">
                  <CalendarDays size={21} />
                </div>
              </div>

              {lastReservation ? (
                <article className="reservation-card">
                  <div className="reservation-card-image">
                    <img
                      src={lastReservation.car.image}
                      alt={lastReservation.car.name}
                    />

                    <div className="reservation-image-overlay">
                      <span>VEHICLE RESERVATION</span>
                      <div className="reservation-image-line" />
                      <p>VELOX MARRAKECH</p>
                    </div>

                    <span className="reservation-image-status">
                      <span className="status-dot" />
                      RESERVATION CONFIRMED
                    </span>
                  </div>

                  <div className="reservation-card-body">
                    <div className="reservation-card-header">
                      <div className="reservation-client-heading">
                        <span className="reservation-label">
                          BOOKING DOSSIER
                        </span>

                        <h2>{lastReservation.car.name}</h2>

                        <p className="reservation-client-subtitle">
                          {lastReservation.car.brand}
                        </p>
                      </div>
                      <div className="reservation-car-title">
                        <div className="reservation-car-icon">
                          <CalendarDays size={17} />
                        </div>

                        <div>
                          <h3>
                            {calculateRentalDays(
                              lastReservation.startDate,
                              lastReservation.endDate,
                            )}{" "}
                            {calculateRentalDays(
                              lastReservation.startDate,
                              lastReservation.endDate,
                            ) === 1
                              ? "Day"
                              : "Days"}
                          </h3>
                        </div>
                      </div>{" "}
                      <div className="reservation-car-title">
                        <div className="reservation-car-icon">
                          <CarFront size={22} />
                        </div>

                        <div>
                          <h3>{lastReservation.car.name}</h3>
                          <p>{lastReservation.car.transmission}</p>
                        </div>
                      </div>
                    </div>
                    <div className="reservation-card-divider" />
                    <div className="reservation-client-details">
                      <div className="reservation-info-item">
                        <div className="reservation-info-icon">
                          <Zap size={17} />
                        </div>

                        <div>
                          <span>Vehicle category</span>
                          <p>
                            {lastReservation.car.category ?? "Luxury Vehicle"}
                          </p>
                        </div>
                      </div>
                      <div className="reservation-info-item">
                        <div className="reservation-info-icon">
                          <Gauge size={17} />
                        </div>

                        <div>
                          <span>speed</span>
                          <p>{lastReservation.car.speed}</p>
                        </div>
                      </div>
                      <div className="reservation-info-item">
                        <div className="reservation-info-icon">
                          <Gauge size={17} />
                        </div>

                        <div>
                          <span>Transmission</span>
                          <p>{lastReservation.car.transmission}</p>
                        </div>
                      </div>

                      <div className="reservation-info-item">
                        <div className="reservation-info-icon">
                          <CalendarDays size={17} />
                        </div>

                        <div>
                          <span>Pickup date</span>
                          <p>{lastReservation.startDate}</p>
                        </div>
                      </div>

                      <div className="reservation-info-item">
                        <div className="reservation-info-icon">
                          <CalendarDays size={17} />
                        </div>

                        <div>
                          <span>Return date</span>
                          <p>{lastReservation.endDate}</p>
                        </div>
                      </div>

                      <div className="reservation-info-item">
                        <div className="reservation-info-icon">
                          <MapPin size={17} />
                        </div>

                        <div>
                          <span>Pickup location</span>
                          <p>{lastReservation.pickupLocation}</p>
                        </div>
                      </div>

                      <div className="reservation-info-item">
                        <div className="reservation-info-icon">
                          <Clock3 size={17} />
                        </div>

                        <div>
                          <span>Return location</span>
                          <p>{lastReservation.returnLocation}</p>
                        </div>
                      </div>
                    </div>

                    <div className="reservation-card-divider" />

                    <div className="reservation-client-details">
                      <div className="reservation-info-item">
                        <div className="reservation-info-icon">
                          <ShieldCheck size={17} />
                        </div>

                        <div>
                          <span>Client name</span>
                          <p>{lastReservation.clientName}</p>
                        </div>
                      </div>

                      <div className="reservation-info-item">
                        <div className="reservation-info-icon">
                          <Mail size={17} />
                        </div>

                        <div>
                          <span>Email address</span>
                          <p>{lastReservation.clientEmail}</p>
                        </div>
                      </div>

                      <div className="reservation-info-item">
                        <div className="reservation-info-icon">
                          <Headset size={17} />
                        </div>

                        <div>
                          <span>Phone number</span>
                          <p>{lastReservation.clientPhone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="reservation-card-footer">
                      <div className="reservation-client-label">
                        <div className="reservation-footer-user-icon">
                          <ShieldCheck size={18} />
                        </div>
                      </div>

                      <div className="reservation-price">
                        <span>Total reservation price</span>
                        <strong>
                          {lastReservation.totalPrice.toLocaleString("en-US")}{" "}
                          MAD
                        </strong>
                      </div>
                    </div>
                    <div className="reservation-card-divider" />
                    <button
                      className="action-secondary"
                      type="button"
                      onClick={() => handleDownloadReservation(lastReservation)}
                    >
                      <Download size={18} />
                      <span>Download</span>
                    </button>
                  </div>
                </article>
              ) : (
                <div className="no-reservation">
                  <div className="reservations-section-icon">
                    <CalendarDays size={24} />
                  </div>

                  <h3>No reservation found</h3>

                  <p>
                    You have no reservations to display. Browse our fleet and
                    book a vehicle to see your reservation details here.
                  </p>

                  <Link className="action-primary" to="/fleet">
                    <span>Explore Our Fleet</span>
                    <ArrowRight size={18} />
                  </Link>
                </div>
              )}
            </section>

            {/* Pickup and return itinerary */}
            {lastReservation && (
              <section className="itinerary-section">
                <div className="booking-section-heading">
                  <div>
                    <span className="booking-section-eyebrow">
                      YOUR SCHEDULE
                    </span>
                    <h2>Pickup &amp; Return</h2>
                  </div>

                  <div className="reservations-section-icon">
                    <MapPin size={21} />
                  </div>
                </div>

                <div className="itinerary-grid">
                  <article className="itinerary-card">
                    <div className="itinerary-icon-box">
                      <PlaneLanding size={21} />
                    </div>

                    <div className="itinerary-heading">
                      <span>Pickup location</span>
                    </div>

                    <h3>{lastReservation.pickupLocation}</h3>
                    <p>Marrakech, Morocco</p>

                    <div className="itinerary-date">
                      <CalendarDays size={16} />
                      <div>
                        <strong>{lastReservation.startDate}</strong>
                      </div>
                    </div>
                  </article>

                  <article className="itinerary-card">
                    <div className="itinerary-icon-box">
                      <PlaneTakeoff size={21} />
                    </div>

                    <div className="itinerary-heading">
                      <span>Return location</span>
                    </div>

                    <h3>{lastReservation.returnLocation}</h3>
                    <p>Marrakech, Morocco</p>

                    <div className="itinerary-date">
                      <CalendarDays size={16} />
                      <div>
                        <strong>{lastReservation.endDate}</strong>
                      </div>
                    </div>
                  </article>
                </div>
              </section>
            )}

            <section className="coverage-banner">
              <div className="coverage-icon-box">
                <ShieldCheck size={25} />
              </div>

              <div className="coverage-information">
                <div className="coverage-heading">
                  <h3>VELOX Protection</h3>
                </div>

                <p>
                  Review your rental coverage, vehicle handover conditions, and
                  assistance options with the VELOX concierge.
                </p>
              </div>
            </section>

            <section className="delivery-milestones">
              <div className="milestones-heading">
                <span>YOUR NEXT STEPS</span>
                <h3>Reservation Timeline</h3>
              </div>

              <div className="milestones-grid">
                <article className="milestone-card">
                  <div className="milestone-top">
                    <span>01 / CONFIRMATION</span>

                    <div className="milestone-icon-box">
                      <CheckCircle2 size={20} />
                    </div>
                  </div>

                  <h4>Booking Received</h4>

                  <p>
                    Your reservation reference has been generated. Keep it
                    available for future booking enquiries.
                  </p>

                  <span className="milestone-status">CONFIRMED</span>
                </article>

                <article className="milestone-card">
                  <div className="milestone-top">
                    <span>02 / PREPARATION</span>

                    <div className="milestone-icon-box">
                      <CarFront size={20} />
                    </div>
                  </div>

                  <h4>Vehicle Preparation</h4>

                  <p>
                    Vehicle preparation and collection arrangements can be
                    coordinated with the VELOX team.
                  </p>

                  <span className="milestone-status">NEXT STEP</span>
                </article>

                <article className="milestone-card">
                  <div className="milestone-top">
                    <span>03 / COLLECTION</span>

                    <div className="milestone-icon-box">
                      <KeyRound size={20} />
                    </div>
                  </div>

                  <h4>Vehicle Handover</h4>

                  <p>
                    Present your booking reference and coordinate the vehicle
                    handover with the rental team.
                  </p>

                  <span className="milestone-status">UPCOMING</span>
                </article>
              </div>
            </section>

            <div className="confirmation-actions">
              <Link className="action-primary" to="/yourReservetions">
                <span>View My Bookings</span>
                <ArrowRight size={18} />
              </Link>

              <Link className="action-tertiary" to="/">
                Fleet Home
              </Link>
            </div>

            <div className="concierge-hotline">
              <div className="concierge-icon-box">
                <Headset size={20} />
              </div>

              <div className="concierge-copy">
                <span>Need assistance with your reservation?</span>
                <Link to="tel:+212524001122">+212 524 00 11 22</Link>
              </div>

              <Link
                className="concierge-contact-icon"
                to="mailto:contact@velox.ma"
                aria-label="Email VELOX concierge"
              >
                <Mail size={18} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
