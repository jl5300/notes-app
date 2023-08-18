export default {
	db: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/posts-db',
    sessionSecret: process.env.SESSION_SECRET || 'developmentsecret'
}
