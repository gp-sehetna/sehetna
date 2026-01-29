import api from "@/shared/api/client"
import ky from "ky"

const externalApi = ky.create({ timeout: 20000 })

export { api, externalApi }
