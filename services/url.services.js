import { nanoid } from "nanoid";
import { client } from "../index.js";
import isUrlHttp from "is-url-http";

export const generateUrl = async (req, res, next) => {
  console.log(req.body);
  let originalUrl = req.body.url;
  let base = "dhananjaypuppala.netlify.app";

  let urlId = nanoid(8);
  if (isUrlHttp(originalUrl)) {
    try {
      let url = await client
        .db("urlshortner")
        .collection("url")
        .findOne({ originalUrl });
      if (url) {
        res.json(url);
      } else {
        const shortUrl = `${base}/${urlId}`;
        url = await client.db("urlshortner").collection("url").insertOne({
          originalUrl,
          shortUrl,
          urlId,
          clicks: 0,
          date: new Date(),
        });

        res.status(200).json({
          status: "success",
          message: "Short URL generated",
          data: url,
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json("Server Error");
    }
  } else {
    res.status(400).json("Invalid Original Url");
  }
};

export const getUrl = async (req, res, next) => {
  let urlId = req.params.urlId;
  console.log(urlId);
  try {
    const url = await client
      .db("urlshortner")
      .collection("url")
      .findOne({ urlId });
    if (url) {
      await client
        .db("urlshortner")
        .collection("url")
        .updateOne({ urlId }, { $inc: { clicks: 1 } });
      return res.status(200).json({
        status: "success",
        message: "Email retrieved successfully",
        data: url.originalUrl,
      });
    } else {
      res.status(404).json("Not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
};

export const deleteUrl = async (req, res, next) => {
  let urlId = req.params.urlId;
  console.log(urlId);
  try {
    const url = await client
      .db("urlshortner")
      .collection("url")
      .findOne({ urlId });
    if (url) {
      await client.db("urlshortner").collection("url").deleteOne({ urlId });
      return res.status(204).json({
        status: "success",
        message: "URL deleted successfully",
      });
    } else {
      res.status(404).json("Not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
};
