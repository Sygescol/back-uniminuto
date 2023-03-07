import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";

type Data = {};

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
    const {
      IdSubSede,
      ProgramAcademico,
      Sigla,
      Periodisidad,
      SemestreAcademico,
      SemestresId,
      SiglaSemestre,
      NumeroGrupos,
    } = req.body;

    console.log("req.body", req.body);

    //AND pfc_grado_sem = '${SemestreYear}'
    console.log(`
SELECT * FROM pfc_grados inner join SemestreLectivo on pfc_grados.pfc_grado_sem=SemestreLectivo.Id
      WHERE pfc_grados.pro_id = '${ProgramAcademico}'
        AND pfc_grados.sem_id = '${SemestresId}'
        AND pfc_grados.subSedeId = '${IdSubSede}'
        AND SemestreLectivo.Periodicidad = '${Periodisidad}'

`);

    const [VerificarExistencia]: any = await connectionPool.query(`
    SELECT * FROM pfc_grados inner join SemestreLectivo on pfc_grados.pfc_grado_sem=SemestreLectivo.Id
    WHERE pfc_grados.pro_id = '${ProgramAcademico}'
      AND pfc_grados.sem_id = '${SemestresId}'
      AND pfc_grados.subSedeId = '${IdSubSede}'
      AND SemestreLectivo.Periodicidad = '${Periodisidad}'

    `);

    // console.log(`
    // SELECT * FROM pfc_grados
    // 			WHERE pro_id = '${ProgramAcademico}'
    // 				AND sem_id = '${SemestreAcademico}'
    //         AND subSedeId = '${IdSubSede}'
    //         AND pfc_grado_sem = '${SemestreAcademico}'

    // `);

    if (VerificarExistencia?.length > 0) {
      res.status(400).json({ body: "Ya existe un registro con estos datos" });
      return;
    }

    const [AddGrados]: any = await connectionPool.query(
      `INSERT INTO pfc_grados (pro_id, sem_id, pfc_grado_sem,subSedeId) values ('${ProgramAcademico}','${SemestresId}','${SemestreAcademico}','${IdSubSede}') `
    );

    let sqlBase =
      "INSERT INTO pfc_grupos (pfc_grado_id, pfc_grupo_sem, pfc_grupo_nom) values ";

    for (let i = 1; i <= NumeroGrupos; i++) {
      sqlBase += `('${
        AddGrados.insertId
      }','${SemestreAcademico}','${Sigla}-${Periodisidad}S${SiglaSemestre}-${
        i?.toString()?.length === 1 ? `0${i}` : i
      }'),`;
    }

    sqlBase = sqlBase.slice(0, -1);

    console.log(sqlBase);

    const [AddGrupos]: any = await connectionPool.query(sqlBase);

    res.status(200).json({ body: "Semestre y grupos creado con éxito" });
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
