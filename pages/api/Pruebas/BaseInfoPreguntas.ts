import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../config/db";

type Data = {
  puntos: number;
};

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  const { prueba, semestre, competencia } = req.body;
  if (req.method !== "POST") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const [max]: any = await connectionPool.query(
      "SELECT valor FROM criterios_evaluacion WHERE id = 1"
    );
    let puntos = max[0]?.valor;
    const [competencias]: any = await connectionPool.query(
      "SELECT eje_nom, eje_id FROM pfc_ejes"
    );
    const competenciaFind = competencias.filter((e: any) =>
      e.eje_nom.toLowerCase().includes(`${competencia.toLowerCase()}`)
    );
    const [preguntas]: any = await connectionPool.query(
      `SELECT punto FROM preguntas_pruebas WHERE competencia = ${
        competenciaFind[0]?.eje_id || ""
      } AND prueba = ${prueba}`
    );
    preguntas.map((e: any) => {
      console.log(`${parseInt(puntos)}- ${parseInt(e?.punto)}`);
      puntos = parseInt(puntos) - parseInt(e?.punto);
    });
    res.status(200).json({ puntos } as Data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
