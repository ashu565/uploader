import React, { useState } from "react";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client, S3 } from "@aws-sdk/client-s3";
const App = () => {
  function fileChange(e) {
    var file = e.target.files[0];
    // console.log(e.target.files[0])

    const creds = {
      accessKeyId: process.env.REACT_APP_ACCESSKEYID,
      secretAccessKey: process.env.REACT_APP_SECRETACCESSKEY,
    };
    try {
      const parallelUploads3 = new Upload({
        client: new S3Client({ region: "us-west-2", credentials: creds }),
        leavePartsOnError: false, // optional manually handle dropped parts
        params: {
          Bucket: process.env.REACT_APP_AWSBUCKET,
          Key: file.name,
          Body: file,
        },
      });

      parallelUploads3.on("httpUploadProgress", (progress) => {
        console.log(progress);
        let a = getUploadingProgress(progress.loaded, progress.total);
        console.log(a);
      });

      parallelUploads3.done();
    } catch (e) {
      console.log(e);
    }
  }
  function getUploadingProgress(uploadSize, totalSize) {
    let uploadProgress = (uploadSize / totalSize) * 100;
    return Number(uploadProgress.toFixed(0));
  }

  return (
    <div className="UploadContainer">
      <h1>Upload your content here ..</h1>
      <input type="file" onChange={fileChange} />
    </div>
  );
};

export default App;
