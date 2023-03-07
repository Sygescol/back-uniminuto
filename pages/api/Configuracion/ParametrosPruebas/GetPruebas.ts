import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { Pruebas } from "../../../../typings";

type Data = {
  pruebas: Pruebas;
};

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "POST") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const { programa, SemestreAcademico, tipo, SemestreLectivo } = req.body;
    const { SubSede } = req.query;

    // const [PruebasRes]: any = await connectionPool.query(
    //   `SELECT DateDocentesInicio ,DateDocentesFin,DateEstudiantesInicio,DateEstudiantesFin,id as Id FROM parametros_pruebas WHERE tipo = '${tipo}' AND programa = ${programa} ${
    //     SubSede && SubSede != "0" ? `AND subSedeId='${SubSede}'` : ""
    //   }`
    // );
    console.log(`
    SELECT * FROM parametros_pruebas INNER JOIN pfc_programa ON pfc_programa.pro_id=parametros_pruebas.programa WHERE parametros_pruebas.programa='${programa}' AND parametros_pruebas.tipo='${tipo}' ${
      (SemestreAcademico &&
        " AND parametros_pruebas.semestreAcademico='" +
          SemestreAcademico +
          "'") ||
      ""
    } 
    `);

    const [PruebasRes]: any = await connectionPool.query(`
    SELECT pfc_programa.pro_nom as NombrePrograma, parametros_pruebas.DateDocentesInicio InicioDocente,parametros_pruebas.DateDocentesFin as FinDocente,parametros_pruebas.DateEstudiantesInicio as InicioEstudiante, parametros_pruebas.DateEstudiantesFin as FinEstudiantes, subSedes.nombre as NombreSede, parametros_pruebas.id as IdPrueba FROM parametros_pruebas INNER JOIN subSedes ON (subSedes.id=parametros_pruebas.subSedeId) INNER JOIN pfc_programa ON pfc_programa.pro_id=parametros_pruebas.programa WHERE parametros_pruebas.programa='${programa}' AND parametros_pruebas.tipo='${tipo}' ${
      (SemestreAcademico &&
        " AND parametros_pruebas.semestre='" + SemestreAcademico + "'") ||
      ""
    } 
     `);

    console.log(PruebasRes);

    res.status(200).json({ pruebas: PruebasRes } as Data);
  } catch (error) {
    console.log(error);

    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
