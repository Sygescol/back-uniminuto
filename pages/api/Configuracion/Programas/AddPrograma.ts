import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { Programa } from "../../../../typings";

type Data = {};

type ErrorData = {
  body: string;
};

export default async function handlerAddDatos(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "POST") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }

  try {
    const { Nombre, Sigla, IdSubSede, Periodicidad } = req.body;

    if (Nombre && Sigla) {
      const [verificarExistencia]: any = await connectionPool.query(
        `SELECT * FROM pfc_programa where pro_nom='${Nombre}' and subSedeId='${IdSubSede}'`
      );

      if (verificarExistencia.length) {
        res.status(400).json({ body: "El programa ya existe" });
        return;
      }

      const [addPrograma]: any = await connectionPool.query(`
        INSERT INTO pfc_programa (pro_nom, pro_sigla,subSedeId,periodicidad) VALUES ('${Nombre}', '${Sigla}','${IdSubSede}','${Periodicidad}')
      `);

      const Recarga = {
        Id: addPrograma.insertId,
        Nombre: Nombre,
        Sigla: Sigla,
      };
      res
        .status(200)
        .json({ body: "Programa agregado correctamente", programa: Recarga });
    } else {
      res.status(400).json({ body: "Faltan datos" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal Server Error" });
  }
}
