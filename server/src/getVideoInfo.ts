import youtubedl from "youtube-dl"
import { Request, Response } from "express"

export const getVideoInfo = (req: Request, res: Response): void => {
  const url = req.query.url
  youtubedl.getInfo(url, [], (err: Error, info: any) => {
    if (err) {
      res.status(400).send({
        error: err.message,
      })
    }
    res.status(200).send({
      data: info,
    })
  })
}
