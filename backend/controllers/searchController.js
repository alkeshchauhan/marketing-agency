import SearchLog from "../models/SearchLog.js";

export const saveSearch = async (req, res) => {
  try {
    const { keyword } = req.body;

    // Get IP from request
    const ip_address =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;

    const log = await SearchLog.create({
      search_query: keyword,
      ip_address : ip_address, 
      device_info : req.headers["user-agent"] || null,
    });

    res.status(201).json({ message: "Search logged successfully", log });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
