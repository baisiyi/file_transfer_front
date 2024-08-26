import SparkMD5 from 'spark-md5';

export function calculateHash(fileBuffer) {
  return new Promise((resolve) => {
    const spark = new SparkMD5.ArrayBuffer();
    spark.append(fileBuffer);
    const hash = spark.end();
    resolve(hash);
  });
}