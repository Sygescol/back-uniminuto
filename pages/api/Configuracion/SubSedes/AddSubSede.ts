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
    const { RectoriaSelected, SedeRectoriaSelected, NombreCoa, id } = req.body;

    // verificar existencia de la sede
    const [SedeExist]: any = await connectionPool.query(`
      SELECT id FROM subSedes WHERE nombre = '${NombreCoa}'
    `);

    if (SedeExist.length > 0) {
      res.status(200).json({ body: "La sede ya existe" });
      return;
    }

    const [AddSubSede]: any = await connectionPool.query(`
      INSERT INTO subSedes ( nombre, idSede,id) VALUES ( '${NombreCoa}', '${SedeRectoriaSelected}', '${id}')`);

    const [AddUniversidad]: any = await connectionPool.query(
      `INSERT INTO datosUniversidad (idCoa,nombreUniversidad,siglaUniversidad) values ('${id}','${NombreCoa}','UNIMINUTO')`
    );

    if (AddSubSede.affectedRows === 0) {
      res.status(500).json({ body: "No se puedo agregar el COA" } as ErrorData);
    }

    res.status(200).json({ body: "COA agregada con éxito." } as Data);
  } catch (error) {
    console.log(error);

    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
