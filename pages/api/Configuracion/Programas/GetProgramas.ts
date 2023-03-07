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
    const { SubSede } = req.query;

    const [ProgramasRes]: any = await connectionPool.query(
      `SELECT pfc_programa.pro_id as Id,pfc_programa.pro_nom as Nombre,pfc_programa.pro_sigla as Sigla, subSedes.nombre as SubSede,pfc_programa.periodicidad as Periodicidad FROM pfc_programa INNER JOIN subSedes on subSedes.id=pfc_programa.subSedeId ${
        SubSede && SubSede != "0" ? `where subSedeId = '${SubSede}'` : ""
      }`
    );

    res.status(200).json({ programas: ProgramasRes } as Data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
