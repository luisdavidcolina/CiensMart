export const getImagePath = (src: string) => {
    if (!src) return '/images/placeholder.jpg';
    if (src.startsWith('http://') || src.startsWith('https://')) {
        return src;
    }
    return `/images/${src}`;
};
