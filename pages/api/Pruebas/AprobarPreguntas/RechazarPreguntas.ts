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

    console.log(req.body);

    if (TipoPreguntas == 3) {
      const [UpdateAprobacionPrueba]: any = await connectionPool.query(
        `UPDATE preguntas_pruebas SET aprobo = '1',pregunta = '${Pregunta}' WHERE id = '${idPregunta}'`
      );
      const [UpdateSubPreguntas]: any = await connectionPool.query(
        `UPDATE preguntas_pruebas SET aprobo = '1' WHERE padre = '${idPregunta}'`
      );
    } else {
      const [UpdateAprobacionPrueba]: any = await connectionPool.query(
        `UPDATE preguntas_pruebas SET aprobo = '1',pregunta = '${Pregunta}' WHERE id = '${idPregunta}'`
      );
    }

    const [DocenteAsignado]: any = await connectionPool.query(
      `SELECT preguntas_pruebas.IdDocente, parametros_pruebas.subSedeId FROM preguntas_pruebas INNER JOIN parametros_pruebas ON parametros_pruebas.id=preguntas_pruebas.prueba WHERE preguntas_pruebas.id='${idPregunta}'`
    );

    const [InsertNotificacion]: any = await connectionPool.query(`
    INSERT INTO notifications (Rol, user_id, message, Link) VALUES ('2', '${
      DocenteAsignado[0]?.IdDocente || 0
    }', 'Se ha devuelto una pregunta revise la bandeja de preguntas y debe encontrase con color amarillo', '/Pruebas/IngresoPreguntas?SubSede=${
      DocenteAsignado[0]?.subSedeId || 0
    }&IdRol=2&IdUser=${DocenteAsignado[0]?.IdDocente || 0}')`);

    res.status(200).json({
      body: "Pregunta Rechazada correctamente",
    } as Data);
  } catch (error) {
    console.log(error);

    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
