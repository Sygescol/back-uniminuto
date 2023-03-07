import { log } from "console";
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
  const { data, text, competencia, prueba, semestre, IdRol, IdUser } = req.body;
  if (req.method !== "POST") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const [competencias]: any = await connectionPool.query(
      `SELECT eje_id, eje_nom  FROM asignacionPrueba INNER JOIN pfc_ejes ON pfc_ejes.eje_id = asignacionPrueba.competencia WHERE prueba = ${prueba}`
    );

    const competenciaFind = competencias.filter((e: any) =>
      e.eje_nom.toLowerCase().includes(`${competencia.toLowerCase()}`)
    );

    const [padre]: any = await connectionPool.query(
      `INSERT INTO preguntas_pruebas(tipo,pregunta,competencia,prueba,IdDocente) VALUES(3,'${text}','${competenciaFind[0]?.eje_id}','${prueba}','${IdUser}')`
    );

    let sql = `INSERT INTO preguntas_pruebas(tipo,padre,pregunta,opciones,respuesta,punto,competencia,prueba) VALUES `;
    data.forEach(async (element: any) => {
      let Opciones = "";
      element?.Opciones.map((pre: any, key: number) => {
        Opciones += `${pre}~${element?.Respuestas[key]}@`;
      });
      sql += `(100,${padre?.insertId || 0},'${
        element?.Pregunta
      }','${Opciones}','${element?.correcta}','${element?.puntos}','${
        competenciaFind[0]?.eje_id
      }','${prueba}'),`;
    });
    console.log("============================PADRE");
    console.log(padre);
    console.log("============================HIJO");
    console.log(sql.substring(0, sql.length - 1));
    sql = sql.substring(0, sql.length - 1);
    const [query2] = await connectionPool.query(`${sql}`);
    res.status(200).json({ body: "La información fue ingresada con exito" });
  } catch (error) {
    console.log("=============================ERROR");
    console.log(error);
  }
}
