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

    console.log(id);

    const [VerificarSedes]: any = await connectionPool.query(
      `SELECT id FROM subSedes WHERE idSede = '${id}' `
    );

    if (VerificarSedes?.length > 0) {
      for (const item of VerificarSedes) {
        const [DeleteUsuarios]: any = await connectionPool.query(`
        DELETE FROM usuario WHERE subsede = '${item.id}'`);
      }
    }

    const [DeleteCOA]: any = await connectionPool.query(`
    DELETE FROM subSedes WHERE idSede = '${id}'`);

    // falta eiminanar
    const [DeleteSede]: any = await connectionPool.query(`
    DELETE FROM sedes WHERE id = '${id}'`);

    res.status(200).json({ body: "Se elimino correctamente" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
