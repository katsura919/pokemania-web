// components/ui/lottie-spinner.tsx
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import spinnerAnimation from "@/animations/spinner.json";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

interface LottieSpinnerProps {
  className?: string;
  size?: number; // Size in pixels
  speed?: number; // Animation speed multiplier
}

export function LottieSpinner({
  className,
  size = 48,
  speed = 1,
}: LottieSpinnerProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(speed);
    }
  }, [speed]);

  return (
    <div
      className={cn("inline-flex", className)}
      style={{ width: size, height: size }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={spinnerAnimation}
        loop={true}
        style={{ width: size, height: size }}
      />
    </div>
  );
}