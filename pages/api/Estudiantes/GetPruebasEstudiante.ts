import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../config/db";

type Data = {
  pruebas: [];
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
    const { SubSede, IdRol, IdUser, Doc } = req.query;

    if (IdRol == "3") {
      const [InfoMatriculaEstudiante]: any = await connectionPool.query(
        `SELECT programa,semestre FROM pfc_matricula WHERE alumno_id='${IdUser}' and subSedeId='${SubSede}'`
      );

      if (InfoMatriculaEstudiante?.length == 1) {
        const { programa, semestre } = InfoMatriculaEstudiante[0];

        const [PruebasResult]: any = await connectionPool.query(
          `SELECT parametros_pruebas.tipo,parametros_pruebas.DateEstudiantesInicio,parametros_pruebas.DateEstudiantesFin, pfc_programa.pro_nom as NombrePrograma,parametros_pruebas.id as IdPrueba FROM parametros_pruebas INNER JOIN pfc_programa ON pfc_programa.pro_id=parametros_pruebas.programa WHERE parametros_pruebas.programa='${programa}' and parametros_pruebas.semestre='${semestre}' and parametros_pruebas.subSedeId='${SubSede}'`
        );

        const Pruebas: [] = PruebasResult?.filter((prueba: any) => {
          const {
            tipo,
            NombrePrograma,
            Semestre,
            IdPrueba,
            DateEstudiantesInicio,
            DateEstudiantesFin,
          } = prueba;

          // convert DateDocentesInicios a milisigundos para comparar
          const DateEstudiantesInicioMilisegundos = new Date(
            DateEstudiantesInicio
          ).getTime();
          const DateEstudiantesFinMilisegundos = new Date(
            DateEstudiantesFin
          ).getTime();

          // convertir fecha actual a milisegundos
          const DateNowMilisegundos = new Date().getTime();

          // comparar fechas

          const isDateEstudiantesInicio =
            DateNowMilisegundos >= DateEstudiantesInicioMilisegundos;
          const isDateEstudiantesFin =
            DateNowMilisegundos <= DateEstudiantesFinMilisegundos;

          const isEstudiantesDocentes =
            isDateEstudiantesInicio && isDateEstudiantesFin;

          if (isEstudiantesDocentes) {
            return {
              prueba,
            };
          }
        });

        res.status(200).json({ pruebas: Pruebas || [] });
      }
    } else {
      res.status(200).json({ pruebas: [] });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
