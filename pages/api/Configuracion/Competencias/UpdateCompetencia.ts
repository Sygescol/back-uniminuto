import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorData>
) {
  if (req.method !== "PUT") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const { Id, Nombre, Abreviatura, TipoCompetencia, IdSubSede } = req.body;

    console.log(req.body);

    const [UpdateCompetencias]: any = await connectionPool.query(`
    UPDATE pfc_ejes SET eje_nom='${Nombre}', eje_abr='${Abreviatura}', subSedeId='${
      IdSubSede || ""
    }', eje_tip='${TipoCompetencia}' WHERE eje_id='${Id}'
    `);

    if (UpdateCompetencias?.affectedRows === 0) {
      res.status(404).json({ body: "Error al actualizar la competencia" });
      return;
    }

    res.status(200).json({ body: "Competencia Actualizada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
