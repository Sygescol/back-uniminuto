// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../config/db";

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
    const { Id, NombreModulo } = req.body;

    const [updateSubModulo]: any = await connectionPool.query(`
    UPDATE NewModulosSygescol SET mod_nombre = '${NombreModulo?.toUpperCase()}' WHERE mod_id = ${Id}`);

    if (updateSubModulo.affectedRows === 0) {
      res.status(400).json({ body: "No se pudo editar" });
      return;
    }
    res.status(200).json({ body: "Se editó correctamente" });
  } catch (error) {
    res.status(500).json({ body: "Internal Server Error" });
    return;
  }
}
