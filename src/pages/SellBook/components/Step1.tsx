import { RecordBookType } from '@/constant';
import { Button, Stack, Typography } from '@mui/material';

export default function Step1({
  isActive,
  setRecordBookType,
  next,
}: {
  isActive: boolean;
  setRecordBookType: (type: number) => void;
  next: () => void;
}) {
  if (!isActive) return null;
  const chooseRecordBookType = (type: number) => {
    setRecordBookType(type);
    next();
  };
  return (
    <>
      <Typography>
        <h2 style={{ marginBottom: 50 }}>请选择录入书籍的方式</h2>
      </Typography>
      <Stack spacing={2} direction="column">
        <Button variant="contained" onClick={() => chooseRecordBookType(RecordBookType.scanRecord)}>
          扫描书的ISBN码
        </Button>
        <Button variant="contained" onClick={() => chooseRecordBookType(RecordBookType.hotRecord)}>
          选取热门书籍
        </Button>
      </Stack>
    </>
  );
}
