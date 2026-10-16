import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Home/HomePage";
import FleetCollections from "./FleetCollections/Collections";
import { ConfirmedPage } from "./Confirmation/ConfirmationPage";
import CarDetailsPage from "./CarDetails/CarDetailsPage";
import { ReservationsClientsPage } from "./Reservation/ReservationsClientsPage";
import "./App.css";

import { useState, useEffect } from "react";
import type { Car, Reservation } from "./data/cars";
import { cars as initialCars } from "./data/cars";
import { ScrollToTop } from "./components/scrollToTop";
function App() {
  const [cars, setCars] = useState<Car[]>(() => {
    const savedCars = localStorage.getItem("cars");
    return savedCars ? (JSON.parse(savedCars) as Car[]) : initialCars;
  });
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const savedReservations = localStorage.getItem("reservations");
    return savedReservations
      ? (JSON.parse(savedReservations) as Reservation[])
      : [];
  });
  useEffect(() => {
    localStorage.setItem("cars", JSON.stringify(cars));
    localStorage.setItem("reservations", JSON.stringify(reservations));
  }, [cars, reservations]);
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/cardetails/:id"
          element={
            <CarDetailsPage
              cars={cars}
              reservations={reservations}
              setReservations={setReservations}
            />
          }
        />
        <Route
          path="/confirmation"
          element={
            <ConfirmedPage
              reservations={reservations}
              setReservations={setReservations}
            />
          }
        />
        <Route path="/" element={<HomePage cars={cars} setCars={setCars} />} />
        <Route path="/fleet" element={<FleetCollections cars={cars} />} />
        <Route
          path="/yourReservetions"
          element={<ReservationsClientsPage reservations={reservations} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
