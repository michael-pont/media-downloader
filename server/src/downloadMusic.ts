import youtubedl from "youtube-dl"

import { Request, Response } from "express"

export const downloadMusic = (req: Request, res: Response): void => {
  const url = req.body.url
  const audio = youtubedl(url, ["--extract-audio"], {})

  // Get video for info for title, size, etc.
  // This gets called first in stream
  audio.on("info", (info: any) => {
    const { track, title, id } = info
    const possibleFileNames = [title, track, id]
    for (const name of possibleFileNames) {
      try {
        const newHeaderValue = `attachment; filename="${name}.mp3"`
        res.set("Content-Disposition", newHeaderValue)
        console.log(newHeaderValue)
        break
      } catch (_) {
        // do nothing
      }
    }
  })

  audio.on("data", (chunk: any) => {
    res.write(chunk)
  })

  audio.on("end", () => {
    res.status(200).end()
  })

  // Handle error below
  audio.on("error", (err: Error) => {
    res.status(400).send({ error: err.message })
  })
}
