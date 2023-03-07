import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorData>
) {
  if (req.method !== "DELETE") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const { id } = req.body;

    const [DeleteGrados]: any = await connectionPool.query(`
    DELETE FROM subSedes WHERE id = '${id}'
    `);
    if (DeleteGrados.affectedRows === 0) {
      res.status(400).json({ body: "No se pudo eliminar el programa" });
      return;
    }

    const [DeleteUniversidad]: any = await connectionPool.query(`
    DELETE FROM datosUniversidad WHERE idCoa = '${id}'
    `);
    if (DeleteUniversidad.affectedRows === 0) {
      res
        .status(400)
        .json({ body: "No se pudo eliminar los datos de la universidad" });
      return;
    }

    // delete usuarios
    const [DeleteUsuarios]: any = await connectionPool.query(`
    DELETE FROM usuario WHERE subsede = '${id}'`);

    res.status(200).json({ body: "Se elimino correctamente" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
