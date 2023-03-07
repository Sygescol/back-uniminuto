import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { Docente } from "../../../../typings";

type Data = {
  docente: Docente;
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
    const { Documento } = req.body;

    const [DocenteRes]: any = await connectionPool.query(
      `SELECT tipo_docu_id as TipoDocumento FROM dcne WHERE dcne_num_docu='${Documento}'
      `
    );

    res.status(200).json({ docente: DocenteRes[0] } as Data);
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
