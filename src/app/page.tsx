'use client'

import ClientOnly from "./components/ClientOnly";
import DDashboard from "./components/DDashboard";

export default function Page() { 
  return (
    <div>
      <h1>Golden Retriever</h1>
      <p>Upload files to S3 using Uppy</p>
      {/* <ClientOnly>
        <DDashboard/>
      </ClientOnly> */}
      <DDashboard/>
    </div>
  );
}