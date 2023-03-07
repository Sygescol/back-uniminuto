import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";
import { Estudiante } from "../../../../typings";

type Data = {
  estudiantes: Estudiante[];
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

    const [AlumnosRes]: any = await connectionPool.query(
      `
      select alumno_num_docu as Documento,concat (alumno_nom1,' ',alumno_nom2) as Nombre,concat (alumno_ape1,' ',alumno_ape2) as Apellidos,alumno_email as Correo,alumno_celular as Celular,alumno_genero as Genero,alumno_rum as RUM,alumno_id as Id, usuario.pass as Pass, usuario.login as Usuario, pfc_alumno.tipo_docu_id as TipoDocumento, subSedes.nombre as NombreSubSede from pfc_alumno LEFT JOIN usuario ON (pfc_alumno.alumno_id=usuario.idUsuario) INNER JOIN subSedes ON subSedes.id=usuario.subsede WHERE usuario.rol=3 ${
        SubSede && SubSede != "0" ? `and usuario.subsede = '${SubSede}'` : ""
      }
      `
    );

    res.status(200).json({ estudiantes: AlumnosRes } as Data);
  } catch (error) {
    console.log(error);

    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
};
