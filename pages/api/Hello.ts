// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../config/db";

type Data = {
  name: string;
};

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "GET") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }

  // const [hola] = await connectionPool.query("SELECT * FROM super_sede");

  res.status(200).json({ name: "John Doe" });
}
