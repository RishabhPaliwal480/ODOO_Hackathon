const slugify = (value) =>
  String(value || 'trip')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);

const uniqueSlug = (value) => `${slugify(value)}-${Math.random().toString(36).slice(2, 8)}`;

module.exports = { slugify, uniqueSlug };
