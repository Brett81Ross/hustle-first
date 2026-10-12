export const PHOTO_SOURCE_MAX_BYTES=8*1024*1024;
export const PHOTO_UPLOAD_TARGET_BYTES=3.5*1024*1024;
const allowed=new Set(["image/jpeg","image/png","image/webp"]);

export function validatePhoto(file:File){
  if(!allowed.has(file.type))throw new Error("Use a JPG, PNG, or WebP image.");
  if(file.size<=0)throw new Error("Choose a photo.");
  if(file.size>PHOTO_SOURCE_MAX_BYTES)throw new Error("Photo must be 8 MB or smaller.");
}

export async function preparePhotoForUpload(file:File){
  validatePhoto(file);
  if(file.size<=PHOTO_UPLOAD_TARGET_BYTES)return file;
  if(typeof document==="undefined")return file;
  const bitmap=await createImageBitmap(file).catch(()=>null);
  if(!bitmap)throw new Error("Could not prepare this photo for upload.");
  const longest=Math.max(bitmap.width,bitmap.height);
  const scale=Math.min(1,2200/longest);
  const width=Math.max(1,Math.round(bitmap.width*scale));
  const height=Math.max(1,Math.round(bitmap.height*scale));
  const canvas=document.createElement("canvas");
  canvas.width=width;canvas.height=height;
  const ctx=canvas.getContext("2d");
  if(!ctx){bitmap.close();throw new Error("Could not prepare this photo for upload.");}
  ctx.drawImage(bitmap,0,0,width,height);
  bitmap.close();
  for(const quality of [.84,.76,.68,.6]){
    const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/jpeg",quality));
    if(blob&&blob.size<=PHOTO_UPLOAD_TARGET_BYTES){
      const base=file.name.replace(/\.[^.]+$/,"")||"photo";
      return new File([blob],base+".jpg",{type:"image/jpeg",lastModified:Date.now()});
    }
  }
  throw new Error("This photo is too large to upload. Try a lower-resolution photo.");
}
