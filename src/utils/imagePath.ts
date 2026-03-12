export const getImagePath = (src: any) => {
    if (!src || typeof src !== 'string') return '/images/placeholder.jpg';

    const trimmedSrc = src.trim();

    // Check if it's already an absolute URL
    if (trimmedSrc.startsWith('http://') || trimmedSrc.startsWith('https://') || trimmedSrc.startsWith('//')) {
        return trimmedSrc;
    }

    // If it already starts with /images/, return as is
    if (trimmedSrc.startsWith('/images/')) {
        return trimmedSrc;
    }

    return `/images/${trimmedSrc}`;
};
