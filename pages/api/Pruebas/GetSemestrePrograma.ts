import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../config/db";
import { SemestreAcademico } from "../../../typings";

type Data = {
  semestres: SemestreAcademico[];
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

    const { SubSede } = req.query
    const { Values } = req.body;
    let Semestre: SemestreAcademico[] = [];
    console.log(Values)
    if (Values.TipoPrueba == "SP") {
      Semestre = [
        {
          Id: 1,
          Nombre: "Semestre I",
          Numero: "I",
        },
        {
          Id: 3,
          Nombre: "Semestre III",
          Numero: "III",
        },
        {
          Id: 6,
          Nombre: "Semestre VI",
          Numero: "VI",
        },
        {
          Id: 9,
          Nombre: "Semestre IX",
          Numero: "IX",
        },
      ];
    } else {
      const [SemestreRes]: any = await connectionPool.query(`
      SELECT sem_id as Id,sem_nom as Nombre FROM parametros_pruebas INNER JOIN pfc_semestre ON pfc_semestre.sem_id = parametros_pruebas.semestre WHERE tipo="SS" AND programa=${Values?.Programa} AND ${SubSede && `subSedeId = ${SubSede}` || "1=1"} ORDER BY sem_id

    `);
      // ordenar SemestreRes por Nombre de forma ascendente

      Semestre = SemestreRes;
    }

    res.status(200).json({ semestres: Semestre } as Data);
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
