import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { RequisitrosMatricula } from "../../../../typings";

type Data = {
  requisitosMatricula: RequisitrosMatricula[];
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
    const [RequisitosMatriculaRes]: any = await connectionPool.query(
      `SELECT requisitos_matricula.rm_id as Id, requisitos_matricula.rm_nombre as Nombre, requisitos_matricula.rm_tipo as Tipo, requisitos_matricula.rm_para_quien as Target FROM requisitos_matricula ORDER BY requisitos_matricula.rm_nombre`
    );

    res
      .status(200)
      .json({ requisitosMatricula: RequisitosMatriculaRes } as Data);
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
