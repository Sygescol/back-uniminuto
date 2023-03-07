import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../config/db";

type Data = {
  pruebas: [];
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
    const { SubSede } = req.query;
    const { Values } = req.body;

    let Pruebas = [];

    if (Values.TipoPrueba == "SP") {
      console.log(`
      SELECT id as Id FROM parametros_pruebas WHERE tipo="SP" AND programa=${Values.Programa} AND semestre='${Values?.SemestreAcademico}'
      `);

      const [PruebaRes]: any = await connectionPool.query(`
      SELECT id as Id FROM parametros_pruebas WHERE tipo="SP" AND programa=${Values.Programa}  AND semestre='${Values?.SemestreAcademico}'
      `);
      Pruebas = PruebaRes?.map((item: any, key: any) => {
        return {
          Id: item.Id,
          Nombre: `Prueba #${key + 1}`,
        };
      });
    } else {
      const [PruebaRes]: any = await connectionPool.query(`
      SELECT id as Id FROM parametros_pruebas WHERE tipo="SS" AND programa=${Values.Programa} AND semestre='${Values?.Semestre}'
      `);

      Pruebas = PruebaRes?.map((item: any, key: any) => {
        return {
          Id: item.Id,
          Nombre: `Prueba #:${key + 1}`,
        };
      });
    }

    res.status(200).json({ pruebas: Pruebas || [] } as Data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
