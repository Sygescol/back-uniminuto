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
    const { SubSede } = req.query;

    const [ValidarSiHayAlumnos]: any = await connectionPool.query(
      `select max(id) as Cantidad from usuario`
    );

    if (ValidarSiHayAlumnos[0].Cantidad === 0) {
      res.status(400).json({ body: "No hay estudiantes para eliminar" });
      return;
    }

    const [DeleteUsuarios]: any = await connectionPool.query(`
    delete FROM usuario WHERE rol=3 and subsede='${SubSede}'
    `);
    if (DeleteUsuarios.affectedRows === 0) {
      res.status(400).json({
        body: "No se pudo eliminar los estudiantes contacte con soporte",
      });
      return;
    }

    const [deleteAlumnosMatriculados]: any = await connectionPool.query(`
    delete pfc_alumno,pfc_matricula from pfc_alumno inner join pfc_matricula on pfc_alumno.alumno_id=pfc_matricula.alumno_id where pfc_matricula.subSedeId='${SubSede}'
    `);

    res.status(200).json({ body: "Se borro los estudiantes" });
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
