// Allowed Urls that user can access without signin
const allowedUrls = [
  '/faq',
  '/signin'
];

export default function isAllowedUrl(url) {
  const isAllowed =
    allowedUrls.reduce((pre, cur) => pre || (url === cur), false);

  return isAllowed;
}
