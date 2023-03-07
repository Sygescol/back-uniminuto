import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../../config/db";
type Data = {
  selectCupo: [];
  Departamentos: [];
  Municipios: [];
  PoblacionVictimaConflicto: [];
  Etnia: [];
  Resguardo: [];
  DataSave: [];
  ConsultaExitenciaFile: [];
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
    const [selectCupo]: any = await connectionPool.query(
      `SELECT * FROM cupos_acceso WHERE cupo_num_docu = ${num}`
    );

    const [Departamentos]: any = await connectionPool.query(`
      SELECT * FROM dpto ORDER BY nombre ASC
      `);

    const [Municipios]: any = await connectionPool.query(`
      SELECT * FROM municipio ORDER BY municipio_nombre ASC
      `);
    const [PoblacionVictimaConflicto]: any = await connectionPool.query(`
      SELECT pob_vic_conflicto.pvc_id, pob_vic_conflicto.pvc_nombre FROM pob_vic_conflicto ORDER BY pob_vic_conflicto.pvc_nombre
      `);
    const [Etnia]: any = await connectionPool.query(`
      SELECT etnia.etnia_id, etnia.etnia_nombre FROM etnia ORDER BY etnia.etnia_nombre
      `);
    const [Resguardo]: any = await connectionPool.query(`
      SELECT resguardo.resgu_id, resguardo.resgu_nombre FROM resguardo ORDER BY resguardo.resgu_nombre
      `);
    const [DataSave]: any = await connectionPool.query(
      `SELECT alumno_desplazado,muni_expulsor_id,muni_reinsert_id,pvc_id,alumno_indigena,resguardo_id,etnia_id,alumno_bvfp,alumno_bhn,alumno_poblacion_vulnerable FROM inscripciones WHERE alumno_num_docu = ${num}`
    );

    const [ConsultaExitenciaFile]: any = await connectionPool.query(`
      select * from documentos_matricula where alumno_num_docu=${selectCupo[0]?.cupo_num_docu} and seccion_formulario='VICTIMA CONFLICTO'
      `);
    return res.status(200).json({
      selectCupo: selectCupo[0] || [],
      Departamentos: Departamentos || [],
      Municipios: Municipios || [],
      PoblacionVictimaConflicto: PoblacionVictimaConflicto || [],
      Etnia: Etnia || [],
      Resguardo: Resguardo || [],
      DataSave: DataSave[0] || [],
      ConsultaExitenciaFile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
