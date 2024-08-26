import axios from 'axios';

export function checkFile(fileHash) {
  return axios.post('/api/check-file', { fileHash })
    .then(response => response.data);
}

export function uploadChunk(fileHash, chunkIndex, chunk) {
  const formData = new FormData();
  formData.append('fileHash', fileHash);
  formData.append('chunkIndex', chunkIndex);
  formData.append('chunk', chunk);

  return axios.post('/api/upload-chunk', formData)
    .then(response => response.data);
}

export function mergeChunks(fileHash, totalChunks) {
  return axios.post('/api/merge-chunks', { fileHash, totalChunks })
    .then(response => response.data);
}