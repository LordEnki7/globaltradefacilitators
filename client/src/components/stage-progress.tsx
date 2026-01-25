import type { TransactionStage } from "@shared/schema";
import { STAGE_LABELS } from "@shared/schema";
import { Check } from "lucide-react";

const stages: TransactionStage[] = ["application", "approval", "shipment", "payment", "completed"];

interface StageProgressProps {
  currentStage: TransactionStage;
  className?: string;
}

export function StageProgress({ currentStage, className = "" }: StageProgressProps) {
  const currentIndex = stages.indexOf(currentStage);

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={stage} className="flex flex-col items-center relative z-10">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-300 border-2
                  ${isCompleted 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : isCurrent
                    ? "bg-primary/10 text-primary border-primary"
                    : "bg-muted text-muted-foreground border-border"
                  }
                `}
                data-testid={`stage-indicator-${stage}`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span 
                className={`
                  mt-2 text-xs font-medium whitespace-nowrap
                  ${isCurrent ? "text-primary" : isPending ? "text-muted-foreground" : "text-foreground"}
                `}
              >
                {STAGE_LABELS[stage]}
              </span>
            </div>
          );
        })}
      </div>
      <div 
        className="absolute top-5 left-5 right-5 h-0.5 bg-border -translate-y-1/2"
        style={{ zIndex: 0 }}
      >
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
