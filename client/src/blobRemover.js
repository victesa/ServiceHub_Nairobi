function removeBlobPrefix(url) {
    if (typeof url === 'string' && url.startsWith('blob:')) {
        return url.substring(5);
    }
    return url;
}


export default removeBlobPrefix
