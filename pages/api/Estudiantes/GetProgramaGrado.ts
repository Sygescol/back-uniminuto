import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../config/db";
import { Grupo } from "../../../typings";

type Data = {
  grupos: Grupo[];
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
    const { IdPrograma, IdSemestre } = req.query;

    const { SubSede } = req.query;

    const [GruposRes]: any = await connectionPool.query(
      `SELECT pfc_grupos.pfc_grupo_id as Id, pfc_grupos.pfc_grupo_nom as Nombre FROM pfc_grupos INNER JOIN pfc_grados on (pfc_grados.pfc_grado_id=pfc_grupos.pfc_grado_id) WHERE pfc_grados.pro_id=${IdPrograma} and pfc_grados.sem_id = ${IdSemestre} ORDER BY pfc_grupos.pfc_grupo_nom ASC
      `
    );

    res.status(200).json({ grupos: GruposRes || [] } as Data);
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
