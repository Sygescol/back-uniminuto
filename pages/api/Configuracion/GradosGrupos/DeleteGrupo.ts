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

    console.log(req.body);

    const [Grupo]: any = await connectionPool.query(`
    DELETE FROM pfc_grupos WHERE pfc_grupo_id = ${id}
    `);
    // if (DeleteGrados.affectedRows === 0) {
    //   res.status(400).json({ body: "No se pudo eliminar el semestre" });
    //   return;
    // }
    // const [DeleteGrupos]: any = await connectionPool.query(`
    // DELETE FROM pfc_grupos WHERE pfc_grado_id = ${id}
    // `);
    // if (DeleteGrupos.affectedRows === 0) {
    //   res
    //     .status(400)
    //     .json({ body: "No se pudo eliminar los grupos correctamente" });
    //   return;
    // }
    res.status(200).json({ body: "Se elimino correctamente" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
