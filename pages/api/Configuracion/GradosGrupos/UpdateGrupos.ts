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
    const {
      Values: { Ubicacion },
      Id,
    } = req.body;

    const [UpdateGrupos]: any = await connectionPool.query(
      `UPDATE pfc_grupos SET pfc_grupo_ubi = '${Ubicacion?.toLowerCase()}' WHERE pfc_grupo_id=${Id}`
    );

    if (UpdateGrupos?.affectedRows === 0) {
      res.status(404).json({ body: "Error al actualizar grupo" });
      return;
    }

    res.status(200).json({ body: "Grupo Actualizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
