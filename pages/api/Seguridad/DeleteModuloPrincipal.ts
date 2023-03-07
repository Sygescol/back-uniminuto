import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../config/db";

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
    console.log(id);

    const [ModuloDelate]: any = await connectionPool.query(`
    DELETE FROM NewModulosSygescol WHERE mod_id = ${id}
    `);

    if (ModuloDelate.affectedRows === 0) {
      res.status(400).json({ body: "No se pudo eliminar " });
      return;
    }
    const [PermisosUsuario]: any = await connectionPool.query(`
    DELETE FROM ModulosPerfilAcceso WHERE mod_id = ${id}
    `);

    if (PermisosUsuario.affectedRows === 0) {
      res
        .status(400)
        .json({ body: "No se encontraron usuarios con ese módulo" });
      return;
    }
    res.status(200).json({ body: "Se elimino correctamente" });
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
