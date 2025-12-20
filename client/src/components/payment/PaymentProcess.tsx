import { Check } from "lucide-react";

interface Step {
  numberOrder: number;
  title: string;
  description: string;
  complete: boolean;
}

interface PaymentProcessProps {
  steps: Step[];
}

const PaymentProcess = ({ steps }: PaymentProcessProps) => {
  // xác định step đang active = step đầu tiên chưa complete
  const activeIndex = steps.findIndex((s) => !s.complete);

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between">
          {steps.map((step, index) => {
            const isCompleted = step.complete;
            const isActive = index === activeIndex;

            return (
              <div key={step.numberOrder} className="flex flex-1 items-start">
                {/* Step */}
                <div className="flex flex-col items-center flex-1">
                  {/* Circle */}
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all
                      ${
                        isCompleted
                          ? "bg-primary border-primary text-primary-foreground"
                          : isActive
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-muted bg-background text-muted-foreground"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <span>{step.numberOrder}</span>
                    )}
                  </div>

                  {/* Text */}
                  <div className="mt-3 text-center">
                    <p
                      className={`text-sm font-medium ${
                        isCompleted || isActive
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[120px]">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-full mt-6 transition-all ${
                      isCompleted ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaymentProcess;
