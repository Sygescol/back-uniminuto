import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { Rectoria } from "../../../../typings";

type Data = {
  rectorias: Rectoria[];
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
  try {
    const [GetRectorias]: any = await connectionPool.query(
      `
      SELECT id as Id, nombre as Nombre FROM rectorias
      `
    );

    res.status(200).json({ rectorias: GetRectorias } as Data);
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
