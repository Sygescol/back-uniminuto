import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { Jornada, Programa } from "../../../../typings";

type Data = {
  jornada: Jornada[];
  programa: Programa[];
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
    const { SubSede } = req.query;

    const [ProgramaRes]: any = await connectionPool.query(
      `SELECT pro_id as Id,pro_nom as Nombre,pro_sigla as Sigla,periodicidad as Periodisidad FROM pfc_programa ${
        SubSede && SubSede != "0"
          ? `where pfc_programa.subSedeId = '${SubSede}'`
          : ""
      }  ORDER BY pro_nom`
    );

    console.log("ProgramaRes", ProgramaRes);

    res.status(200).json({ programa: ProgramaRes } as Data);
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
