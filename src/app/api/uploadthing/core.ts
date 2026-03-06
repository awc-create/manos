import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: '4MB' } }).onUploadComplete(async ({ file }) => {
    console.log('File uploaded:', file.url);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
