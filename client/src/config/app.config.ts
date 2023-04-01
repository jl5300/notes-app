const db = {
    posts: '/posts',
    user: '/user'
};

if (process.env.NODE_ENV === 'production') {
    for (let url of Object.values(db)) {
        url = 'https://jlz-posts-api.azurewebsites.net' + url;
    }
}

export { db };