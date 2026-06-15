import { cn } from "../../lib/cn";

/* Iconos geométricos planos con un toque kawaii (ojitos + naricita).
   Usan currentColor, así que heredan el color del contenedor. */

function Dog(props) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="7" y="13" width="10" height="21" rx="5" fill="currentColor" opacity="0.5" />
      <rect x="31" y="13" width="10" height="21" rx="5" fill="currentColor" opacity="0.5" />
      <rect x="11" y="9" width="26" height="28" rx="12" fill="currentColor" />
      <circle cx="19" cy="22" r="2.3" fill="#fff" />
      <circle cx="29" cy="22" r="2.3" fill="#fff" />
      <ellipse cx="24" cy="28.5" rx="2.6" ry="2.1" fill="#fff" />
    </svg>
  );
}

function Cat(props) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M13 9l6 11H9z" fill="currentColor" />
      <path d="M35 9l4 11H29z" fill="currentColor" />
      <rect x="10" y="15" width="28" height="24" rx="12" fill="currentColor" />
      <circle cx="19" cy="26" r="2.3" fill="#fff" />
      <circle cx="29" cy="26" r="2.3" fill="#fff" />
      <path d="M22 31h4l-2 2.6z" fill="#fff" />
    </svg>
  );
}

function Turtle(props) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="38" cy="27" r="5.5" fill="currentColor" />
      <circle cx="40" cy="25.5" r="1.5" fill="#fff" />
      <rect x="8" y="33" width="5" height="7" rx="2.5" fill="currentColor" opacity="0.6" />
      <rect x="26" y="33" width="5" height="7" rx="2.5" fill="currentColor" opacity="0.6" />
      <path d="M7 30a13 9 0 0 1 26 0z" fill="currentColor" />
      <path
        d="M20 21v9M13.5 24l1.5 6M26.5 24l-1.5 6"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

function Critter(props) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="10" y="12" width="28" height="26" rx="13" fill="currentColor" />
      <circle cx="19" cy="24" r="2.3" fill="#fff" />
      <circle cx="29" cy="24" r="2.3" fill="#fff" />
      <path d="M21 29q3 2.5 6 0" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

const MAP = { dog: Dog, cat: Cat, turtle: Turtle, reptile: Turtle };

export function SpeciesIcon({ species, className, ...props }) {
  const Cmp = MAP[species] || Critter;
  return <Cmp className={cn("h-6 w-6", className)} {...props} />;
}
