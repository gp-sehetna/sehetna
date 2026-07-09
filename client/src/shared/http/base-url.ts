const BASE_URL = "https://sehetna.from-masr.com"
const DEV_BASE_URL = "http://127.0.0.1:5000"

//? Use: http://ai-server-app:8000 when running in docker, and http://127.0.0.1:8000 when running locally
const __DEV_AI_SERVER_BASE_URL = "http://127.0.0.1:8000"

export default BASE_URL
export { DEV_BASE_URL, __DEV_AI_SERVER_BASE_URL }
