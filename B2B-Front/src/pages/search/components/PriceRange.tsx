import { useState, useEffect } from "react";
import { useRange } from "react-instantsearch";

export default function PriceRange() {
  const { start, range, canRefine, refine } = useRange({ attribute: "price" });
  const min = (range.min as number) || 0;
  const max = (range.max as number) || 0;

  const from = Math.max(min, Number.isFinite(start[0] as number) ? (start[0] as number) : min);
  const to = Math.min(max, Number.isFinite(start[1] as number) ? (start[1] as number) : max);

  const [value, setValue] = useState({ start: from, end: to });

  useEffect(() => {
    setValue({ start: from, end: to });
  }, [from, to]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between text-xs text-slate-500">
        <span>${value.start}</span>
        <span>${value.end}</span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value.start}
        disabled={!canRefine}
        onChange={(e) =>
          setValue((v) => ({ ...v, start: Math.min(Number(e.target.value), v.end) }))
        }
        onMouseUp={() => refine([value.start, value.end])}
        onTouchEnd={() => refine([value.start, value.end])}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600 disabled:opacity-40"
      />

      <input
        type="range"
        min={min}
        max={max}
        value={value.end}
        disabled={!canRefine}
        onChange={(e) =>
          setValue((v) => ({ ...v, end: Math.max(Number(e.target.value), v.start) }))
        }
        onMouseUp={() => refine([value.start, value.end])}
        onTouchEnd={() => refine([value.start, value.end])}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600 disabled:opacity-40"
      />
    </div>
  );
}