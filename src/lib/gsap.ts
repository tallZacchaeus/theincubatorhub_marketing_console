import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

// Register GSAP plugins once. Imported for side effects from main.tsx.
gsap.registerPlugin(useGSAP, Flip);

export { gsap, Flip, useGSAP };
