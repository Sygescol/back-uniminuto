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
    const { PruebaID } = req.query;

    // console.log(`
    // SELECT preguntas_pruebas.id as PreguntaId,preguntas_pruebas.tipo as TipoPregunta,preguntas_pruebas.padre,pfc_ejes.eje_id idCompetencia, pfc_ejes.eje_nom CompetenciaNombre,pregunta,opciones,punto,pfc_ejes.eje_tip as TipoCompetencia,preguntas_pruebas.respuesta,preguntas_pruebas.prueba as IdPrueba FROM preguntas_pruebas INNER JOIN pfc_ejes ON pfc_ejes.eje_id=preguntas_pruebas.competencia WHERE preguntas_pruebas.prueba='${PruebaID}' and preguntas_pruebas.aprobo=2 ORDER BY RAND() ASC
    // `);

    const [competenciasRes]: any = await connectionPool.query(`
    SELECT preguntas_pruebas.id as PreguntaId,preguntas_pruebas.tipo as TipoPregunta,preguntas_pruebas.padre,pfc_ejes.eje_id idCompetencia, pfc_ejes.eje_nom CompetenciaNombre,pregunta,opciones,punto,pfc_ejes.eje_tip as TipoCompetencia,preguntas_pruebas.respuesta,preguntas_pruebas.prueba as IdPrueba FROM preguntas_pruebas INNER JOIN pfc_ejes ON pfc_ejes.eje_id=preguntas_pruebas.competencia WHERE preguntas_pruebas.prueba='${PruebaID}' and preguntas_pruebas.aprobo=2 ORDER BY TipoCompetencia,RAND() desc
    `);

    let newData: any[] = [];

    for (const item of competenciasRes) {
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

    let Preguntas = newData?.reduce((acc: any, item: any) => {
      let key = `${item.TipoCompetencia}-${item.CompetenciaNombre}`;
      if (!acc[key]) {
        acc[key] = {
          TipoCompetencia: item.TipoCompetencia,
          CompetenciaNombre: item.CompetenciaNombre,
          Preguntas: [],
        };
      }
      acc[key].Preguntas.push(item);
      return acc;
    }, {});

    console.log("Preguntas", Preguntas);

    res.status(200).json({
      Preguntas: Object.values(Preguntas) || [],
    } as Data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
