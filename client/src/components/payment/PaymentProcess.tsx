import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

interface StepType {
  numberOrder: number;
  title: string;
  description: string;
  complete: boolean;
}

interface PaymentProcessProps {
  steps: StepType[];
}

const PaymentProcess = ({ steps }: PaymentProcessProps) => {
  // step hiện tại = step đầu tiên chưa complete
  const activeStep = steps.findIndex((s) => !s.complete);

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 3,
        padding: 3,
      }}
    >
      <Stepper
        alternativeLabel
        activeStep={activeStep === -1 ? steps.length : activeStep}
        sx={{
          "& .MuiStepIcon-root": {
            color: "#9ca3af", // xám (chưa tới)
          },
          "& .MuiStepIcon-root.Mui-active": {
            color: "#10b981", // xanh lá
          },
          "& .MuiStepIcon-root.Mui-completed": {
            color: "#10b981", // xanh lá
          },

          "& .MuiStepConnector-line": {
            borderColor: "#d1d5db",
          },
          "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
            borderColor: "#10b981",
          },
          "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
            borderColor: "#10b981",
          },
        }}
      >
        {steps.map((step) => (
          <Step key={step.numberOrder} completed={step.complete}>
            <StepLabel
              optional={
                <Box sx={{ fontSize: 12, color: "#6b7280" }}>
                  {step.description}
                </Box>
              }
            >
              {step.title}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default PaymentProcess;
