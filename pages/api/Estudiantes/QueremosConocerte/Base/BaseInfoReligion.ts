import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../../config/db";
type Data = {
  selectCupo: {};
  Religiones: [];
  ReligionGuardada: {};
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
  const { num } = req.query;
  try {
    const [selectCupo]: any = await connectionPool.query(
      `SELECT * FROM cupos_acceso WHERE cupo_num_docu = ${num}`
    );

    const [Religiones]: any = await connectionPool.query(`
      SELECT * FROM religion_estudiante
      `);

    const [ReligionGuardada]: any = await connectionPool.query(`
      select religion_estudiante from inscripciones where  alumno_num_docu = ${num}
      `);
    return res.status(200).json({
      selectCupo: selectCupo[0] || {},
      Religiones: Religiones || [],
      ReligionGuardada: ReligionGuardada[0] || {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
