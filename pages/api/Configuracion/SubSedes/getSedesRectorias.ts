import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { RequisitrosMatricula, Sede } from "../../../../typings";

type Data = {
  sedesRectorias: Sede[];
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
    const { id } = req.query;

    const [SedesRectorias]: any = await connectionPool.query(`
    select id as Id, nombreSede as NombreSede from sedes where idRectoria = ${id}`);

    res.status(200).json({ sedesRectorias: SedesRectorias } as Data);
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
