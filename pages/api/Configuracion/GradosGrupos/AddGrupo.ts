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
    const { SemestreSigla, Sigla, Grado, Periodicidad, Semestre } = req.body;

    console.log(req.body);

    const [MaxGrupoRes]: any =
      await connectionPool.query(`SELECT MAX(pfc_grupo_nom) as MaxGrupo FROM pfc_grupos WHERE pfc_grado_id =${Grado}
    `);
    const MaxGrupo = MaxGrupoRes[0]?.MaxGrupo?.toString()?.slice(
      MaxGrupoRes[0]?.MaxGrupo?.toString()?.length - 2,
      MaxGrupoRes[0]?.MaxGrupo?.toString()?.length
    );
    const NewGrupo = parseInt(MaxGrupo) + 1;

    console.log(MaxGrupoRes);

    console.log(
      "--",
      `INSERT INTO pfc_grupos (pfc_grado_id, pfc_grupo_sem, pfc_grupo_nom ) VALUES ('${Grado}','${Semestre}','${Sigla}-${Periodicidad}S${SemestreSigla}-${
        NewGrupo?.toString()?.length === 1 ? `0${NewGrupo}` : NewGrupo
      }')`
    );

    const [GrupoRes]: any = await connectionPool.query(
      `INSERT INTO pfc_grupos (pfc_grado_id, pfc_grupo_sem, pfc_grupo_nom ) VALUES ('${Grado}','${Semestre}','${Sigla}-${Periodicidad}S${SemestreSigla}-${
        NewGrupo?.toString()?.length === 1 ? `0${NewGrupo}` : NewGrupo
      }')`
    );

    res.status(200).json({ body: "Grupo agregado" });
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
