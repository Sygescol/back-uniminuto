import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../../config/db";
type Data = {
  selectCupo: [];
  TipoDocumento: [];
  Departamentos: [];
  Municipios: [];
  Parentesco: [];
  InfoInscripcion: [];
  InfoAcudienteBase: [];
  CorreoAcudiente: [];
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
    const [TipoDocumento]: any = await connectionPool.query(`
      SELECT * FROM tipo_docum
      `);
    const [Departamentos]: any = await connectionPool.query(`
      SELECT * FROM dpto ORDER BY nombre ASC
      `);
    const [Municipios]: any = await connectionPool.query(`
      SELECT * FROM municipio ORDER BY municipio_nombre ASC
      `);
    const [Parentesco]: any = await connectionPool.query(`
      SELECT * FROM prnec ORDER BY prnec.i ASC
      `);
    const [InfoInscripcion]: any = await connectionPool.query(
      `SELECT * FROM inscripciones WHERE alumno_num_docu = ${num}`
    );
    const [InfoAcudienteBase]: any = await connectionPool.query(`
      select inscripcion_id,tipo_docu_id,acu_num_docu,acu_apellido1,acu_apellido2,acu_nombre1,acu_nombre2,acu_tipo,muni_exp_id,exp_otro_pais,acu_direccion,acu_barrio,muni_res_id,acu_telefono,acu_celular,acu_email,acu_fec_nac,acu_fec_exp,parentesco_id,acu_empresa,acu_empre_tel,acu_ocupacion,acu_profesion,acu_whatsapp from acudiente_inscripcion where inscripcion_id=${InfoInscripcion[0]?.inscripcion_id} and acu_tipo='A'
      `);
    const [CorreoAcudiente]: any = await connectionPool.query(`
      SELECT correo,num_cel,num_docu_alumn FROM remisiones where num_docu_alumn=${selectCupo[0]?.cupo_num_docu}
      `);
    return res.status(200).json({
      selectCupo: selectCupo[0] || [],
      TipoDocumento: TipoDocumento || [],
      Departamentos: Departamentos || [],
      Municipios: Municipios || [],
      Parentesco: Parentesco || [],
      InfoInscripcion: InfoInscripcion[0] || [],
      InfoAcudienteBase: InfoAcudienteBase[0] || [],
      CorreoAcudiente: CorreoAcudiente[0] || {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
