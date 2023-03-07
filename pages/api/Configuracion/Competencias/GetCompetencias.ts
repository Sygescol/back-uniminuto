import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { Competencia } from "../../../../typings";

type Data = {
  competencia: Competencia[];
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
    const { SubSede } = req.query;
    console.log("🚀 ~ file: GetCompetencias.ts:23 ~ SubSede", SubSede);

    const [CompetenciaRes]: any = await connectionPool.query(
      `SELECT pfc_ejes.eje_id as Id,pfc_ejes.eje_nom as Nombre,pfc_ejes.eje_abr as Abreviatura,pfc_ejes.eje_tip as TipoCompetencia,pfc_ejes.eje_cons as Orden,subSedes.nombre as NombreSubSede FROM pfc_ejes INNER JOIN subSedes ON subSedes.id=pfc_ejes.subSedeId ${SubSede && SubSede != "0"
        ? `where pfc_ejes.subSedeId = '${SubSede}'`
        : ""
      } ORDER BY TipoCompetencia DESC`
    );
    console.log(`SELECT pfc_ejes.eje_id as Id,pfc_ejes.eje_nom as Nombre,pfc_ejes.eje_abr as Abreviatura,pfc_ejes.eje_tip as TipoCompetencia,pfc_ejes.eje_cons as Orden,subSedes.nombre as NombreSubSede FROM pfc_ejes INNER JOIN subSedes ON subSedes.id=pfc_ejes.subSedeId ${SubSede && SubSede != "0"
      ? `where pfc_ejes.subSedeId = '${SubSede}'`
      : ""
      } ORDER BY TipoCompetencia DESC`)
    res.status(200).json({ competencia: CompetenciaRes } as Data);
  } catch (error) {
    console.log(error);

    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
