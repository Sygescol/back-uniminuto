import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";

type Data = {
  Preguntas: [];
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
    const { Coa, Tipo } = req.query;

    console.log(`
    SELECT preguntas_pruebas.id as PreguntaId,preguntas_pruebas.pregunta as Pregunta,preguntas_pruebas.opciones as opciones,preguntas_pruebas.respuesta ,subSedes.nombre as NombreCoa, pfc_programa.pro_nom as NombrePrograma,parametros_pruebas.tipo as Tipo,preguntas_pruebas.tipo as TipoPregunta,pfc_ejes.eje_id as IdCompetencia, pfc_ejes.eje_nom as NombreCompetencia,preguntas_pruebas.padre  FROM preguntas_pruebas INNER JOIN parametros_pruebas ON (parametros_pruebas.id=preguntas_pruebas.prueba) INNER JOIN subSedes ON (subSedes.id=parametros_pruebas.subSedeId) INNER JOIN pfc_programa ON (pfc_programa.pro_id= parametros_pruebas.programa) INNER JOIN pfc_ejes ON pfc_ejes.eje_id=preguntas_pruebas.competencia where parametros_pruebas.subSedeId='${Coa}' and parametros_pruebas.tipo='${Tipo}' AND preguntas_pruebas.aprobo='2'
    `);

    const [Preguntas]: any = await connectionPool.query(`
    SELECT preguntas_pruebas.id as PreguntaId,preguntas_pruebas.pregunta as Pregunta,preguntas_pruebas.opciones as opciones,preguntas_pruebas.respuesta ,subSedes.nombre as NombreCoa, pfc_programa.pro_nom as NombrePrograma,parametros_pruebas.tipo as Tipo,preguntas_pruebas.tipo as TipoPregunta,pfc_ejes.eje_id as IdCompetencia, pfc_ejes.eje_nom as NombreCompetencia,preguntas_pruebas.padre,pfc_ejes.eje_tip as TipoCompetencia FROM preguntas_pruebas INNER JOIN parametros_pruebas ON (parametros_pruebas.id=preguntas_pruebas.prueba) INNER JOIN subSedes ON (subSedes.id=parametros_pruebas.subSedeId) INNER JOIN pfc_programa ON (pfc_programa.pro_id= parametros_pruebas.programa) INNER JOIN pfc_ejes ON pfc_ejes.eje_id=preguntas_pruebas.competencia  where parametros_pruebas.subSedeId='${Coa}' and parametros_pruebas.tipo='${Tipo}' AND preguntas_pruebas.aprobo='2'
    `);

    let newData: any[] = [];

    for (const item of Preguntas) {
      if (item.TipoPregunta == 3) {
        newData.push({
          ...item,
          Preguntas: [],
        });
      } else {
        if (item.TipoPregunta != 100) {
          newData.push({
            ...item,
          });
        }

        if (item.TipoPregunta == 100) {
          const keyIndex = newData?.findIndex(
            (x) => x.PreguntaId == item.padre
          );
          newData[keyIndex]?.Preguntas?.push({
            ...item,
          });
        }
      }
    }

    const newArrayPreguntas = newData?.reduce((acc: any, item: any) => {
      let key = `${item.NombrePrograma}-${item.TipoCompetencia}`;

      if (!acc[key]) {
        acc[key] = {
          NombrePrograma: item.NombrePrograma,
          NombreCoa: item.NombreCoa,
          NombreCompetencia: item.NombreCompetencia,
          TipoPrueba: item.Tipo,
          TipoPregunta: item.TipoPregunta,
          TipoCompetencia: item.TipoCompetencia,
          id: item.PreguntaId,
          Preguntas: [],
        };
      }

      acc[key].Preguntas.push({
        ...item,
      });
      return acc;
    }, {});

    console.log(newArrayPreguntas);

    res
      .status(200)
      .json({ Preguntas: Object.values(newArrayPreguntas) || [] } as Data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
