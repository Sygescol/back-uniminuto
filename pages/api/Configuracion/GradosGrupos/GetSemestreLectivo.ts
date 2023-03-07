import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { SemestreAcademico, SemestreLectivo } from "../../../../typings";
type Data = {
  semestreLectivo: SemestreLectivo[];
  Semestres: SemestreAcademico[];
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
    const { Periodisidad } = req.query;

    const [LectivoRes]: any = await connectionPool.query(
      `SELECT * FROM SemestreLectivo where Periodicidad='${Periodisidad}'`
    );

    const [SemestresRes]: any = await connectionPool.query(
      `SELECT sem_id as Id, sem_nom as Nombre, sem_num as Numero FROM pfc_semestre`
    );

    res
      .status(200)
      .json({ semestreLectivo: LectivoRes, Semestres: SemestresRes } as Data);
  } catch (error) {
    console.log(error);

    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
