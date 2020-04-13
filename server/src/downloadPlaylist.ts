import archiver from "archiver"
import tmp from "tmp"
import fs from "fs"
import ytpl from "ytpl"
import youtubedl from "youtube-dl"
import { Request, Response } from "express"

export const downloadPlaylist = async (
  req: Request,
  res: Response
): Promise<void> => {
  const url = req.body.url

  // Get playlist info and each url for each video in playlist
  const playlist = await ytpl(url)
  const urls = playlist.items.map((item) => item.url)

  // Send request back
  res.set({
    "Content-Type": "application/zip",
    "Content-disposition": `attachment; filename=${playlist.title}.zip`,
  })

  //Set the compression format to zip
  let archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  })
  // good practice to catch this error explicitly
  archive.on("error", (err) => {
    throw err
  })
  // pipe archive data to the file
  archive.pipe(res)

  await Promise.all(urls.map((url) => getAudio(url, archive)))
  console.log("Finalizing archive")
  archive.finalize()
}

const getAudio = async (
  url: string,
  archive: archiver.Archiver
): Promise<void> => {
  const audio = youtubedl(url, ["--extract-audio"], {})
  tmp.setGracefulCleanup()

  let tempFile = tmp.fileSync()
  let stream = fs.createWriteStream(tempFile.name)

  const trackName = await getInfo(audio)
  console.log(trackName)

  await Promise.race([getData(audio, stream), waitForStreamToFinish(audio)])
  archive.append(fs.createReadStream(tempFile.name), { name: trackName })
  console.log("Appended")
}

const getInfo = async (audio: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    audio.on("info", (info: any) => {
      let filename = `${info.track}.mp3`
      resolve(filename)
    })
  })
}

const waitForStreamToFinish = async (audio: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    audio.on("end", () => {
      resolve()
    })
  })
}

const getData = async (audio: any, stream: fs.WriteStream): Promise<void> => {
  return new Promise((resolve, reject) => {
    audio.on("data", (chunk: any) => {
      stream.write(chunk)
    })
  })
}
