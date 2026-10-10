const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_BYTES = 5 * 1024 * 1024; // per-file cap used by the backend
const MAX_DIMENSION = 1280; // longest edge after downscaling
const JPEG_QUALITY = 0.82;

export function isValidImageFile(file) {
  return !!file && ALLOWED_IMAGE_TYPES.includes(file.type);
}

export function isImageTooLarge(file) {
  return !!file && file.size > MAX_FILE_BYTES;
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("decode failed"));
    img.src = src;
  });
}

/**
 * Validate and (if needed) downscale an image before upload so that several
 * pictures fit comfortably within request body limits. Returns
 * { ok: true, file } or { ok: false, error }.
 */
export async function processImageForUpload(file) {
  if (!isValidImageFile(file)) {
    return { ok: false, error: `"${file.name}" is not a supported image type.` };
  }

  // Small images are passed through untouched (keeps PNG transparency).
  if (file.size <= MAX_FILE_BYTES) {
    return { ok: true, file };
  }

  if (file.type === "image/gif") {
    return { ok: false, error: `"${file.name}" is too large (max 5 MB).` };
  }

  try {
    const dataUrl = await readFileAsDataURL(file);
    const img = await loadImage(dataUrl);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
    );
    if (!blob) {
      return { ok: false, error: `"${file.name}" could not be processed.` };
    }

    const name = `${file.name.replace(/\.[^.]+$/, "")}.jpg`;
    const processed = new File([blob], name, { type: "image/jpeg" });
    if (processed.size > MAX_FILE_BYTES) {
      return { ok: false, error: `"${file.name}" is too large (max 5 MB).` };
    }
    return { ok: true, file: processed };
  } catch {
    return { ok: false, error: `"${file.name}" could not be read as an image.` };
  }
}