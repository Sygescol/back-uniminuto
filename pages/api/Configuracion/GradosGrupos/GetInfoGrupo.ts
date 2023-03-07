import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";

type Data = {};

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "POST") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const { IdGrupo } = req.body;

    console.log(req.body);
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
