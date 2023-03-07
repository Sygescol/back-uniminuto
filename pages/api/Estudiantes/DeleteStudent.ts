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

    const [PfcAlumno]: any = await connectionPool.query(`
    DELETE FROM pfc_alumno WHERE alumno_id = ${id}
    `);

    if (PfcAlumno?.affectedRows === 0) {
      res.status(400).json({ body: "No se pudo eliminar el estudiante" });
      return;
    }
    const [IdMatricula]: any = await connectionPool.query(`
    sELECT matri_id as MatriId FROM pfc_matricula WHERE alumno_id =${id}`);

    if (IdMatricula.length === 0) {
      res.status(400).json({ body: "No se puedo eliminar el grupo" });
      return;
    }

    const [PfcGrupo]: any = await connectionPool.query(`
    DELETE FROM pfc_matr_grup WHERE matri_id = ${IdMatricula[0]?.MatriId}
    `);

    if (PfcGrupo?.affectedRows === 0) {
      res.status(400).json({ body: "No se pudo eliminar el grupo" });
      return;
    }

    const [PfcMatricula]: any = await connectionPool.query(`
    DELETE FROM pfc_matricula WHERE alumno_id = ${id}
    `);

    if (PfcMatricula?.affectedRows === 0) {
      res.status(400).json({ body: "No se pudo eliminar la Matrícula" });
      return;
    }

    const [UsuarioDelete]: any = await connectionPool.query(`
    DELETE FROM usuario WHERE usu_fk = ${id}
    `);
    if (UsuarioDelete?.affectedRows === 0) {
      res.status(400).json({ body: "No se pudo eliminar el usuario" });
      return;
    }

    res.status(200).json({ body: "Se elimino correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
