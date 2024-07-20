import React, { useRef, useState } from 'react';
import { RecordBookType } from '@/constant';
import { Button, Box, Typography } from '@mui/material';
import Quagga from 'quagga';

// 添加 getUserMedia polyfill
if (typeof navigator.mediaDevices === 'undefined') {
  navigator.mediaDevices = {};
}

if (typeof navigator.mediaDevices.getUserMedia === 'undefined') {
  navigator.mediaDevices.getUserMedia = function (constraints) {
    const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }

    return new Promise(function (resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  };
}

interface BookInfo {
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  imageLinks?: {
    thumbnail: string;
  };
}

export default function Step2({
  isActive,
  recordBookType,
}: {
  isActive: boolean;
  recordBookType: number;
}) {
  const [scanning, setScanning] = useState(false);
  const [isbn, setIsbn] = useState('');
  const [bookInfo, setBookInfo] = useState<BookInfo | null>(null);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLDivElement>(null);

  const handleScan = async () => {
    setScanning(true);
    setIsbn('');
    setBookInfo(null);
    setError('');

    // 检查设备是否支持 getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('您的设备不支持摄像头访问');
      setScanning(false);
      return;
    }

    try {
      // 请求摄像头权限
      await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        Quagga.init(
          {
            inputStream: {
              name: 'Live',
              type: 'LiveStream',
              target: videoRef.current,
              constraints: {
                width: 640,
                height: 480,
                facingMode: 'environment',
              },
            },
            locator: {
              patchSize: 'medium',
              halfSample: true,
            },
            numOfWorkers: 2,
            decoder: {
              readers: ['ean_reader'],
            },
            locate: true,
          },
          (err) => {
            if (err) {
              console.error(err);
              setError('无法初始化摄像头');
              setScanning(false);
              return;
            }
            Quagga.start();
            // 隐藏 Quagga 生成的 canvas
            const canvas = videoRef.current?.querySelector('canvas');
            if (canvas) {
              canvas.style.display = 'none';
            }
          },
        );

        Quagga.onDetected((data) => {
          const scannedIsbn = data.codeResult.code;
          // alert(scannedIsbn)
          if (scannedIsbn) {
            setIsbn(scannedIsbn);
            // fetchBookInfo(scannedIsbn);
          }
          stopScanning();
        });
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('无法访问摄像头，请确保已授予摄像头权限');
      setScanning(false);
    }
  };

  const stopScanning = () => {
    setScanning(false);
    Quagga.stop();
  };

  // const fetchBookInfo = async (isbn: string) => {
  //   // ... (fetchBookInfo 函数保持不变)
  // };

  if (!isActive) return null;
  if (recordBookType === RecordBookType.scanRecord) {
    return (
      <Box>
        <Button variant="contained" onClick={handleScan} disabled={scanning || loading}>
          {scanning ? '正在扫描...' : '开始扫描ISBN码'}
        </Button>
        {scanning && (
          <Button variant="outlined" onClick={stopScanning} sx={{ ml: 2 }}>
            停止扫描
          </Button>
        )}
        <Box
          ref={videoRef}
          sx={{
            mt: 2,
            width: '100%',
            maxWidth: 640,
            '& video': { width: '100%', height: 'auto' },
            '& canvas': { display: 'none !important' },
          }}
        />
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        {bookInfo && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">{bookInfo.title}</Typography>
            <Typography>作者: {bookInfo.authors.join(', ')}</Typography>
            <Typography>出版社: {bookInfo.publisher}</Typography>
            <Typography>出版日期: {bookInfo.publishedDate}</Typography>
            {bookInfo.imageLinks && (
              <img src={bookInfo.imageLinks.thumbnail} alt={bookInfo.title} />
            )}
            <Typography sx={{ mt: 1 }}>{bookInfo.description}</Typography>
          </Box>
        )}
        {isbn && <Typography variant="h6">识别出的ISBN号码为{isbn}</Typography>}
      </Box>
    );
  }
  return <Typography>热门书籍</Typography>;
}
