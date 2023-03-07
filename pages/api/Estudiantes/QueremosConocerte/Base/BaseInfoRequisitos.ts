import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../../config/db";
type Data = {
  selectCupo: [];
  RequisitrosMatricula: [];
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
    let RequisitrosMatricula = [];
    const [selectCupo]: any = await connectionPool.query(
      `SELECT tipo,cupo_num_docu FROM cupos_acceso WHERE cupo_num_docu = ${num}`
    );

    if (selectCupo[0].tipo == 1) {
      const [RequisitrosMatriculaNuevo]: any = await connectionPool.query(`
      SELECT * FROM requisitos_matricula WHERE (rm_para_quien = 'N' OR rm_para_quien = '2') AND rm_tipo = 'O' ORDER BY rm_id  
      `);
      RequisitrosMatricula = RequisitrosMatriculaNuevo;
    } else {
      const [RequisitrosMatriculaAntiguos]: any = await connectionPool.query(`
      SELECT * FROM requisitos_matricula WHERE (rm_para_quien = 'A' OR rm_para_quien = '2') AND rm_tipo = 'O' ORDER BY rm_id  
      `);
      RequisitrosMatricula = RequisitrosMatriculaAntiguos;
    }

    const [SeccionFormSave]: any = await connectionPool.query(`
    SELECT * FROM guardar_seccion_formulario WHERE alumno_num_docu = '${selectCupo[0]?.cupo_num_docu}' AND seccion_guardada LIKE 'ARCHIVOS MATRICULA'
     `);
    return res.status(200).json({
      selectCupo: selectCupo[0] || [],
      RequisitrosMatricula: RequisitrosMatricula || [],
      SeccionFormSave: SeccionFormSave[0] || {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
