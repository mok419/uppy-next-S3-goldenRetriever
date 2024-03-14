import { useEffect, useRef, useState } from "react";
import Uppy from "@uppy/core";
import AwsS3, { type AwsS3Options } from "@uppy/aws-s3";

import GoldenRetriever from "@uppy/golden-retriever";

const initializeUppy = (): Uppy => {
  const uppy = new Uppy({
    // autoProceed: true,
    debug: true,
  })
    .use(AwsS3, {
      limit: 2,
      shouldUseMultipart(file) {
        console.log("file size", file.size);
        return file.size > 5 * 0x10_00_00; //100MB minimum
      },
      getChunkSize(fileSize) {
        //could dynamically define chunk sizes based on file size
        return 5 * 0x10_00_00; // 100MB chunk
      },
      getUploadParameters: async (file) => {
        return fetch("api/s3/single/signupload", {
          method: "post",
          body: JSON.stringify({
            filename: file.name,
            type: file.type,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          return response.json();
        });
      },
      createMultipartUpload: async (file) => {
        return fetch("api/s3/multipart/start", {
          method: "post",
          body: JSON.stringify({
            filename: file.name,
            type: file.type,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          return response.json();
        });
      },
      signPart: async (file, options) => {
        const { uploadId, key, partNumber, signal } = options;
        return fetch("api/s3/multipart/signpart", {
          method: "post",
          body: JSON.stringify({
            uploadId,
            key,
            partNumber,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          return response.json();
        });
      },
      completeMultipartUpload: async (file, options) => {
        const { uploadId, key, parts } = options;
        return fetch("api/s3/multipart/complete", {
          method: "post",
          body: JSON.stringify({
            uploadId,
            key,
            parts,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          return response.json();
        });
      },
      listParts: async (file, options) => {
        const { uploadId, key } = options;
        return fetch("api/s3/multipart/listparts", {
          method: "post",
          body: JSON.stringify({
            uploadId,
            key,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          return response.json();
        });
      },
      abortMultipartUpload: async (file, options) => {
        const { uploadId, key } = options;
        return fetch("api/s3/multipart/abort", {
          method: "post",
          body: JSON.stringify({
            uploadId,
            key,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          return response.json();
        });
      },
    })
    .use(GoldenRetriever);

  return uppy;
};

function useUppy() {
  const [uppy, setUppy] = useState<Uppy | undefined>(undefined);

  useEffect(() => {
    setUppy(initializeUppy());

    return () => {
      if (uppy) {
        uppy.close();
        setUppy(undefined);
      }
    };
  }, []);

  return uppy;
}

export default useUppy;
