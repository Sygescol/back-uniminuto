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
    const { Pregunta, idPregunta, idPrueba, idDocente, TipoPreguntas } =
      req.body;

    if (TipoPreguntas == 3) {
      const [UpdateAprobacionPrueba]: any = await connectionPool.query(
        `UPDATE preguntas_pruebas SET aprobo = '2',pregunta = '${Pregunta}' WHERE id = '${idPregunta}'`
      );
      const [UpdateSubPreguntas]: any = await connectionPool.query(
        `UPDATE preguntas_pruebas SET aprobo = '2' WHERE padre = '${idPregunta}'`
      );
    } else {
      const [UpdateAprobacionPrueba]: any = await connectionPool.query(
        `UPDATE preguntas_pruebas SET aprobo = '2',pregunta = '${Pregunta}' WHERE id = '${idPregunta}'`
      );
    }

    res.status(200).json({
      body: "Pregunta aprobada correctamente",
    } as Data);
  } catch (error) {
    console.log(error);

    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
