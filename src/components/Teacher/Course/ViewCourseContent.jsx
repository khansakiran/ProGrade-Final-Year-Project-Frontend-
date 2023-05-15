import React from 'react';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';
import Contents from './ContentTable';


function ViewCourseContent() {
  const theme = useTheme()
  return (
    <>
      <Typography variant='h5' sx={{ fontWeight: 'bold' }}>Avaliable Course Contents</Typography>
      <Contents />
    </>

  );
}

export default ViewCourseContent;
