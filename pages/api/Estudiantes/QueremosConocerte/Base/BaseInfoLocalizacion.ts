import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../../config/db";
type Data = {
  selectCupo: [];
  Departamentos: [];
  Municipios: [];
  Zona: [];
  Estrato: [];
  DataSave: [];
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
    const [Zona]: any = await connectionPool.query(`
      SELECT * FROM zona
      `);
    const [Estrato]: any = await connectionPool.query(`
      SELECT etao.i, etao.b FROM etao ORDER BY etao.b
      `);
    const [DataSave]: any = await connectionPool.query(` 
      select muni_res_id,alumno_direccion,alumno_barrio,comuna_id,zona_id,alumno_celular,alumno_telefono,alumno_email,transporte_id,convivencia_familiar,convivencia_otro,estrato_id FROM inscripciones WHERE alumno_num_docu = ${num}`);
    return res.status(200).json({
      selectCupo: selectCupo[0] || [],
      Departamentos: Departamentos || [],
      Municipios: Municipios || [],
      Zona: Zona || [],
      Estrato: Estrato || [],
      DataSave: DataSave[0] || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
