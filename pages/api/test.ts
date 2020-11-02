import { NextApiRequest, NextApiResponse } from "next";

function handler(_: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({ success: true });
}

export default handler;
