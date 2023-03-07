import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../config/db";

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
    const { Pass, Id } = req?.body;

    const [PfcAlumno]: any = await connectionPool.query(`
    UPDATE usuario SET pass= '${Pass}', ChangePass=1 WHERE idUsuario = ${Id} 
    `);

    if (PfcAlumno?.affectedRows === 0) {
      res.status(400).json({ body: "No se pudo actualizar la contraseña" });
      return;
    }

    res.status(200).json({ body: "Contraseña actualizada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
