import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../../config/db";
type Data = {
  SaludEstudiante: [];
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
    const [SaludEstudiante]: any = await connectionPool.query(`
    select enf_padecidas,emf_cronica,emf_alergias,toma_medi,imp_ejercicio,dif_visual,dif_auditiva from inscripciones where alumno_num_docu = ${num}
    `);
    return res.status(200).json({
      SaludEstudiante: SaludEstudiante[0] || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
