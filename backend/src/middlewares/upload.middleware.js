import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';

const uploadsRoot = path.resolve(process.cwd(), 'uploads', 'products');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function normalizeName(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60);
}

const storage = multer.diskStorage({
  destination(req, _file, cb) {
    const sellerId = req.user?.rol === 'vendedor'
      ? Number(req.user.id)
      : Number(req.body?.seller_id ?? req.body?.sellerId);
    if (!Number.isInteger(sellerId) || sellerId < 1) {
      return cb(new Error('Vendedor inválido para la carga de imagen.'));
    }
    const dest = path.join(uploadsRoot, `seller-${sellerId}`);
    ensureDir(dest);
    cb(null, dest);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    const base = normalizeName(req.body?.name || 'producto');
    cb(null, `${Date.now()}-${base}${ext}`);
  }
});

function fileFilter(_req, file, cb) {
  if (!file.mimetype?.startsWith('image/')) {
    return cb(new Error('Solo se permiten archivos de imagen.'));
  }
  cb(null, true);
}

export const productImageUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});
