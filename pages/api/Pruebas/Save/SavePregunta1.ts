import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { abecedario } from "../../../../utils/Abecedario";

type Data = {
  data: string;
};

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  const {
    pregunta,
    correcta,
    respuestas,
    textos,
    punto,
    competencia,
    semestre,
    prueba,
    retro,
    IdRol,
    IdUser,
  } = req.body;
  if (req.method !== "POST") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    let respuestasFormated = "";
    respuestas.map((res: any, key: number) => {
      respuestasFormated = `${respuestasFormated}${res}~${textos[key]}@`;
    });
    const [competencias]: any = await connectionPool.query(
      `SELECT eje_nom,eje_id  FROM asignacionPrueba INNER JOIN pfc_ejes ON eje_id = competencia WHERE prueba=${prueba}`
    );
    const competenciaFind = competencias.filter((e: any) =>
      e.eje_nom.toLowerCase().includes(`${competencia.toLowerCase()}`)
    );
    const [ingreso]: any = await connectionPool.query(
      `INSERT INTO preguntas_pruebas(tipo,pregunta,opciones,respuesta,punto,competencia,prueba,aprobo,IdDocente) VALUES(1, '${pregunta}', '${respuestasFormated}','${correcta}', ${punto},  '${competenciaFind[0]?.eje_id}', '${prueba}', 0,'${IdUser}')`
    );
    const id = ingreso?.insertId;
    let sql = "";
    retro.map((ret: any, key: number) => {
      let letra = abecedario[key];
      sql += `('${id}','${letra}','${ret}'),`;
    });
    sql = sql.substring(0, sql.length - 1);
    const [retroalimentacion] = await connectionPool.query(
      `INSERT INTO retroalimentacionPregunta(pregunta, posicion, texto) VALUES ${sql}`
    );
    res.status(200).json({ body: "La información fue ingresada con exito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
