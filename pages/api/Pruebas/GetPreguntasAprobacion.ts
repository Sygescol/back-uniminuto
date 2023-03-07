import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../config/db";

type Data = {
  preguntas: [];
  retroalimentacion: [];
};

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
      Values: {
        IdSubSede,
        Programa,
        Periodicidad,
        SemestreAcademico,
        SemestreLectivo,
        TipoPrueba,
        IdPrueba,
      },
    } = req.body;

    console.log(`SELECT preguntas_pruebas.*,preguntas_pruebas.tipo as TipoPreguntas,parametros_pruebas.tipo,parametros_pruebas.semestre,parametros_pruebas.DateDocentesInicio,parametros_pruebas.DateDocentesFin,pfc_ejes.eje_tip as CompetenciaTipo,pfc_ejes.eje_nom as NombreCompetencia, subSedes.nombre as NombreSede , pfc_programa.pro_id as ProgramaId, pfc_programa.pro_nom as NombrePrograma,preguntas_pruebas.IdDocente FROM preguntas_pruebas INNER JOIN pfc_ejes ON (pfc_ejes.eje_id=preguntas_pruebas.competencia) INNER JOIN parametros_pruebas ON (parametros_pruebas.id = preguntas_pruebas.prueba) INNER JOIN subSedes on subSedes.id=parametros_pruebas.subSedeId INNER JOIN pfc_programa ON pfc_programa.pro_id=parametros_pruebas.programa WHERE parametros_pruebas.subSedeId='${IdSubSede}' AND parametros_pruebas.tipo='${TipoPrueba}' AND parametros_pruebas.programa='${Programa}' AND parametros_pruebas.semestre='${SemestreAcademico}' and preguntas_pruebas.aprobo = '0'  and parametros_pruebas.id='${IdPrueba}' order by preguntas_pruebas.id,preguntas_pruebas.tipo,preguntas_pruebas.padre
    `);

    const [GetPreguntasAprobacion]: any =
      await connectionPool.query(`SELECT preguntas_pruebas.*,preguntas_pruebas.tipo as TipoPreguntas,parametros_pruebas.tipo,parametros_pruebas.semestre,parametros_pruebas.DateDocentesInicio,parametros_pruebas.DateDocentesFin,pfc_ejes.eje_tip as CompetenciaTipo,pfc_ejes.eje_nom as NombreCompetencia, subSedes.nombre as NombreSede , pfc_programa.pro_id as ProgramaId, pfc_programa.pro_nom as NombrePrograma,preguntas_pruebas.IdDocente FROM preguntas_pruebas INNER JOIN pfc_ejes ON (pfc_ejes.eje_id=preguntas_pruebas.competencia) INNER JOIN parametros_pruebas ON (parametros_pruebas.id = preguntas_pruebas.prueba) INNER JOIN subSedes on subSedes.id=parametros_pruebas.subSedeId INNER JOIN pfc_programa ON pfc_programa.pro_id=parametros_pruebas.programa WHERE parametros_pruebas.subSedeId='${IdSubSede}' AND parametros_pruebas.tipo='${TipoPrueba}' AND parametros_pruebas.programa='${Programa}' AND parametros_pruebas.semestre='${SemestreAcademico}' and preguntas_pruebas.aprobo = '0'  and parametros_pruebas.id='${IdPrueba}' order by preguntas_pruebas.id,preguntas_pruebas.tipo,preguntas_pruebas.padre
    `);

    let newData: any[] = [];

    for (const item of GetPreguntasAprobacion) {
      if (item.TipoPreguntas == 3) {
        newData.push({
          ...item,
          Preguntas: [],
        });
      } else {
        if (item.TipoPreguntas != 100) {
          newData.push({
            ...item,
          });
        }

        if (item.TipoPreguntas == 100) {
          const keyIndex = newData?.findIndex((x) => x.id == item.padre);
          newData[keyIndex]?.Preguntas?.push({
            ...item,
          });
        }
      }
    }

    const [GetRetroAlimentacion]: any = await connectionPool.query(
      `SELECT * FROM retroalimentacionPregunta`
    );
    res.status(200).json({
      preguntas: newData,
      retroalimentacion: GetRetroAlimentacion,
    } as Data);
  } catch (error) {
    console.log(error);

    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
