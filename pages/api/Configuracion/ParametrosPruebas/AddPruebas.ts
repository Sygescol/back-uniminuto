import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";

type Data = {};

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "POST") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const {
      Fechas,
      Values: {
        TipoPrueba,
        CompetenciasGenericas,
        CompetenciasEspecificas,
        Programa,
        IdSubSede,
        SemestreAcademico,
      },
    } = req.body;

    console.log("xd:", req.body?.Values?.CompetenciasGenericas);

    let sqlParametrosPruebasBase = `INSERT INTO parametros_pruebas (subSedeId,tipo,semestre,programa,DateDocentesInicio,DateDocentesFin,DateEstudiantesInicio,DateEstudiantesFin) VALUES `;

    let sqlAsignacionPruebaBase = `INSERT INTO asignacionPrueba (competencia,docente,prueba) VALUES`;

    let NotificationDocente = `INSERT INTO notifications (user_id,message,date_range_start,date_range_end,Rol,Link) VALUES`;
    if (TipoPrueba === "SP") {
      sqlParametrosPruebasBase += `('${IdSubSede}','SP', '${SemestreAcademico}', '${Programa}','${Fechas?.Docentes?.Inicio?.substring(
        0,
        10
      )}', '${Fechas?.Docentes?.Fin?.substring(
        0,
        10
      )}','${Fechas?.Estudiantes?.Inicio?.substring(
        0,
        10
      )}','${Fechas?.Estudiantes?.Fin?.substring(0, 10)}')`;
    } else {
      // sqlParametrosPruebasBase += `('SS', '${SemestreId}', '${InicioPrueba}', '${FinPrueba}','${Programa}','${IdSubSede}')`;
    }

    console.log(sqlParametrosPruebasBase);

    const [AddParametrosPruebas]: any = await connectionPool.query(
      `${sqlParametrosPruebasBase}`
    );

    if (CompetenciasGenericas?.length) {
      CompetenciasGenericas?.forEach((item: any) => {
        sqlAsignacionPruebaBase += `('${item?.IdAsignatura}','${
          item?.DocenteId || ""
        }','${AddParametrosPruebas?.insertId}'),`;

        NotificationDocente += `  ('${
          item?.DocenteId
        }','Se le ha asignado subir preguntas para las competencia <span style="color: #584ed0;"> ${
          item?.NombreAsignatura
        } </span> .','${Fechas?.Docentes?.Inicio?.substring(
          0,
          10
        )}','${Fechas?.Docentes?.Fin?.substring(
          0,
          10
        )}',2,'/Pruebas/IngresoPreguntas?SubSede=${IdSubSede}&IdRol=2&IdUser=${
          item?.DocenteId
        }&IdPrueba=${AddParametrosPruebas?.insertId}'),`;
      });
    }
    if (CompetenciasEspecificas?.length) {
      CompetenciasEspecificas?.forEach((item: any) => {
        sqlAsignacionPruebaBase += `('${item?.IdAsignatura}','${
          item?.DocenteId || ""
        }','${AddParametrosPruebas?.insertId}'),`;
        NotificationDocente += `  ('${
          item?.DocenteId
        }','Se le ha asignado subir preguntas para las competencia <span style="color: #584ed0;"> ${
          item?.NombreAsignatura
        } </span> .','${Fechas?.Docentes?.Inicio?.substring(
          0,
          10
        )}','${Fechas?.Docentes?.Fin?.substring(
          0,
          10
        )}',2,'/Pruebas/IngresoPreguntas?SubSede=${IdSubSede}&IdRol=2&IdUser=${
          item?.DocenteId
        }&IdPrueba=${AddParametrosPruebas?.insertId}'),`;
      });
    }

    // recortar sqlAsignacionPruebaBase el ultimo elemento
    sqlAsignacionPruebaBase = sqlAsignacionPruebaBase.substring(
      0,
      sqlAsignacionPruebaBase?.length - 1
    );

    const [AddAsingnacionPrueba] = await connectionPool.query(
      `${sqlAsignacionPruebaBase}`
    );

    // recortar NotificationDocente el ultimo elemento
    NotificationDocente = NotificationDocente.substring(
      0,
      NotificationDocente?.length - 1
    );

    console.log("NotificationDocente", NotificationDocente);

    const [AddNotificationDocente] = await connectionPool.query(
      `${NotificationDocente}`
    );

    res.status(200).json({
      body: "La prueba ha sido agregada con éxito.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
