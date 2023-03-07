import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { SemestreAcademico, SemestreLectivo } from "../../../../typings";
type Data = {
  semestres: SemestreAcademico[];
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
    const { IdPrograma, IdSubSede } = req.query;

    const [SemestresRes]: any = await connectionPool.query(
      `SELECT DISTINCT(pfc_semestre.sem_id) as SemestreId,pfc_semestre.sem_nom as NombreSemestre, pfc_semestre.sem_num as Numero FROM pfc_semestre INNER JOIN pfc_grados ON pfc_grados.sem_id=pfc_semestre.sem_id INNER JOIN pfc_programa ON pfc_programa.pro_id=pfc_grados.pro_id WHERE pfc_programa.pro_id='${IdPrograma}' and pfc_programa.subSedeId='${IdSubSede}' ORDER BY (pfc_semestre.sem_id)`
    );

    console.log(SemestresRes);

    res.status(200).json({ semestres: SemestresRes } as Data);
  } catch (error) {
    console.log(error);

    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
