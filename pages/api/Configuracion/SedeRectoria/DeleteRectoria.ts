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
    const [DeleteRectoria]: any = await connectionPool.query(`
    DELETE FROM rectorias WHERE id = '${id}'
    `);
    if (DeleteRectoria.affectedRows === 0) {
      res.status(400).json({ body: "No se pudo eliminar la rectoria" });
      return;
    }

    const [VerificarSedes]: any = await connectionPool.query(
      `SELECT id FROM subSedes WHERE idSede = '${id}' `
    );

    if (VerificarSedes?.length > 0) {
      for (const item of VerificarSedes) {
        const [DeleteUsuarios]: any = await connectionPool.query(`
        DELETE FROM usuario WHERE subsede = '${item.id}'`);
      }
    }
    const [DeleteSede]: any = await connectionPool.query(`
    DELETE FROM sedes WHERE idRectoria = '${id}'`);

    if (DeleteSede?.affectedRows === 0) {
      res.status(400).json({
        body: "No se pudo realizar la eliminación de las sedes debido a la falta de sedes vinculadas.",
      });
      return;
    }

    res.status(200).json({ body: "Se elimino correctamente" });
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
