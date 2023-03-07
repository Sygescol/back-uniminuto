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
    const { Periodicidad, Programa, Semestre, IdSubSede } = req.query;

    const [LectivoRes]: any = await connectionPool.query(
      `SELECT DISTINCT(SemestreLectivo.Id) as IdPeriodicidad, SemestreLectivo.Nombre,SemestreLectivo.Meses,SemestreLectivo.END,SemestreLectivo.START as StartStudent FROM pfc_grados INNER JOIN SemestreLectivo ON SemestreLectivo.Id=pfc_grados.pfc_grado_sem INNER JOIN pfc_programa ON pfc_programa.pro_id=pfc_grados.pro_id WHERE pfc_grados.pro_id='${Programa}' AND pfc_grados.sem_id='${Semestre}' AND SemestreLectivo.Periodicidad= '${Periodicidad}' ${
        IdSubSede && IdSubSede != "0"
          ? `and pfc_grados.subSedeId = '${IdSubSede}'`
          : ""
      } order by SemestreLectivo.Id asc`
    );

    res.status(200).json({ semestreLectivo: LectivoRes } as Data);
  } catch (error) {
    console.log(error);

    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
