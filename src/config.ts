import 'dotenv/config'

const config = {
	port: process.env.PORT,
	database: {
		uri: process.env.DATABASE_URI
	},
	JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
	JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET
}


export default config