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
    const {
      Password,
      Nombre,
      Apellidos,
      Email,
      Telefono,
      TipoDocumento,
      NumeroDocumento,
      Programa,
      Semestre,
      IdSubSede,
      GrupoDestino,
      Id,
    } = req?.body?.Values;

    const [UpdateAlumno]: any = await connectionPool.query(`
    UPDATE pfc_alumno SET tipo_docu_id='${TipoDocumento}', alumno_num_docu='${NumeroDocumento}', alumno_ape1='${Apellidos?.split(
      " "
    )[0]?.toUpperCase()}', alumno_ape2='${
      Apellidos?.split(" ")[1]?.toUpperCase() || ""
    }', alumno_nom1='${Nombre?.split(" ")[0]?.toUpperCase()}', alumno_nom2='${
      Nombre?.split(" ")[1]?.toUpperCase() || ""
    }', alumno_celular='${Telefono}', alumno_email='${Email}' WHERE alumno_id='${Id}'
    `);

    if (UpdateAlumno?.affectedRows === 0) {
      res.status(400).json({ body: "No se pudo actualizar el estudiante" });
    }

    const [UpdateMatricula]: any = await connectionPool.query(`
    UPDATE pfc_matricula SET GrupoMatriculadoId='${GrupoDestino}', subSedeId='${IdSubSede}', programa='${Programa}', semestre='${Semestre}' WHERE alumno_id='${Id}'
    `);

    if (UpdateMatricula?.affectedRows === 0) {
      res.status(400).json({ body: "No se pudo actualizar la matricula" });
    }

    const [Matricula]: any = await connectionPool.query(`
    SELECT matri_id as IdMatricula FROM pfc_matricula WHERE alumno_id=1
    `);

    const [UpdateUsuario]: any = await connectionPool.query(
      `UPDATE usuario SET pass='${Password}', subsede='${IdSubSede}' WHERE idUsuario='${Id}' and rol=3`
    );
    if (UpdateUsuario?.affectedRows === 0) {
      res.status(400).json({ body: "las credenciales del usuario" });
    }

    res.status(200).json({ body: "Estudiante actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
