import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";

type Data = {
  informacion: [];
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
    const { competencia, prueba, IdUser } = req.body;

    console.log(req.body);

    // console.log(
    //   `SELECT preguntas_pruebas.id as Id,preguntas_pruebas.tipo as TipoPregunta,preguntas_pruebas.padre, preguntas_pruebas.pregunta as Pregunta,preguntas_pruebas.opciones,preguntas_pruebas.respuesta,preguntas_pruebas.punto, preguntas_pruebas.aprobo FROM preguntas_pruebas  INNER JOIN asignacionPrueba ON asignacionPrueba.prueba=preguntas_pruebas.prueba WHERE asignacionPrueba.docente='${IdUser}' AND asignacionPrueba.prueba='${prueba}' and asignacionPrueba.competencia='${competencia}'`
    // );

    const [informacion]: any = await connectionPool.query(
      `SELECT preguntas_pruebas.id as Id,preguntas_pruebas.tipo as TipoPregunta,preguntas_pruebas.padre, preguntas_pruebas.pregunta as Pregunta,preguntas_pruebas.opciones,preguntas_pruebas.respuesta,preguntas_pruebas.punto, preguntas_pruebas.aprobo FROM preguntas_pruebas  INNER JOIN asignacionPrueba ON asignacionPrueba.prueba=preguntas_pruebas.prueba WHERE asignacionPrueba.docente='${IdUser}' AND asignacionPrueba.prueba='${prueba}' and asignacionPrueba.competencia='${competencia}'`
    );
    const [retro]: any = await connectionPool.query("SELECT * FROM retroalimentacionPregunta")
    let newData: any[] = [];

    for (const item of informacion) {
      if (item.TipoPregunta == 3) {
        newData.push({
          ...item,
          Preguntas: [],
        });
      } else {
        if (item.TipoPregunta != 100) {
          newData.push({
            ...item,
            retro: retro.filter((ret: any) => ret.pregunta == item.Id)
          });
        }

        if (item.TipoPregunta == 100) {
          const keyIndex = newData?.findIndex((x) => x.Id == item.padre);
          newData[keyIndex]?.Preguntas?.push({
            ...item,
            retro: retro.filter((ret: any) => ret.pregunta == item.Id)
          });
        }
      }
    }

    return res.status(200).json({ informacion: newData } as Data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
