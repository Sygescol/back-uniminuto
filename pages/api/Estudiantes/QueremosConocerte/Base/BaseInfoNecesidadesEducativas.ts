import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../../config/db";
type Data = {
  ConfigSygescol: [];
  selectCupo: [];
  neeFisica: [];
  neeSensorial: [];
  neePsiquica: [];
  neeCognitiva: [];
  neeTalentos: [];
  SeccionFormSave: [];
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
    const [ConfigSygescol]: any = await connectionPool.query(`
              SELECT conf_valor FROM conf_sygescol WHERE conf_id = 143`);
    const [selectCupo]: any = await connectionPool.query(
      `SELECT * FROM cupos_acceso WHERE cupo_num_docu = ${num}`
    );
    const [neeFisica]: any = await connectionPool.query(`
              SELECT * FROM nee where id_tipo_nee = 1
                `);
    const [neeSensorial]: any = await connectionPool.query(`
               SELECT * FROM nee where id_tipo_nee = 2
                `);
    const [neePsiquica]: any = await connectionPool.query(`
                SELECT * FROM nee where id_tipo_nee = 3
                `);
    const [neeCognitiva]: any = await connectionPool.query(`
                 SELECT * FROM nee where id_tipo_nee = 4
                `);
    const [neeTalentos]: any = await connectionPool.query(`
                  SELECT * FROM nee where id_tipo_nee = 5
                `);
    const [SeccionFormSave]: any = await connectionPool.query(`
                SELECT * FROM guardar_seccion_formulario WHERE alumno_num_docu = '${selectCupo[0]?.cupo_num_docu}' AND seccion_guardada LIKE 'N.E.E'
                 `);
    return res.status(200).json({
      ConfigSygescol: ConfigSygescol[0] || [],
      selectCupo: selectCupo[0] || [],
      neeFisica: neeFisica || [],
      neeSensorial: neeSensorial || [],
      neePsiquica: neePsiquica || [],
      neeCognitiva: neeCognitiva || [],
      neeTalentos: neeTalentos || [],

      SeccionFormSave: SeccionFormSave[0] || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
