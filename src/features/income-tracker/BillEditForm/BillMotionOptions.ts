import { AnimationProps } from "framer-motion"

export const billEditMotionOptions: AnimationProps = {
  initial: { opacity: 0, scale: 0.95, y: 96 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.3,
      duration: 0.3,
      easings: [0.77, 0, 0.175, 1],
    },
    y: 0,
  },
  exit: {
    filter: "blur(10px)",
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
      easings: [0.77, 0, 0.175, 1],
    },
  },
}
