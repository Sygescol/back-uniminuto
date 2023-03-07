import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../../config/db";

type Data = {
  InfoDatos: {};
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
    const { Documento, Rol, IdUser } = req.query;
    console.log(req.query);

    const [InfoDb]: any = await connectionPool.query(
      `SELECT pfc_matricula.matri_anyo as MatriYear,subSedes.nombre as NombreCoa,pfc_programa.pro_nom as NombrePrograma, pfc_alumno.alumno_id,pfc_alumno.BeneficiarioFliaAccion,pfc_alumno.CodFliaAccion,pfc_alumno.CodBeneficiarioFliaAccion,pfc_alumno.RUV, pfc_alumno.CodRuv,pfc_alumno.CodBeneficiarioRuv FROM pfc_matricula INNER JOIN subSedes ON pfc_matricula.subSedeId=subSedes.id INNER JOIN pfc_programa ON pfc_matricula.programa=pfc_programa.pro_id INNER JOIN pfc_alumno ON pfc_matricula.alumno_id=pfc_alumno.alumno_id WHERE pfc_alumno.alumno_num_docu='${Documento}' AND pfc_alumno.alumno_id='${IdUser}'`
    );

    res.status(200).json({ InfoDatos: InfoDb[0] });
    console.log(InfoDb);
  } catch (error) {
    console.log(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
