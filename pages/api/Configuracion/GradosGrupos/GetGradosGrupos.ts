import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";

type Data = {
  grados: any[];
};

type ErrorData = {
  body: string;
};

export default async function handlerGetGrupos(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "GET") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }

  try {
    const { SubSede } = req.query;

    const [GradosYGrupos]: any = await connectionPool.query(`
    SELECT pfc_grupos.pfc_grupo_id as GrupoId, subSedes.nombre as COA,pfc_semestre.sem_id SemestreId,pfc_semestre.sem_nom as SemestreNombre,SemestreLectivo.Meses as Meses,pfc_grupos.pfc_grupo_nom as NombreGrupo,pfc_programa.pro_id as ProgramaId, pfc_programa.pro_nom as NombrePrograma, SemestreLectivo.Periodicidad ,pfc_grados.pfc_grado_id as GradoId,pfc_programa.pro_sigla as Sigla,pfc_semestre.sem_num as SemestreSigla,pfc_grupos.pfc_grupo_ubi as GrupoUbicacion from pfc_grados INNER JOIN pfc_grupos ON (pfc_grados.pfc_grado_id=pfc_grupos.pfc_grado_id) INNER JOIN pfc_semestre on (pfc_semestre.sem_id=pfc_grados.sem_id) INNER JOIN pfc_programa on (pfc_programa.pro_id=pfc_grados.pro_id) INNER JOIN SemestreLectivo ON (SemestreLectivo.Id=pfc_grados.pfc_grado_sem) INNER JOIN subSedes ON (subSedes.id=pfc_grados.subSedeId) ${
      SubSede && SubSede != "0"
        ? `where pfc_grados.subSedeId = '${SubSede}'`
        : ""
    } ORDER BY pfc_programa.pro_nom,pfc_semestre.sem_id,SemestreLectivo.Id,pfc_grupos.pfc_grupo_id asc`);

    const newData = GradosYGrupos.reduce((acc: any, grado: any) => {
      let key = `${grado.COA}-${grado.SemestreId}-${grado.NombrePrograma}-${grado.Periodicidad}-${grado.Meses}`;
      if (!acc[key]) {
        acc[key] = {
          COA: grado.COA,
          SemestreId: grado.SemestreId,
          SemestreNombre: grado.SemestreNombre,
          Meses: grado.Meses,
          ProgramaId: grado.ProgramaId,
          NombrePrograma: grado.NombrePrograma,
          Periodicidad: grado.Periodicidad,
          GradoId: grado.GradoId,
          SiglaPrograma: grado.Sigla,
          SemestreSigla: grado.SemestreSigla,
          Grupos: [],
        };
      }
      acc[key].Grupos.push({
        GrupoId: grado.GrupoId,
        NombreGrupo: grado.NombreGrupo,
        GrupoUbicacion: grado.GrupoUbicacion,
      });
      return acc;
    }, {});

    res.status(200).json({ grados: Object.values(newData) || [] });
    // }
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal Server Error" });
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
};
