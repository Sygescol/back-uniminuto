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
    const { SubSede, IdUser, IdPrueba } = req.query;

    const [PruebasResult]: any = await connectionPool.query(
      `SELECT parametros_pruebas.subSedeId as CoaId, parametros_pruebas.tipo as TipoPrueba, parametros_pruebas.semestre  as Semestre,pfc_programa.pro_id as IdPrograma, pfc_programa.pro_nom as NombrePrograma, parametros_pruebas.DateDocentesInicio , parametros_pruebas.DateDocentesFin, pfc_ejes.eje_id as IdCompetencia, pfc_ejes.eje_nom as CompetenciaNombre,parametros_pruebas.id as PruebasId FROM parametros_pruebas INNER JOIN asignacionPrueba ON (parametros_pruebas.id=asignacionPrueba.prueba) INNER JOIN pfc_ejes ON(pfc_ejes.eje_id=asignacionPrueba.competencia) INNER JOIN pfc_programa ON (pfc_programa.pro_id=parametros_pruebas.programa) WHERE parametros_pruebas.subSedeId='${SubSede}' and asignacionPrueba.docente='${IdUser}' ${
        IdPrueba && `AND parametros_pruebas.id='${IdPrueba}'`
      }`
    );

    let newDataFormated = PruebasResult?.reduce((acc: any, prueba: any) => {
      const key = prueba.PruebasId;
      if (!acc[key]) {
        acc[key] = prueba;
      }
      return acc;
    }, {});

    const Pruebas: any = Object.values(newDataFormated)?.filter(
      (prueba: any) => {
        const {
          CoaId,
          TipoPrueba,
          Semestre,
          IdPrograma,
          NombrePrograma,
          DateDocentesInicio,
          DateDocentesFin,
          IdCompetencia,
          CompetenciaNombre,
          PruebasId,
        } = prueba;

        // convert DateDocentesInicios a milisigundos para comparar
        const DateDocentesInicioMilisegundos = new Date(
          DateDocentesInicio
        ).getTime();
        const DateDocentesFinMilisegundos = new Date(DateDocentesFin).getTime();

        // convertir fecha actual a milisegundos
        const DateNowMilisegundos = new Date().getTime();

        // comparar fechas

        const isDateDocentesInicio =
          DateNowMilisegundos >= DateDocentesInicioMilisegundos;
        const isDateDocentesFin =
          DateNowMilisegundos <= DateDocentesFinMilisegundos;

        const isDateDocentes = isDateDocentesInicio && isDateDocentesFin;

        if (isDateDocentes) {
          return {
            prueba,
          };
        }
      }
    );

    res.status(200).json({ pruebas: Pruebas || [] } as Data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
