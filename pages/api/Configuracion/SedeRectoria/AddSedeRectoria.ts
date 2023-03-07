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
    const { TipoAdd, NombreRectoria, RectoriaSedeId, NombreSede } = req.body;

    if (TipoAdd === 2) {
      // verificar existencia
      const [ExistenciaRectoria]: any = await connectionPool.query(`
        SELECT id as Id FROM rectorias WHERE nombre = '${NombreRectoria?.toUpperCase()}'
      `);

      if (ExistenciaRectoria?.length > 0) {
        res.status(400).json({ body: "Ya existe una rectoria con ese nombre" });
        return;
      }

      // agregar rectoria
      const [AddRectoria]: any = await connectionPool.query(`
        INSERT INTO rectorias (nombre) VALUES ('${NombreRectoria?.toUpperCase()}')`);

      if (AddRectoria?.affectedRows === 0) {
        res.status(400).json({ body: "No se pudo agregar la rectoría" });
        return;
      } else {
        res.status(200).json({ body: "Rectoría agregada correctamente" });
        return;
      }
    }

    if (TipoAdd === 1) {
      // verificar existencia
      const [ExistensiaSede]: any = await connectionPool.query(`
            SELECT id as Id FROM sedes WHERE nombreSede = '${NombreRectoria?.toUpperCase()}'
        `);
      if (ExistensiaSede?.length > 0) {
        res.status(400).json({ body: "Ya existe una sede con ese nombre" });
        return;
      }

      // agregar sede
      const [AddSede]: any = await connectionPool.query(`
            INSERT INTO sedes (nombreSede,idRectoria) VALUES ('${NombreSede?.toUpperCase()}','${RectoriaSedeId}')`);

      if (AddSede?.affectedRows === 0) {
        res.status(400).json({ body: "No se pudo agregar la sede" });
        return;
      } else {
        res.status(200).json({ body: "Sede agregada correctamente" });
        return;
      }
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
