let FileExtensions = new Map();
FileExtensions.set("image", ["image/jpeg","image/png","image/gif","image/bmp", "image/webp", "image/tiff", "image/svg+xml", "image/heic", "image/avif"]);
FileExtensions.set("excel", ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv', 'application/vnd.ms-excel']);
export default FileExtensions;