export default async function handler(req, res) {
  const fetch = await import('node-fetch').then(mod => mod.default);

  try {
    const { url } = req.query;
    if (!url) return res.status(400).send("Missing URL");
    if (!/^https?:\/\//.test(url)) return res.status(400).send("Invalid URL");

    const response = await fetch(url);

    // Copy allowed headers
    response.headers.forEach((value, key) => {
      if (!["content-encoding", "content-length", "transfer-encoding", "connection"].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    res.status(response.status);

    if (response.body) {
      response.body.pipe(res);
    } else {
      const text = await response.text();
      res.send(text);
    }
  } catch (error) {
    res.status(500).send("Proxy error: " + error.message);
  }
}

