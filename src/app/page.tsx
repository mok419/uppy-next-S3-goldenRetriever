'use client'

import React, { useEffect, useState } from 'react';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import AwsS3, { type AwsS3Options } from '@uppy/aws-s3'
import GoldenRetriever from '@uppy/golden-retriever';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

export default function Component() {
	// IMPORTANT: passing an initializer function to prevent Uppy from being reinstantiated on every render.
	const [uppy] = useState(() => {
    return new Uppy({debug: true})
    .use(AwsS3, {
    getUploadParameters: async (file) => {
      return fetch('api/s3/signupload', {
        method: 'post',
        body: JSON.stringify({
          filename: file.name,
          type: file.type
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        return response.json()
      })
    } 
    })
    .use(GoldenRetriever, {serviceWorker: true})
  });



  useEffect(() => {
    if (uppy) {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/sw.js') // path to your bundled service worker with GoldenRetriever service worker
          .then((registration) => {
            console.log(
              'ServiceWorker registration successful with scope: ',
              registration.scope,
            );
          })
          .catch((error) => {
            console.log(`Registration failed with ${error}`);
          });
      }
    }
  }, [uppy]) // This effect runs whenever `uppy` changes

	return <Dashboard uppy={uppy} plugins={[]} />;
}