'use client'

import React, { useEffect, useState } from 'react';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import AwsS3, { type AwsS3Options } from '@uppy/aws-s3'

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import useUppy from '../hooks/useUppy';

export default function DDashboard() {
	const uppy = useUppy();

  if (!uppy) {
    return null; // or a loading spinner
  }
	return <Dashboard uppy={uppy} plugins={[]} />;
}