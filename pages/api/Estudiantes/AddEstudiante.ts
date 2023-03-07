import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../config/db";

type ErrorData = {
  body: string;
};

export default async function handlerAddDatos(
  req: NextApiRequest,
  res: NextApiResponse<ErrorData>
) {
  if (req.method !== "POST") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }

  try {
    const {
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
    } = req.body;

    console.log(req.body);

    const [ExistenciaAlumno]: any = await connectionPool.query(`
        SELECT * FROM pfc_alumno WHERE alumno_num_docu = ${NumeroDocumento}
    `);
    if (ExistenciaAlumno?.length > 0) {
      res
        .status(400)
        .json({ body: "El estudiante ya se encuentra en el sistema " });
      return;
    }

    const year = new Date().getFullYear();

    let Lectivo: string = "";
    const month = new Date().getMonth() + 1;
    if (month >= 6) {
      Lectivo = "B";
    } else {
      Lectivo = "A";
    }

    const [MaxIdAlumno]: any = await connectionPool.query(`
   SELECT MAX(alumno_id) AS MaxIdAlumno FROM pfc_alumno`);

    const [InsertAlumno]: any = await connectionPool.query(`
   INSERT INTO pfc_alumno (alumno_rum, tipo_docu_id, alumno_num_docu, alumno_ape1, alumno_ape2, alumno_nom1,alumno_nom2, alumno_celular, alumno_email) values  ('${
     MaxIdAlumno[0].MaxIdAlumno + 1
   }', '${TipoDocumento}', '${NumeroDocumento}', '${Apellidos?.split(
      " "
    )[0]?.toUpperCase()}', '${
      Apellidos?.split(" ")[1]?.toUpperCase() || ""
    }', '${Nombre?.split(" ")[0]?.toUpperCase()}', '${
      Nombre?.split(" ")[1]?.toUpperCase() || ""
    }', '${Telefono}', '${Email}')`);

    if (!InsertAlumno?.insertId) {
      res.status(400).json({ body: "Error al ingresar el estudiante" });
      return;
    }

    const [InsertMatricula]: any = await connectionPool.query(`
 INSERT INTO pfc_matricula (alumno_id, matri_anyo ,matri_fecha,programa, semestre, semes_lectivo, matri_nuevo, matri_estado,subSedeId,GrupoMatriculadoId) values  ('${InsertAlumno?.insertId}','${year}','CURDATE()','${Programa}','${Semestre}','${Lectivo}','N','0','${IdSubSede}','${GrupoDestino}')`);

    if (!InsertMatricula?.insertId) {
      res.status(400).json({ body: "Error al ingresar la matrícula" });
      return;
    }

    //     const [InsertMatriGrup]: any = await connectionPool.query(`
    //  INSERT INTO pfc_matr_grup (matri_id, pfc_grupo_id) values  ('${InsertMatricula?.insertId}','${GrupoDestino}')
    //  `);
    //     if (!InsertMatriGrup?.insertId) {
    //       res.status(400).json({ body: "Error al Asignar Grupo" });
    //       return;
    //     }

    const [InsertUsuario]: any = await connectionPool.query(`
 INSERT INTO usuario (login, pass, rol, tipo, idUsuario,subsede) values  ('${NumeroDocumento}','${NumeroDocumento}','3','ESTUDIANTE','${InsertAlumno?.insertId}','${IdSubSede}')`);

    if (!InsertUsuario?.insertId) {
      res.status(400).json({ body: "Error al ingresar el usuario" });
      return;
    }

    res.status(200).json({ body: "Estudiante Agregado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal Server Error" });
  }
}
