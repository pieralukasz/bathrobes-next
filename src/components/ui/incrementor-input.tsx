import * as React from "react";
import { cn } from "~/lib/utils";
import { PlusCircle, MinusCircle } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  symbol?: string;
}

const IncrementorInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ symbol, className, ...props }, ref) => {
    const [hitMax, setHitMax] = React.useState(false);
    const [hitMin, setHitMin] = React.useState(false);
    const incrementInput = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => incrementInput.current!, []);

    const increment = () => {
      incrementInput.current?.stepUp();
      incrementInput.current?.dispatchEvent(
        new Event("change", { bubbles: true }),
      );
      setHitMax(incrementInput.current?.value === incrementInput.current?.max);
      setHitMin(incrementInput.current?.value === incrementInput.current?.min);
    };

    const decrement = () => {
      incrementInput.current?.stepDown();
      incrementInput.current?.dispatchEvent(
        new Event("change", { bubbles: true }),
      );
      setHitMax(incrementInput.current?.value === incrementInput.current?.max);
      setHitMin(incrementInput.current?.value === incrementInput.current?.min);
    };

    return (
      <div className="flex items-center gap-1.5 rounded-lg border p-1.5">
        <button
          type="button"
          disabled={hitMin}
          onClick={decrement}
          aria-label="decrease"
          className="group text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MinusCircle className="h-4 w-4 group-hover:text-gray-800" />
        </button>
        <div className="relative">
          <input
            type="number"
            className={cn(
              "w-full border-0 bg-transparent p-0 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
              className,
            )}
            ref={incrementInput}
            {...props}
          />
          {symbol && <span className="absolute right-4 top-0">{symbol}</span>}
        </div>
        <button
          type="button"
          disabled={hitMax}
          onClick={increment}
          aria-label="increase"
          className="group text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <PlusCircle className="h-4 w-4 group-hover:text-gray-900" />
        </button>
      </div>
    );
  },
);
IncrementorInput.displayName = "IncrementorInput";

export { IncrementorInput };
