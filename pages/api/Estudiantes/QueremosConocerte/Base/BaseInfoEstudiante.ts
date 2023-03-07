import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../../config/db";
type Data = {
  selectCupo: {};
  TiposDocumento: [];
  Departamentos: [];
  Municipios: [];
  GrupoSanguineo: [];
  Eps: [];
  Genero: [];
  DataSave: {};
  ConsultaExitenciaFile: {};
  dateNacimientoRemisiones: {};
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
    const { num } = req.query;
    const [selectCupo]: any = await connectionPool.query(
      `SELECT * FROM cupos_acceso WHERE cupo_num_docu = ${num}`
    );
    const [TiposDocumento]: any = await connectionPool.query(`
        SELECT tipo_docum.id, tipo_docum.codigo, SUBSTR(tipo_docum.nombre,1,30) nombre FROM tipo_docum WHERE id = ${selectCupo[0]?.cupo_tip_docu}
        `);

    const [Departamentos]: any = await connectionPool.query(`
        SELECT * FROM dpto ORDER BY nombre ASC
        `);

    const [Municipios]: any = await connectionPool.query(`
        SELECT * FROM municipio ORDER BY municipio_nombre ASC
        `);
    const [GrupoSanguineo]: any = await connectionPool.query(`
        SELECT gruposang.id, gruposang.nombre FROM gruposang ORDER BY gruposang.nombre
        `);
    const [Eps]: any = await connectionPool.query(`
        SELECT eps.id, eps.nombre FROM eps ORDER BY eps.nombre
        `);
    const [Ars]: any = await connectionPool.query(`
        SELECT ars.id, ars.nombre FROM ars ORDER BY ars.nombre
        `);
    const [Genero]: any = await connectionPool.query(`
        SELECT * FROM genero
      
        `);

    const [DataSave]: any = await connectionPool.query(`
        select muni_nac_id,depa_exp_id,muni_exp_id,exp_otro_pais,alumno_fec_nac,alumno_fec_exp,muni_nac_id,otro_pais_nac,est_nac,alumno_genero,rh_id,alumno_estatura,alumno_peso,ars,sisben_id,sin_sisben,sisben_mun_exp_id,eps_id,num_hermanos,lugar_hermanos,alumno_hmcf from inscripciones where alumno_num_docu = ${num}
        `);

    const [ConsultaExitenciaFile]: any = await connectionPool.query(`
        select * from documentos_matricula where alumno_num_docu=${selectCupo[0]?.cupo_num_docu} and seccion_formulario='INFORMACION DEL ESTUDIANTE'
        `);

    const [dateNacimientoRemisiones]: any = await connectionPool.query(`
        SELECT fecha_estudiante FROM remisiones where num_docu_alumn=${selectCupo[0]?.cupo_num_docu}
        `);
    return res.status(200).json({
      selectCupo: selectCupo[0] || {},
      TiposDocumento: TiposDocumento[0] || {},
      Departamentos: Departamentos || [],
      Municipios: Municipios || [],
      GrupoSanguineo: GrupoSanguineo || [],
      Eps: Eps || [],
      Genero: Genero || [],
      DataSave: DataSave[0] || {},
      ConsultaExitenciaFile,
      dateNacimientoRemisiones: dateNacimientoRemisiones[0] || {},
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
