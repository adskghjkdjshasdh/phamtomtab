import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      res.status(400).send("Missing URL query parameter");
      return;
    }

    // Basic validation
    if (!/^https?:\/\//.test(url)) {
      res.status(400).send("Invalid URL");
      return;
    }

    // Fetch the target URL
    const response = await fetch(url);

    // Copy headers (except some)
    response.headers.forEach((value, key) => {
      if (!["content-encoding", "content-length", "transfer-encoding", "connection"].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    // Stream response back
    res.status(response.status);
    response.body.pipe(res);
  } catch (error) {
    res.status(500).send("Error fetching URL: " + error.message);
  }
}
