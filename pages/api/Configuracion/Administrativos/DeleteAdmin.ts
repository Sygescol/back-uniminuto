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
    const [AdministrativoDelete]: any = await connectionPool.query(`
    DELETE FROM admco WHERE id = ${id}
    `);
    if (AdministrativoDelete.affectedRows === 0) {
      res.status(400).json({ body: "No se pudo eliminar el colaborador" });
      return;
    }
    const [UsuarioDelete]: any = await connectionPool.query(`
    DELETE FROM usuario WHERE idUsuario = ${id}
    `);
    if (UsuarioDelete.affectedRows === 0) {
      res
        .status(400)
        .json({ body: "No se pudo eliminar el usuario del colaborador" });
      return;
    }
    res.status(200).json({ body: "El se colaborador elimino correctamente" });
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
