"use strict";

import pump from "pump";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { ErrorHandler } from "../../helpers/handleError.js";

const imageMime = ["jpeg", "jpg", "png", "gif", "webp"];
const videoMime = ["mp4", "mpeg", "ogg", "webm", "m4v", "mov", "mkv"];
const docsMime = [
  "pdf",
  "ppt",
  "pptx",
  "docx",
  "application/msword",
  "msword",
  "vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const uploadFiles = async (req, res) => {
  let path = [];
  const files = req.files();
  for await (const file of files) {
    let folder;
    const mime = file.mimetype.split("/").pop();
    if (imageMime.includes(mime)) {
      folder = "public/images/";
    } else if (videoMime.includes(mime)) {
      folder = "public/videos/";
    } else if (docsMime.includes(mime)) {
      folder = "public/";
    } else {
      folder = "public/";
    }

    const filePath =
      `${folder}` +
      Date.now() +
      "_" +
      file.filename
        .replaceAll(" ", "_")
        .replaceAll("'", "_")
        .replaceAll("/", "_");

    await fs.promises.mkdir(folder, { recursive: true });

    path.push(await pump(file.file, fs.createWriteStream(filePath)).path);
  }
  return res.send({
    status: true,
    path: path,
  });
};

const getFile = async (req, res) => {
  if (!req.query || !req.query.file_path) {
    return ErrorHandler({
      code: 400,
      message: "file_path is required parameter",
    });
  }

  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDirPath = dirname(currentFilePath);
  const publicPath = path.join(
    currentDirPath,
    "../../../public",
    req.query.file_path
  );

  if (!fs.existsSync(publicPath)) {
    return ErrorHandler({ code: 404, message: "file not found" });
  }

  let mime = req.query.file_path.split(".").pop();
  if (["jpeg", "jpg", "png", "gif", "webp"].includes(mime)) {
    if (mime === "jpg") {
      res.type(`image/jpeg`);
    } else {
      res.type(`image/${mime}`);
    }
  }
  if (["mp4", "mpeg", "ogg", "webm"].includes(mime)) {
    res.type(`video/${mime}`);
  }
  if (mime === "pdf") {
    res.type("application/pdf");
  }
  if (mime === "ppt") {
    res.type("application/vnd.ms-powerpoint");
  }

  if (mime === "docx") {
    res.type(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
  }

  if (mime === "doc") {
    res.type("application/msword");
  }

  const filePath = await fs.readFileSync(publicPath);
  return res.send({ status: true, data: filePath });
};

const deleteFile = async (req, res) => {
  if (!req.query || !req.query.file_path) {
    return res.send({
      message: "file_path is required parameter",
    });
  }

  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDirPath = dirname(currentFilePath);
  const publicPath = path.join(currentDirPath, "../../..", req.query.file_path);

  if (fs.existsSync(publicPath)) {
    fs.unlinkSync(publicPath);
    res.send({ status: true, message: "File deleted" });
  }
};

export default {
  uploadFiles,
  getFile,
  deleteFile,
};
