import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingAnimationProps {
  message?: string;
}

export default function LoadingAnimation({ message = 'Loading...' }: LoadingAnimationProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        minHeight: '200px',
        width: '100%',
      }}
    >
      <CircularProgress
        size={48}
        thickness={4}
        sx={{
          color: 'primary.main',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          fontWeight: 500,
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          '@keyframes pulse': {
            '0%, 100%': {
              opacity: 1,
            },
            '50%': {
              opacity: 0.5,
            },
          },
        }}
      >
        {message}
      </Typography>
    </Box>
  );
} 