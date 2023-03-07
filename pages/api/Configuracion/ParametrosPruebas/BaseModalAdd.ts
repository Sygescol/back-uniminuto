import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { Programa } from "../../../../typings";

type Data = {
  programas: Programa[];
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
    const [ProgramaRes]: any = await connectionPool.query(
      `SELECT pro_id as Id,pro_nom as Nombre, pro_sigla as Sigla FROM pfc_programa ORDER BY pro_nom`
    );

    res.status(200).json({ programas: ProgramaRes } as Data);
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
