import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';
import { Box, Button, MobileStepper } from '@mui/material';
import { useState } from 'react';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import Step5 from './components/Step5';
import { RecordBookType } from '@/constant';

function SellBook() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [recordBookType, setRecordBookType] = useState<number>(RecordBookType.hotRecord);
  const steps = 5; // 总步骤数

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  return (
    <>
      <Meta title="卖书" />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <FullSizeCenteredFlexBox>
          <Step1
            isActive={activeStep === 0}
            setRecordBookType={setRecordBookType}
            next={handleNext}
          />
          <Step2 isActive={activeStep === 1} recordBookType={recordBookType} />
          <Step3 isActive={activeStep === 2} />
          <Step4 isActive={activeStep === 3} />
          <Step5 isActive={activeStep === 4} />
        </FullSizeCenteredFlexBox>

        <MobileStepper
          variant="dots"
          steps={steps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button size="small" onClick={handleNext} disabled={activeStep === steps - 1}>
              下一步
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              <KeyboardArrowLeft />
              上一步
            </Button>
          }
        />
      </Box>
    </>
  );
}

export default SellBook;
