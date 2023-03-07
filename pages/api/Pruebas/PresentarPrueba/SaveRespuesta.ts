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
  if (req.method !== "POST") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const { Pregunta, Respuesta, Prueba, IdEstudiante } = req.body;

    const [IdMatricula]: any = await connectionPool.query(
      `select pfc_matricula.matri_id as MatriculaEstudiante FROM pfc_matricula INNER JOIN pfc_alumno ON pfc_alumno.alumno_id=pfc_matricula.alumno_id WHERE pfc_alumno.alumno_id='${IdEstudiante}'`
    );

    const [SaveRespuesta]: any = await connectionPool.query(`
    insert into respuestas_estudiante (estudiante,prueba,pregunta,respuesta) values ('${IdMatricula[0].MatriculaEstudiante}','${Prueba}','${Pregunta}','${Respuesta}')
    `);

    res.status(200).json({ body: "Pregunta Guardada" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
