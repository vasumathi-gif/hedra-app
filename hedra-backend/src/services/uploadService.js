export const validateImage = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  return allowedTypes.includes(file.mimetype);
};

export const generateFilename = (originalName) => {
  const ext = originalName.split('.').pop();
  return `file-${Date.now()}.${ext}`;
};
