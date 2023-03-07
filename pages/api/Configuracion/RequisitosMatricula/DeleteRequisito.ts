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
    DELETE FROM requisitos_matricula WHERE rm_id = ${id}
    `);
    if (AdministrativoDelete.affectedRows === 0) {
      res.status(400).json({ body: "No se pudo eliminar el Requisito" });
      return;
    }

    res.status(200).json({ message: "Se elimino correctamente" });
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
