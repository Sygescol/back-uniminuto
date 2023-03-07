import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../../config/db";
type Data = {
  info: [];
  save: [];
  conf: [];
  insc: [];
  jor: [];
};

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "GET") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const { num } = req.query;
    let Jornada = [];
    const [InfoSchool]: any = await connectionPool.query(
      `SELECT b AS Nombre, g AS Direccion, e AS Telefono1, n AS Telefono2 FROM clrp`
    );
    const [Year]: any = await connectionPool.query(`SELECT * FROM year`);
    const [Inscripcion]: any = await connectionPool.query(
      `SELECT alumno_ape1 AS Apellido1,alumno_ape2 AS Apellido2,alumno_barrio AS Barrio,alumno_nom1 AS Nombre1,alumno_nom2 AS Nombre2,alumno_num_docu AS DocumentoEstudiante,pro_nom AS Programa,jornada_id AS Jornada,sem_nom AS Semestre FROM inscripciones INNER JOIN pfc_programa ON pro_id = programa INNER JOIN pfc_semestre ON sem_id = semestre WHERE alumno_num_docu = '${num}'`
    );

    const [CupoAcceso]: any = await connectionPool.query(
      `SELECT * FROM cupos_acceso WHERE cupo_num_docu = ${num}`
    );
    if (Inscripcion?.length > 0) {
      const [JornadaSelect]: any = await connectionPool.query(`
      SELECT b AS Nombre FROM jraa where i=${CupoAcceso[0]?.cupo_jorna || ""}

      `);
      Jornada = JornadaSelect[0];
    } else {
      const [InserInscripcion]: any = await connectionPool.query(`
        INSERT INTO inscripciones (cupo_acceso_id,inscri_ano,inscri_fecha,programa,jornada_id,semestre,tipo_estudiante,tipo_docu_id,alumno_num_docu,alumno_ape1,alumno_ape2,alumno_nom1,alumno_nom2) VALUES ('${
          CupoAcceso[0]?.cupos_acceso_id
        }','${Year[0]?.b}',CURDATE(),'${CupoAcceso[0]?.cupo_programa || ""}','${
        CupoAcceso[0]?.cupo_jorna || ""
      }','${CupoAcceso[0]?.cupo_semestre || ""}','${
        CupoAcceso[0]?.tipo || ""
      }','${CupoAcceso[0]?.cupo_tip_docu || ""}','${
        CupoAcceso[0]?.cupo_num_docu
      }','${CupoAcceso[0]?.cupo_ape1 || ""}','${
        CupoAcceso[0]?.cupo_ape2 || ""
      }','${CupoAcceso[0]?.cupo_nom1 || ""}','${
        CupoAcceso[0]?.cupo_nom2 || ""
      }')
        `);

      const [Inscripcion]: any = await connectionPool.query(
        `SELECT alumno_ape1 AS Apellido1,alumno_ape2 AS Apellido2,alumno_barrio AS Barrio,alumno_nom1 AS Nombre1,alumno_nom2 AS Nombre2,alumno_num_docu AS DocumentoEstudiante,pro_nom AS Programa,jornada_id AS Jornada,sem_nom AS Semestre FROM inscripciones INNER JOIN pfc_programa ON pro_id = programa INNER JOIN pfc_semestre ON sem_id = semestre WHERE alumno_num_docu = ${num}`
      );

      // const [JornadaSelect2]: any = await connectionPool.query(`
      //     SELECT b AS Nombre FROM jraa where i=${
      //       CupoAcceso[0]?.cupo_jorna || ""
      //     }

      //     `);
      // Jornada = JornadaSelect2[0];
    }
    const [FormSave]: any = await connectionPool.query(`
          SELECT id AS Id, alumno_num_docu AS DocumentoEstudiante, guardado AS Guardado, seccion_guardada AS Seccion FROM guardar_seccion_formulario WHERE alumno_num_docu = ${num}
          `);
    const [ConfiguracionSinPae]: any = await connectionPool.query(
      `SELECT conf_valor AS Valor FROM conf_sygescol WHERE conf_id = 297`
    );
    res.status(200).json({
      info: InfoSchool[0] || {},
      save: FormSave || {},
      conf: ConfiguracionSinPae[0] || {},
      insc: Inscripcion[0] || {},
      jor: Jornada,
    } as Data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
