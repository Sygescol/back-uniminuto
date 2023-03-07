import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { RequisitrosMatricula } from "../../../../typings";

type Data = {
  requisito: RequisitrosMatricula;
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
    const { Nombre, Quien, Tipo } = req.body;

    const [RequisitoAdd]: any = await connectionPool.query(`
    INSERT INTO requisitos_matricula (rm_nombre, rm_tipo, rm_para_quien) values ('${
      Nombre || ""
    }', '${Tipo || ""}','${Quien || ""}')
    `);

    if (RequisitoAdd.affectedRows === 0) {
      res
        .status(400)
        .json({ body: "No se puedo agregar el requisto de matricula" });
      return;
    }

    const Update = {
      Nombre: Nombre,
      Tipo: Tipo,
      Target: Quien,
    };

    res.status(200).json({
      requisito: Update as RequisitrosMatricula,
      body: "Requisito de matricula agregado correctamente",
    } as Data);
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
