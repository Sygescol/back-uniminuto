import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { COA } from "../../../../typings";

type Data = {
  Coa: COA[];
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
    const [COARESULTS]: any = await connectionPool.query(
      `SELECT id as Id,nombre as Nombre FROM subSedes`
    );

    res.status(200).json({ Coa: COARESULTS || [] } as Data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
