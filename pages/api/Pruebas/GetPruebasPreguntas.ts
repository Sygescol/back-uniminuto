import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../config/db";
import { SemestreAcademico } from "../../../typings";

type Data = {
  semestres: SemestreAcademico;
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
    const { programa } = req.query;

    if (programa) {
      const [SemestreRes]: any = await connectionPool.query(`
      SELECT sem_id as Id,sem_nom as Nombre FROM parametros_pruebas INNER JOIN pfc_semestre ON pfc_semestre.sem_id = parametros_pruebas.semestre WHERE  programa=${programa} ORDER BY sem_id

    `);
      return res.status(200).json({ semestres: SemestreRes } as Data);
    }

    // let Pruebas = [];

    // if (Values.TipoPrueba == "SP") {
    //   const [PruebaRes]: any = await connectionPool.query(`
    //   SELECT id as Id FROM parametros_pruebas WHERE tipo="SP" AND programa=${Values.Programa} AND semestre="1,3,6,9"
    //   `);
    //   Pruebas = PruebaRes?.map((item: any, key: any) => {
    //     return {
    //       Id: item.Id,
    //       Nombre: `Prueba #${key + 1}`,
    //     };
    //   });
    // } else {
    //   const [PruebaRes]: any = await connectionPool.query(`
    //   SELECT id as Id FROM parametros_pruebas WHERE tipo="SS" AND programa=${Values.Programa} AND semestre='${Values?.Semestre}'
    //   `);

    //   Pruebas = PruebaRes?.map((item: any, key: any) => {
    //     return {
    //       Id: item.Id,
    //       Nombre: `Prueba #:${key + 1}`,
    //     };
    //   });
    // }
  } catch (error) {
    console.log(error);

    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
