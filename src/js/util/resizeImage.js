export default function resizeImage(blob, capaticy, files, cb) {
  const compressibility = Math.sqrt(capaticy / blob.size);
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.naturalWidth * compressibility;
    canvas.height = image.naturalHeight * compressibility;
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      files.push(blob);
      cb();
    });
  };

  const reader = new FileReader();
  reader.onloadend = () => {
    image.src = reader.result;
  };
  reader.readAsDataURL(blob);
}
