import React from "react";

function loading() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      style={{
        shapeRendering: "auto",
        display: "block",
        background: "transparent",
        maxWidth: "100%",
      }}
      width="200"
      height="200"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g>
        <g transform="translate(0 -7.5)">
          <circle fill="var(--text-color)" r="10" cy="41" cx="50">
            <animateTransform
              values="0 50 50;360 50 50"
              keyTimes="0;1"
              repeatCount="indefinite"
              dur="1s"
              type="rotate"
              attributeName="transform"
            ></animateTransform>
            <animate
              keySplines="0.2 0 0.8 1;0.2 0 0.8 1"
              values="0;15;0"
              keyTimes="0;0.5;1"
              calcMode="spline"
              repeatCount="indefinite"
              dur="1s"
              attributeName="r"
            ></animate>
          </circle>
          <circle fill="var(--text-secondary-color)" r="10" cy="41" cx="50">
            <animateTransform
              values="180 50 50;540 50 50"
              keyTimes="0;1"
              repeatCount="indefinite"
              dur="1s"
              type="rotate"
              attributeName="transform"
            ></animateTransform>
            <animate
              keySplines="0.2 0 0.8 1;0.2 0 0.8 1"
              values="15;0;15"
              keyTimes="0;0.5;1"
              calcMode="spline"
              repeatCount="indefinite"
              dur="1s"
              attributeName="r"
            ></animate>
          </circle>
        </g>
        <g></g>
      </g>
    </svg>
  );
}

export default loading;
