<template>
    <div>
      <form action="/api/upload-chunk" class="dropzone" id="file-dropzone"></form>
    </div>
  </template>
  
  <script>
  import Dropzone from 'dropzone';
  import { calculateHash } from '@/utils/hashUtil';
  import { checkFile, uploadChunk, mergeChunks } from '@/services/fileService';
  
  export default {
    name: 'FileUpload',
    data() {
      return {
        chunkSize: 2 * 1024 * 1024, // 2MB
      };
    },
    mounted() {
      this.initDropzone();
    },
    methods: {
      initDropzone() {
        const dropzone = new Dropzone("#file-dropzone", {
          url: "/api/upload-chunk",
          autoProcessQueue: false,
          chunking: true,
          chunkSize: this.chunkSize,
          parallelUploads: 1,
          retryChunks: true,
          retryChunksLimit: 3,
          init: function() {
            this.on("addedfile", (file) => {
              this.processFile(file);
            });
          },
          processFile(file) {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);
            fileReader.onload = async (e) => {
              const fileBuffer = e.target.result;
              const fileHash = await calculateHash(fileBuffer);
              const { exists, uploadedChunks } = await checkFile(fileHash);
  
              if (exists) {
                alert("File already exists!");
                return;
              }
  
              const totalChunks = Math.ceil(file.size / this.chunkSize);
              for (let i = 0; i < totalChunks; i++) {
                if (uploadedChunks.includes(i)) continue;
  
                const chunk = file.slice(i * this.chunkSize, (i + 1) * this.chunkSize);
                await uploadChunk(fileHash, i, chunk);
              }
  
              await mergeChunks(fileHash, totalChunks);
              alert("File uploaded successfully!");
            };
          }
        });
      }
    }
  };
  </script>
  
  <style>
  /* Add your styles here */
  </style>