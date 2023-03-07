import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../../config/db";
type Data = {
  Religion: number;
  Documento: number;
};

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  const { Documento, Religion } = req.body;
  if (req.method !== "POST") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const [UPDATE] = await connectionPool.query(
      `UPDATE inscripciones SET religion_estudiante = '${Religion}' WHERE alumno_num_docu = '${Documento}'`
    );
    const [guarda]: any = await connectionPool.query(`
    SELECT id FROM guardar_seccion_formulario WHERE alumno_num_docu = '${Documento}' AND seccion_guardada = 'RELIGION'
    `);
    if (!guarda.length) {
      const [ingresa] = await connectionPool.query(
        `INSERT INTO guardar_seccion_formulario(alumno_num_docu,guardado,seccion_guardada) VALUES('${Documento}',1,'RELIGION')`
      );
    }
    res.status(200).json({ body: "Información Cargada Con Exitó" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
