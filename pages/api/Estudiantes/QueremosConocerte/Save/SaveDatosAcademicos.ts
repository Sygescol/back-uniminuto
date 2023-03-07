import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../../config/db";
type Data = {
  id: string;
};

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "PUT") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const { Value, Documento, Rol, IdUser } = req.body;

    const [UpdateAlumno]: any = await connectionPool.query(
      `UPDATE pfc_alumno SET 	BeneficiarioFliaAccion='${
        Value?.FliaAccion || ""
      }',CodFliaAccion='${
        Value?.CodigoFliaAccion || ""
      }',CodBeneficiarioFliaAccion='${
        Value.InputCodigoFliaBeneficiario || ""
      }',RUV	='${Value.RUV || ""}',CodRuv='${
        Value.InputCodigRUV || ""
      }',CodBeneficiarioRuv	='${
        Value?.InputCodigBeneficiarioRUV || ""
      }' where alumno_id='${IdUser}' and alumno_num_docu='${Documento}'`
    );

    if (UpdateAlumno.affectedRows === 0) {
      res.status(404).json({ body: "No se encontró el usuario" });
      return;
    }

    const [CheckSectionSave]: any = await connectionPool.query(
      `SELECT * FROM guardar_seccion_formulario WHERE alumno_num_docu='${Documento}' `
    );
    console.log("CheckSectionSave", CheckSectionSave);

    if (!CheckSectionSave?.length) {
      const [InsertSectionSave]: any = await connectionPool.query(
        `INSERT INTO guardar_seccion_formulario (alumno_num_docu, guardado,seccion_guardada) VALUES ('${Documento}', 1,'DatosAcademicos')`
      );
    }
    // const [UpdateSectionSave]: any = await connectionPool.query(``)

    res.status(200).json({ body: "Información Cargada Con Exitó" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
