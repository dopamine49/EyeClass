import { mockProducts } from '../data/mockProducts';

const STYLE_POOL = ['Y2K', 'Retro', 'Minimal'];

function seededPick(seed, pool) {
  const index = Math.abs(Number(seed) || 0) % pool.length;
  return pool[index];
}

function inferType(name = '') {
  const normalized = name.toLowerCase();
  if (normalized.includes('sun') || normalized.includes('shade')) {
    return 'sunglasses';
  }
  if (normalized.includes('blue') || normalized.includes('screen')) {
    return 'blue-light';
  }
  return 'fashion';
}

function inferCategory(category = '', seed = 0) {
  if (category) {
    return category.toLowerCase();
  }
  return ['men', 'women', 'kids'][Math.abs(Number(seed) || 0) % 3];
}

export function normalizeProduct(raw, index = 0) {
  const id = raw.id || raw.productId || 1000 + index;
  const price = Number(raw.price || 390000);
  const oldPrice = raw.oldPrice ? Number(raw.oldPrice) : Math.round(price * 1.25);
  const category = inferCategory(raw.category, id);
  const type = raw.type || inferType(raw.name);
  const style = raw.style || seededPick(id + index, STYLE_POOL);
  const fallbackImage = `https://picsum.photos/seed/eyecare-${id}/1200/900`;
  const imageUrl = raw.imageUrl || fallbackImage;
  const imageAlt = raw.imageAlt || imageUrl;

  return {
    id,
    name: raw.name || `Eyecare Frame ${id}`,
    category,
    type,
    style,
    price,
    oldPrice,
    stock: Number(raw.stock || 12),
    sold: Number(raw.sold || ((id * 7) % 150) + 20),
    isNew: Boolean(raw.isNew),
    isTrending: Boolean(raw.isTrending),
    imageUrl,
    imageAlt,
    gallery: raw.gallery && raw.gallery.length ? raw.gallery : [imageUrl, imageAlt],
    description:
      raw.description ||
      'Thiết kế trẻ trung, nhẹ và dễ phối đồ. Phù hợp học tập, đi làm thêm và đi chơi cuối tuần.',
  };
}

export function toProductCatalog(rawProducts = []) {
  if (!rawProducts.length) {
    return mockProducts.map(normalizeProduct);
  }
  return rawProducts.map(normalizeProduct);
}

export function priceToVnd(price) {
  return Number(price || 0).toLocaleString('vi-VN');
}

export function discountPercent(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) {
    return 0;
  }
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}
