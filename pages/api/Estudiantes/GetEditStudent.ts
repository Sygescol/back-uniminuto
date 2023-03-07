import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../config/db";
import { Grupo } from "../../../typings";

type Data = {
  DemasInfo: {};
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
    const { IdEstudiante } = req.body;

    const [InfoEstudianteRes]: any = await connectionPool.query(
      `SELECT pfc_programa.pro_nom as Programa, pfc_matricula.semestre as Semestre,pfc_programa.pro_id as ProgramaId,pfc_matricula.GrupoMatriculadoId, pfc_grupos.pfc_grupo_id as GrupoId, pfc_grupos.pfc_grupo_nom as NombreGrupo FROM pfc_matricula INNER JOIN pfc_programa ON (pfc_programa.pro_id=pfc_matricula.programa) INNER JOIN pfc_grupos ON pfc_grupos.pfc_grupo_id=pfc_matricula.GrupoMatriculadoId WHERE alumno_id=${IdEstudiante}`
    );

    const DataRes = {
      Programa: InfoEstudianteRes[0]?.Programa,
      Semestre: InfoEstudianteRes[0]?.Semestre,
      Grupo: InfoEstudianteRes[0]?.NombreGrupo,
      GrupoId: InfoEstudianteRes[0]?.GrupoId,
      ProgramaId: InfoEstudianteRes[0]?.ProgramaId,
    };

    res.status(200).json({ DemasInfo: DataRes || {} } as Data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
