'use client'

import React, { useEffect, useState } from 'react';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import AwsS3, { type AwsS3Options } from '@uppy/aws-s3'
import GoldenRetriever from '@uppy/golden-retriever';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

export default function DDashboard() {
	// IMPORTANT: passing an initializer function to prevent Uppy from being reinstantiated on every render.
	const [uppy] = useState(() => {
    return new Uppy({debug: true})
    .use(AwsS3, {
      shouldUseMultipart(file) {
        console.log('file size', file.size)
        return file.size > 5 * 0x10_00_00 //100MB minimum
      },
      getChunkSize(fileSize) { //could dynamically define chunk sizes based on file size
        return 5 * 0x10_00_00; // 100MB chunk
      },
    getUploadParameters: async (file) => {
      return fetch('api/s3/single/signupload', {
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
    },
    createMultipartUpload: async (file) => {
      return fetch('api/s3/multipart/start', {
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
    },
    signPart: async (file, options) => {
      const { uploadId, key, partNumber, signal } = options
      return fetch('api/s3/multipart/signpart', {
        method: 'post',
        body: JSON.stringify({
          uploadId,
          key,
          partNumber
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      }).then((response) => {
        return response.json()
      })
    },
    completeMultipartUpload: async (file, options) => {
      const { uploadId, key, parts } = options
      return fetch('api/s3/multipart/complete', {
        method: 'post',
        body: JSON.stringify({
          uploadId,
          key,
          parts
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      }).then((response) => {
        return response.json()
      })
    },
    listParts: async (file, options) => {
      const { uploadId, key } = options
      return fetch('api/s3/multipart/listparts', {
        method: 'post',
        body: JSON.stringify({
          uploadId,
          key
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      }).then((response) => {
        return response.json()
      })
    },
    abortMultipartUpload: async (file, options) => {
      const { uploadId, key } = options
      return fetch('api/s3/multipart/abort', {
        method: 'post',
        body: JSON.stringify({
          uploadId,
          key
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      }).then((response) => {
        return response.json()
      })
    },
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