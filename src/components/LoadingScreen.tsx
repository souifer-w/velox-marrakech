import { CarFront } from "lucide-react";
import "./LoadingScreen.css";

export function LoadingScreen() {
  return (
    <div className="velox-loader" role="status" aria-label="Loading">
      <div className="velox-loader-content">
        <div className="velox-loader-logo">
          <div className="velox-loader-car">
            <CarFront size={42} strokeWidth={1.6} aria-hidden="true" />
          </div>

          <span className="velox-loader-brand">VELOX</span>
          <span className="velox-loader-location">M A R R A K E C H</span>
        </div>

        <div className="velox-loader-animation" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
