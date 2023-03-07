import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";

type Data = {
  // remove
  message: string;
};

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "DELETE") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const { id } = req.body;

    const [DocenteDelete]: any = await connectionPool.query(`
    DELETE FROM parametros_pruebas WHERE id = ${id}
    `);
    if (DocenteDelete.affectedRows === 0) {
      res.status(400).json({ body: "No se pudo eliminar la prueba" });
      return;
    }
    const [UsuarioDelete]: any = await connectionPool.query(`
    DELETE FROM asignacionPrueba WHERE prueba = ${id}
    `);
    if (UsuarioDelete.affectedRows === 0) {
      res.status(400).json({ body: "No se pudo eliminar la asignación" });
      return;
    }
    res.status(200).json({ body: "Se elimino correctamente" });
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
