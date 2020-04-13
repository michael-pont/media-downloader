import { downloadPlaylist } from "./downloadPlaylist"
import { getVideoInfo } from "./getVideoInfo"
import { downloadMusic } from "./downloadMusic"
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"

const app = express()
app.use(cors({ exposedHeaders: ["Content-Disposition"] }))
app.use(bodyParser.json())
const port = 8080 // default port to listen

app.post("/downloadMusic", downloadMusic)
app.get("/videoInfo", getVideoInfo)
app.post("/downloadPlaylist", downloadPlaylist)

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
