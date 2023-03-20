export default {
    dbServer: process.env.NODE_ENV === 'production' ?
        'https://jlz-posts-api.azurewebsites.net/posts' :
        '/posts'
}